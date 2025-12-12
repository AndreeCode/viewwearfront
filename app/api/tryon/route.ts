import { NextResponse } from "next/server";
import { GoogleGenAI, Part } from "@google/genai";

// Inicializa el cliente de Google Gen AI
// El SDK buscará automáticamente la variable de entorno GEMINI_API_KEY o GOOGLE_API_KEY
const ai = new GoogleGenAI({});

type TryOnReq = {
  personImage: string; // Base64 de la imagen de la persona (data:image/png;base64,...)
  garments: string[];  // Lista de descripciones de prendas
};

/**
 * Convierte una cadena Base64 Data URL (e.g., 'data:image/png;base64,...') en un objeto Part
 * compatible con la API de Gemini, extrayendo dinámicamente el MIME type.
 */
function base64ToGenerativePart(base64DataUrl: string): Part {
  const parts = base64DataUrl.split(",");
  if (parts.length < 2) {
    throw new Error("Formato de Base64 Data URL inválido.");
  }

  // Extrae el MIME type (e.g., image/png)
  const mimeTypeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";
  const base64Data = parts[1];

  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TryOnReq;
    const { personImage, garments } = body;

    // 1. Validación de la entrada
    if (!personImage || !garments?.length) {
      return NextResponse.json({ success: false, error: "Faltan imágenes o prendas." }, { status: 400 });
    }

    // 2. Preparación de la solicitud
    const garmentDesc = garments.map((g) => `- ${g}`).join(", ");
    // Prompt ajustado para decirle al modelo que realice una edición/reemplazo
    const prompt = `Usando la imagen adjunta, haz que la persona use las siguientes prendas: ${garmentDesc}. Preserva su rostro, pose e iluminación. Fondo neutro, proporciones humanas realistas.`;

    const imagePart = base64ToGenerativePart(personImage);

    // 3. Llamada a generateContent (Método de edición de imagen a imagen de Gemini)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Modelo optimizado para tareas multimodales rápidas
      contents: [
        { text: prompt },
        imagePart,
      ],
      config: {
        responseModalities: ['IMAGE'], // Solicitamos solo la imagen como respuesta
      }
    });

    // 4. Procesamiento seguro del resultado (Maneja los tipos opcionales de TypeScript)
    const candidate = response.candidates?.[0];
    const contentParts = candidate?.content?.parts;

    // Verificación de que hay un candidato con contenido
    if (!contentParts) {
      const safetyMessage = candidate?.safetyRatings ?
        " - Revisar SafetyRatings para detalles." : "";

      return NextResponse.json({
        success: false,
        error: `La generación falló o el modelo no devolvió contenido válido${safetyMessage}.`
      }, { status: 500 });
    }

    // Buscamos el primer Part que contenga datos de imagen en línea
    const imagePartResult = contentParts.find(p =>
      p.inlineData && p.inlineData.mimeType?.startsWith('image/')
    );

    // Verificación de que el resultado contiene la Data URL completa
    if (!imagePartResult?.inlineData || !imagePartResult.inlineData.mimeType) {
      return NextResponse.json({
        success: false,
        error: "La generación de imagen fue exitosa pero no se encontró la imagen resultante en la respuesta."
      }, { status: 500 });
    }

    // 5. Formato de la respuesta
    const base64Result = imagePartResult.inlineData.data;
    const resultImageMimeType = imagePartResult.inlineData.mimeType;

    return NextResponse.json({
      success: true,
      resultImage: `data:${resultImageMimeType};base64,${base64Result}`,
    });
  } catch (err) {
    // 6. Manejo de errores
    console.error("Error en /api/tryon:", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}