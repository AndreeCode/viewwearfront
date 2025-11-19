"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Sparkles, X, Home, Check } from "lucide-react"
import Image from "next/image"

type Category = "shirts" | "pants" | "shoes" | "jackets"

interface Garment {
  id: string
  name: string
  category: Category
  image: string
}


const GARMENTS: Garment[] = [

  { id: "s1", name: "Polo Blanco Clásico", category: "shirts", image: "/white-polo-shirt.png" },
  { id: "s2", name: "Polo Negro Premium", category: "shirts", image: "/black-polo-shirt.png" },


  { id: "p1", name: "Pantalón Negro Formal", category: "pants", image: "/black-formal-pants.jpg" },
  { id: "p2", name: "Jeans Azul Clásico", category: "pants", image: "/classic-blue-jeans.png" },

  { id: "sh1", name: "Zapatos Negros Formales", category: "shoes", image: "/black-formal-shoes.jpg" },
  { id: "sh2", name: "Sneakers Blancos", category: "shoes", image: "/white-sneakers.png" },

  { id: "j1", name: "Chaqueta Negra Cuero", category: "jackets", image: "/black-leather-jacket.png" },
  { id: "j2", name: "Blazer Azul Marino", category: "jackets", image: "/navy-blazer.png" },
]

const CATEGORIES = [
  { id: "shirts" as Category, label: "Polos", icon: "👕" },
  { id: "pants" as Category, label: "Pantalones", icon: "👖" },
  { id: "shoes" as Category, label: "Zapatos", icon: "👞" },
  { id: "jackets" as Category, label: "Chaquetas", icon: "🧥" },
]

