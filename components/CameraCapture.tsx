"use client"

import React, { useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, Check, X } from "lucide-react"

interface CameraCaptureProps {
    onCapture: (base64Image: string) => void
    onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isStreaming, setIsStreaming] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsStreaming(true)
            }
        } catch (err) {
            console.error("Error accessing camera:", err)
            setError("No se pudo acceder a la cámara. Verifique los permisos.")
        }
    }, [])

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
            setIsStreaming(false)
        }
    }, [])

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext("2d")
            if (ctx) {
                // Flip horizontally for a mirror effect if using user-facing camera
                ctx.translate(canvas.width, 0)
                ctx.scale(-1, 1)
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                const dataUrl = canvas.toDataURL("image/png")
                setCapturedImage(dataUrl)
                stopCamera()
            }
        }
    }, [stopCamera])

    const retake = () => {
        setCapturedImage(null)
        startCamera()
    }

    const confirm = () => {
        if (capturedImage) {
            onCapture(capturedImage)
            onClose()
        }
    }

    // Start camera on mount
    React.useEffect(() => {
        startCamera()
        return () => {
            stopCamera()
        }
    }, [startCamera, stopCamera])

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-card rounded-2xl overflow-hidden shadow-2xl border border-border">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                    <h3 className="text-white font-medium flex items-center gap-2">
                        <Camera className="w-5 h-5" /> Cámara
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                        onClick={onClose}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                {/* Viewport */}
                <div className="relative bg-black aspect-[3/4] md:aspect-video flex items-center justify-center overflow-hidden">
                    {error ? (
                        <div className="text-center p-6">
                            <p className="text-destructive mb-4">{error}</p>
                            <Button onClick={onClose} variant="secondary">Cerrar</Button>
                        </div>
                    ) : capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-6 bg-gradient-to-t from-black/70 to-transparent">
                        {capturedImage ? (
                            <>
                                <Button variant="outline" size="lg" className="rounded-full h-12 px-6 border-white/20 bg-black/40 text-white hover:bg-black/60 hover:text-white backdrop-blur-sm" onClick={retake}>
                                    <RefreshCw className="mr-2 w-4 h-4" /> Repetir
                                </Button>
                                <Button size="lg" className="rounded-full h-12 px-6 bg-white text-black hover:bg-white/90" onClick={confirm}>
                                    <Check className="mr-2 w-4 h-4" /> Usar Foto
                                </Button>
                            </>
                        ) : (
                            <Button
                                size="icon"
                                className="h-16 w-16 rounded-full border-4 border-white bg-transparent hover:bg-white/20 transition-all shadow-lg"
                                onClick={capturePhoto}
                                disabled={!isStreaming}
                            >
                                <span className="sr-only">Tomar foto</span>
                                <div className="w-12 h-12 rounded-full bg-white opacity-90" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
