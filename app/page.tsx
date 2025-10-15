import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-lg font-bold text-lg md:text-xl">
                V
              </div>
            
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">ViewWear</h1>
            </Link>
            <Link href="/tryon">
              <Button size="sm" className="md:size-default">
                <span className="hidden sm:inline">Probar Ahora</span>
                <span className="sm:hidden">Probar</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm mb-6 md:mb-8">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>Tecnología de IA Avanzada</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-balance leading-tight">
            Prueba ropa virtualmente con IA
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 text-pretty max-w-2xl mx-auto">
            Visualiza cómo te queda cualquier prenda antes de comprar. Tecnología de vanguardia para una experiencia de
            compra revolucionaria.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link href="/tryon" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6">
                Comenzar Ahora
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-transparent"
            >
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 border-t border-border">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl mx-auto mb-4 md:mb-6">
              <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">IA Avanzada</h3>
            <p className="text-muted-foreground text-base md:text-lg">
              Tecnología de última generación para resultados realistas y precisos en cada prueba
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl mx-auto mb-4 md:mb-6">
              <Zap className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Instantáneo</h3>
            <p className="text-muted-foreground text-base md:text-lg">
              Resultados en segundos. Sin esperas, sin complicaciones, solo resultados rápidos
            </p>
          </div>

          <div className="text-center sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl mx-auto mb-4 md:mb-6">
              <Shield className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Preciso</h3>
            <p className="text-muted-foreground text-base md:text-lg">
              Visualización realista de cómo te quedaría la prenda con alta fidelidad
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 border-t border-border">
        <div className="max-w-3xl mx-auto text-center bg-card border border-border rounded-xl md:rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">Listo para probarlo</h2>
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 text-pretty">
            Sube tu foto y comienza a probar prendas en segundos
          </p>
          <Link href="/tryon" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6">
              Ir al Probador Virtual
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16 md:mt-24">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
              © 2025 ViewWear. Tecnología de prueba virtual impulsada por IA.
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Privacidad</button>
              <button className="hover:text-foreground transition-colors">Términos</button>
              <button className="hover:text-foreground transition-colors">Contacto</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
