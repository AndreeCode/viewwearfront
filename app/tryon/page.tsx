"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Upload,
  Sparkles,
  X,
  Home,
  Check,
  Camera,
  Download,
  Plus,
  Shirt,
  Trash2,
  Loader2,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import { CameraCapture } from "@/components/CameraCapture"
import { cn } from "@/lib/utils"

// --- Types ---

type Category = "shirts" | "pants" | "shoes" | "jackets"

interface Garment {
  id: string
  name: string
  category: Category
  image: string
  isCustom?: boolean
}

// --- Constants ---

const INITIAL_GARMENTS: Garment[] = [
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

// --- Main Components ---

export default function TryOnPage() {
  // State
  const [step, setStep] = useState(1)
  const [personImage, setPersonImage] = useState<string | null>(null)

  // Custom Garments Management
  const [allGarments, setAllGarments] = useState<Garment[]>([])
  const [isLoadingGarments, setIsLoadingGarments] = useState(true)
  const [isAddingGarment, setIsAddingGarment] = useState(false)
  const [newGarmentName, setNewGarmentName] = useState("")
  const [newGarmentCategory, setNewGarmentCategory] = useState<Category>("shirts")
  const [newGarmentImage, setNewGarmentImage] = useState<string | null>(null)
  const [isUploadingGarment, setIsUploadingGarment] = useState(false)

  // Selection state
  const [selectedGarments, setSelectedGarments] = useState<Record<Category, Garment | null>>({
    shirts: null,
    pants: null,
    shoes: null,
    jackets: null,
  })
  const [selectedCategory, setSelectedCategory] = useState<Category>("shirts")

  // Process state
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  // Drag state
  const [isDraggingPerson, setIsDraggingPerson] = useState(false)
  const [isDraggingGarment, setIsDraggingGarment] = useState(false)

  // Result state
  const [showResultModal, setShowResultModal] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)

  // Load garments from database on mount
  useEffect(() => {
    loadGarments()
  }, [])

  const loadGarments = async () => {
    try {
      setIsLoadingGarments(true)
      const res = await fetch("/api/garments")
      const data = await res.json()
      if (data.garments) {
        setAllGarments(data.garments)
      }
    } catch (error) {
      console.error("Error loading garments:", error)
    } finally {
      setIsLoadingGarments(false)
    }
  }

  // -- Handlers --

  const processFile = async (file: File, setter: (val: string) => void) => {
    // 1. Show local preview
    const reader = new FileReader()
    reader.onloadend = () => setter(reader.result as string)
    reader.readAsDataURL(file)

    // 2. Upload to server
    try {
      const formData = new FormData()
      formData.append("file", file)
      await fetch("/api/upload", { method: "POST", body: formData })
    } catch (err) {
      console.error("Upload error:", err)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen es demasiado grande (max 10MB)")
      return
    }
    await processFile(file, setter)
  }

  const handleDragOver = (e: React.DragEvent, setDragging: (v: boolean) => void) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent, setDragging: (v: boolean) => void) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }

  const handleDrop = async (e: React.DragEvent, setDragging: (v: boolean) => void, setter: (val: string) => void) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size > 10 * 1024 * 1024) {
          alert("La imagen es demasiado grande (max 10MB)")
          return
        }
        await processFile(file, setter)
      }
    }
  }

  const handleCameraCapture = (base64: string) => {
    setPersonImage(base64)
    setIsCameraOpen(false)
  }

  const handleAddCustomGarment = async () => {
    if (!newGarmentName || !newGarmentImage) return

    try {
      setIsUploadingGarment(true)

      // Upload the garment image to the server
      const blob = await fetch(newGarmentImage).then((r) => r.blob())
      const file = new File([blob], `${newGarmentName}.jpg`, { type: "image/jpeg" })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("isGarment", "true")
      formData.append("garmentName", newGarmentName)
      formData.append("garmentCategory", newGarmentCategory)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error("Error uploading garment")
      }

      // Reload garments from database
      await loadGarments()

      // Reset form
      setNewGarmentName("")
      setNewGarmentImage(null)
      setIsAddingGarment(false)

      // Select the new category to show the added item
      setSelectedCategory(newGarmentCategory)
    } catch (error) {
      console.error("Error adding garment:", error)
      alert("Error al agregar la prenda. Por favor intenta de nuevo.")
    } finally {
      setIsUploadingGarment(false)
    }
  }

  const toggleGarment = (garment: Garment) => {
    setSelectedGarments((prev) => ({
      ...prev,
      [garment.category]: prev[garment.category]?.id === garment.id ? null : garment,
    }))
  }

  const resizeBase64Img = (base64: string, minSize = 512): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img")
      img.onload = () => {
        const canvas = document.createElement("canvas")
        // Maintain aspect ratio but limit max dimension to avoid payload too large
        let width = img.width
        let height = img.height
        const maxDim = 1024

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject("Canvas context error")

        ctx.fillStyle = "#FFFFFF" // Fill white background just in case transparent png
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", 0.9)) // Use JPEG for smaller payload
      }
      img.onerror = reject
      img.src = base64
    })
  }

  const handleTryOn = async () => {
    if (!personImage) return
    setIsProcessing(true)

    try {
      const resizedPersonImage = await resizeBase64Img(personImage)

      const garmentsList = Object.values(selectedGarments)
        .filter((g): g is Garment => g !== null)
        .map((g) => g.name)

      if (garmentsList.length === 0) {
        alert("Por favor selecciona al menos una prenda.")
        setIsProcessing(false)
        return
      }

      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImage: resizedPersonImage,
          garments: garmentsList,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.resultImage) {
        throw new Error(data?.error || "Error generando imagen")
      }

      setResultImage(data.resultImage)
      setShowResultModal(true)
    } catch (error: any) {
      console.error(error)
      alert(error.message || "Hubo un problema procesando tu imagen")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement("a")
      link.href = resultImage
      link.download = `viewwear-tryon-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const filteredGarments = allGarments.filter((g) => g.category === selectedCategory)
  const selectedInCategory = selectedGarments[selectedCategory]
  const hasAtLeastOneGarment = Object.values(selectedGarments).some((g) => g !== null)

  // --- Render ---

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-bold text-foreground">TryWear</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="font-medium rounded-lg text-xs sm:text-sm">
              <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
          </Link>
        </div>
      </header>

      {isCameraOpen && <CameraCapture onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} />}

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="relative flex justify-between items-center">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-10" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary -z-10 transition-all duration-700"
              style={{
                width: personImage ? (hasAtLeastOneGarment ? (resultImage ? "100%" : "50%") : "25%") : "0%",
              }}
            />

            {[
              { num: "1", label: "Foto", done: personImage },
              { num: "2", label: "Prendas", done: hasAtLeastOneGarment },
              { num: "3", label: "Resultado", done: resultImage },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center gap-1 sm:gap-2 bg-background px-1 sm:px-2">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all",
                    step.done
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground",
                  )}
                >
                  {step.done ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.num}
                </div>
                <span className={cn("text-[10px] sm:text-xs font-medium", step.done ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 max-w-7xl mx-auto">
          <section className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Tu Foto</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Sube una imagen de cuerpo completo</p>
            </div>

            <Card
              className={cn(
                "overflow-hidden border-2 border-dashed transition-all",
                isDraggingPerson ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              )}
              onDragOver={(e) => handleDragOver(e, setIsDraggingPerson)}
              onDragLeave={(e) => handleDragLeave(e, setIsDraggingPerson)}
              onDrop={(e) => handleDrop(e, setIsDraggingPerson, setPersonImage)}
            >
              <CardContent className="p-0">
                {!personImage ? (
                  <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Sube tu foto</h3>
                    <p className="text-muted-foreground mb-8 max-w-xs text-sm leading-relaxed">
                      Usa foto de cuerpo completo con buena iluminación
                    </p>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <Button
                        onClick={() => document.getElementById("photo-upload")?.click()}
                        className="w-full font-semibold h-11 rounded-lg bg-primary hover:bg-primary/90"
                      >
                        <Upload className="w-4 h-4 mr-2" /> Subir Archivo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCameraOpen(true)}
                        className="w-full font-semibold h-11 rounded-lg border-border"
                      >
                        <Camera className="w-4 h-4 mr-2" /> Usar Cámara
                      </Button>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setPersonImage)}
                    />
                    <button
                      onClick={() => setPersonImage("/professional-person-full-body-portrait.jpg")}
                      className="text-sm text-primary hover:underline font-medium mt-6"
                    >
                      Usar foto de ejemplo
                    </button>
                  </div>
                ) : (
                  <div className="relative aspect-[3/4] bg-muted group">
                    <Image src={personImage || "/placeholder.svg"} alt="Person" fill className="object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                        className="font-medium rounded-lg text-xs sm:text-sm"
                      >
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Cambiar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setPersonImage(null)}
                        className="font-medium rounded-lg text-xs sm:text-sm"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Borrar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">Elige Prendas</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Selecciona las prendas que quieres probar</p>
              </div>
              <Button
                variant={isAddingGarment ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsAddingGarment(!isAddingGarment)}
                className="font-medium border rounded-lg text-xs sm:text-sm"
              >
                {isAddingGarment ? <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> : <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
                {isAddingGarment ? "Cancelar" : "Agregar"}
              </Button>
            </div>

            {isAddingGarment && (
              <Card className="bg-secondary/50 border">
                <CardContent className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="g-name" className="text-sm font-medium">
                        Nombre
                      </Label>
                      <Input
                        id="g-name"
                        placeholder="Ej. Camisa Azul"
                        value={newGarmentName}
                        onChange={(e) => setNewGarmentName(e.target.value)}
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Categoría</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setNewGarmentCategory(cat.id)}
                            className={cn(
                              "p-2 rounded-lg border transition-all text-center",
                              newGarmentCategory === cat.id
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card hover:bg-secondary border-border",
                            )}
                          >
                            <span className="text-xl">{cat.icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Imagen</Label>
                    <label
                      className={cn(
                        "h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all",
                        isDraggingGarment ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                      )}
                      onDragOver={(e) => handleDragOver(e, setIsDraggingGarment)}
                      onDragLeave={(e) => handleDragLeave(e, setIsDraggingGarment)}
                      onDrop={(e) => handleDrop(e, setIsDraggingGarment, setNewGarmentImage)}
                    >
                      {newGarmentImage ? (
                        <img
                          src={newGarmentImage || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <span className="text-sm text-muted-foreground">Click para subir</span>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e, setNewGarmentImage)}
                      />
                    </label>
                  </div>

                  <Button
                    className="w-full font-semibold h-10 rounded-lg bg-primary hover:bg-primary/90"
                    onClick={handleAddCustomGarment}
                    disabled={!newGarmentName || !newGarmentImage || isUploadingGarment}
                  >
                    {isUploadingGarment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "rounded-lg px-3 sm:px-4 h-9 sm:h-10 flex-shrink-0 font-medium text-xs sm:text-sm",
                      selectedCategory === cat.id && "bg-primary",
                    )}
                  >
                    <span className="mr-1 sm:mr-2">{cat.icon}</span>
                    {cat.label}
                  </Button>
                ))}
              </div>

              {isLoadingGarments ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-h-[400px] sm:max-h-[480px] overflow-y-auto">
                  {filteredGarments.length === 0 ? (
                    <div className="col-span-full py-12 sm:py-16 text-center border-2 border-dashed rounded-lg bg-secondary/30">
                      <Shirt className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="font-bold text-foreground text-sm sm:text-base">No hay prendas</p>
                      <p className="text-xs sm:text-sm mt-1 text-muted-foreground">Agrega tu primera prenda</p>
                    </div>
                  ) : (
                    filteredGarments.map((garment) => (
                      <div
                        key={garment.id}
                        onClick={() => toggleGarment(garment)}
                        className={cn(
                          "group relative aspect-square rounded-lg cursor-pointer overflow-hidden border-2 transition-all",
                          selectedGarments[selectedCategory]?.id === garment.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border bg-secondary/30 hover:border-primary/30",
                        )}
                      >
                        <Image
                          src={garment.image || "/placeholder.svg"}
                          alt={garment.name}
                          fill
                          className="object-cover"
                        />
                        {selectedGarments[selectedCategory]?.id === garment.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-md flex items-center justify-center">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-[10px] sm:text-xs font-medium truncate">{garment.name}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {hasAtLeastOneGarment && (
                <div className="flex flex-wrap gap-2 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    Seleccionado:
                  </span>
                  {Object.values(selectedGarments)
                    .filter((g) => g)
                    .map((g) => (
                      <div
                        key={g!.id}
                        className="flex items-center gap-1.5 bg-card pl-2 sm:pl-2.5 pr-1 py-1 rounded-md border text-[10px] sm:text-xs font-medium"
                      >
                        <span>{g!.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 sm:h-5 sm:w-5 rounded hover:bg-destructive/20 hover:text-destructive"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            toggleGarment(g!)
                          }}
                        >
                          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <Button
              size="lg"
              className={cn(
                "w-full h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-lg transition-all",
                hasAtLeastOneGarment && personImage
                  ? "bg-primary hover:bg-primary/90"
                  : "opacity-50 cursor-not-allowed",
              )}
              onClick={handleTryOn}
              disabled={!personImage || !hasAtLeastOneGarment || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Generar Prueba Virtual
                </>
              )}
            </Button>
          </section>
        </div>
      </main>

      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-background w-full max-w-5xl rounded-2xl overflow-hidden border flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg sm:text-2xl">Tu Resultado</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowResultModal(false)} className="rounded-lg h-8 w-8 sm:h-10 sm:w-10">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-8">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-8 h-full min-h-[400px] sm:min-h-[500px]">
                <div className="flex-1 flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground mb-2 sm:mb-3 text-center uppercase tracking-wider">
                    Original
                  </span>
                  <div className="flex-1 relative rounded-lg overflow-hidden border bg-card">
                    <Image src={personImage || ""} alt="Original" fill className="object-contain" />
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>

                <div className="flex-1 flex flex-col">
                  <span className="text-xs font-medium text-primary mb-2 sm:mb-3 text-center uppercase tracking-wider">
                    Nuevo Look
                  </span>
                  <div className="flex-1 relative rounded-lg overflow-hidden border-2 border-primary bg-card">
                    <Image src={resultImage || ""} alt="Resultado" fill className="object-contain" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowResultModal(false)}
                className="rounded-lg font-medium h-10 sm:h-11 text-xs sm:text-sm"
              >
                Probar otra combinación
              </Button>
              <Button onClick={handleDownload} className="rounded-lg font-medium h-10 sm:h-11 text-xs sm:text-sm bg-primary hover:bg-primary/90">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
