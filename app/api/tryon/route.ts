
import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

type TryOnReq = {
  personImage: string; 
  garments: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TryOnReq;
    const { personImage, garments } = body;

    if (!personImage || !garments?.length) {
      return NextResponse.json({ success: false, error: "Faltan imágenes o prendas." }, { status: 400 });
    }

    const garmentDesc = garments.map((g) => `- ${g}`).join(", ");
    const prompt = `Genera una foto realista de la persona usando las siguientes prendas: ${garmentDesc}. Fondo neutro, iluminación natural, proporciones humanas realistas, sin texto.`;

    const base64Data = personImage.split(",")[1]; 
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });

    const client = new InferenceClient(process.env.HF_TOKEN ?? "");

    const result = await client.imageToImage({
      provider: "fal-ai",
      model: "Qwen/Qwen-Image-Edit",
      inputs: blob,
      parameters: {
        prompt,
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
    });

    const arrayBuffer = await result.arrayBuffer();
    const base64Result = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      success: true,
      resultImage: `data:image/png;base64,${base64Result}`,
    });
  } catch (err) {
    console.error("Error en /api/tryon:", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