export default function TryOnPage() {
  const [step,] = useState(1)
  const [personImage, setPersonImage] = useState<string | null>(null)
  const [selectedGarments, setSelectedGarments] = useState<Record<Category, Garment | null>>({
    shirts: null,
    pants: null,
    shoes: null,
    jackets: null,
  })
  const [selectedCategory, setSelectedCategory] = useState<Category>("shirts")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPersonImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const useExamplePhoto = () => {
    setPersonImage("/professional-person-full-body-portrait.jpg")
  }

  const toggleGarment = (garment: Garment) => {
    setSelectedGarments((prev) => ({
      ...prev,
      [garment.category]: prev[garment.category]?.id === garment.id ? null : garment,
    }))
  }

  const hasAtLeastOneGarment = Object.values(selectedGarments).some((g) => g !== null)
  

  const handleTryOn = async () => {
  if (!personImage || !hasAtLeastOneGarment) return;
  setIsProcessing(true);

  try {
    const resizeBase64Img = (base64: string, minSize = 256): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img")

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = Math.max(minSize / img.width, minSize / img.height, 1);
          canvas.width = Math.ceil(img.width * scale);
          canvas.height = Math.ceil(img.height * scale);

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("No se pudo crear el contexto del canvas");

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = (err) => reject(err);
        img.src = base64;
      });
    };

    const resizedPersonImage = await resizeBase64Img(personImage);

    const garmentsList = Object.values(selectedGarments)
      .filter((g) => g)
      .map((g) => g!.name);

    const res = await fetch("/api/tryon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personImage: resizedPersonImage,
        garments: garmentsList,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.resultImage) {
      console.error("Error en la API:", data);
      alert(data?.error || "Ocurrió un error al generar la imagen");
      return;
    }

    setResultImage(data.resultImage);
    setShowResultModal(true);
  } catch (error) {
    console.error("Error generando la imagen:", error);
    alert("Hubo un problema al procesar tu imagen.");
  } finally {
    setIsProcessing(false);
  }
};





  const closeModal = () => {
    setShowResultModal(false)
  }

  const filteredGarments = GARMENTS.filter((g) => g.category === selectedCategory)
  const selectedInCategory = selectedGarments[selectedCategory]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-lg font-bold text-lg md:text-xl">
                V
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">ViewWear</h1>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Inicio</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-base font-semibold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              {step > 1 ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : "1"}
            </div>
            <span className="text-xs md:text-sm font-medium whitespace-nowrap">Foto</span>
          </div>
          <div className="w-8 md:w-12 h-0.5 bg-border" />
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-base font-semibold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              {step > 2 ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : "2"}
            </div>
            <span className="text-xs md:text-sm font-medium whitespace-nowrap">Prendas</span>
          </div>
          <div className="w-8 md:w-12 h-0.5 bg-border" />
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-base font-semibold ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              3
            </div>
            <span className="text-xs md:text-sm font-medium whitespace-nowrap">Resultado</span>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
          {/* Left: Photo Upload */}
          <Card className="p-4 md:p-6 bg-card border-border h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold">1. Tu Foto</h3>
              {!personImage && (
                <Button variant="outline" size="sm" onClick={useExamplePhoto} className="text-xs bg-transparent">
                  Usar ejemplo
                </Button>
              )}
            </div>

            {!personImage ? (
              <label className="flex flex-col items-center justify-center h-[300px] md:h-[400px] border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground transition-colors">
                <Upload className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-1">Sube tu foto</p>
                <p className="text-xs text-muted-foreground">PNG, JPG hasta 10MB</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-secondary">
                  <Image src={personImage || "/placeholder.svg"} alt="Tu foto" fill className="object-contain" />
                </div>
                <Button variant="outline" size="sm" onClick={() => setPersonImage(null)} className="w-full">
                  Cambiar foto
                </Button>
              </div>
            )}
          </Card>

          {/* Right: Garment Selection */}
          <Card className="p-4 md:p-6 bg-card border-border h-fit">
            <h3 className="text-base md:text-lg font-semibold mb-4">2. Selecciona Prendas (al menos una)</h3>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="whitespace-nowrap relative text-xs md:text-sm flex-shrink-0"
                >
                  <span className="mr-1 md:mr-2">{cat.icon}</span>
                  {cat.label}
                  {selectedGarments[cat.id] && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
              {filteredGarments.map((garment) => (
                <button
                  key={garment.id}
                  onClick={() => toggleGarment(garment)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${selectedInCategory?.id === garment.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground"
                    }`}
                >
                  <Image src={garment.image || "/placeholder.svg"} alt={garment.name} fill className="object-cover" />
                  {selectedInCategory?.id === garment.id && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2 w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5 md:p-2">
                    <p className="text-white text-[10px] md:text-xs font-medium text-balance leading-tight">
                      {garment.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {selectedInCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSelectedGarments((prev) => ({
                    ...prev,
                    [selectedCategory]: null,
                  }))
                }
                className="w-full mb-4 text-muted-foreground text-xs md:text-sm"
              >
                <X className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                No seleccionar {CATEGORIES.find((c) => c.id === selectedCategory)?.label.toLowerCase()}
              </Button>
            )}

            {/* Try On Button */}
            <Button
              size="lg"
              onClick={handleTryOn}
              disabled={!personImage || !hasAtLeastOneGarment || isProcessing}
              className="w-full text-sm md:text-base"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Probar Prendas
                </>
              )}
            </Button>

            {hasAtLeastOneGarment && (
              <div className="mt-4 p-3 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Prendas seleccionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedGarments).map(
                    ([category, garment]) =>
                      garment && (
                        <span
                          key={category}
                          className="text-[10px] md:text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {garment.name}
                        </span>
                      ),
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl md:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                <h3 className="text-xl md:text-2xl font-bold">Resultado</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>

            <div className="p-4 md:p-6">
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
                {/* Original */}
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 font-medium">Original</p>
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
                    <Image src={personImage || "/placeholder.svg"} alt="Original" fill className="object-contain" />
                  </div>
                </div>

                {/* Result */}
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 font-medium">
                    Con las prendas seleccionadas
                  </p>
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
                    <Image src={resultImage || "/placeholder.svg"} alt="Resultado" fill className="object-contain" />
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button variant="outline" onClick={closeModal} className="w-full sm:w-auto bg-transparent">
                  Probar otras prendas
                </Button>
                <Button className="w-full sm:w-auto">Descargar resultado</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
