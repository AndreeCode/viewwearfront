import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, Check, ArrowRight, Zap, Shield, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-bold text-foreground">TryWear</span>
          </Link>
          <div className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium">
            <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">
              Cómo Funciona
            </a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Beneficios
            </a>
          </div>
          <Link href="/tryon">
            <Button className="bg-primary hover:bg-primary/90 transition-colors font-semibold h-9 sm:h-10 px-4 sm:px-6 rounded-lg text-xs sm:text-sm">
              Comenzar
            </Button>
          </Link>
        </div>
      </nav>

      <section className="py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-secondary border border-border">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Prueba Virtual con IA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight text-balance px-4">
              Prueba ropa en segundos
              <br />
              <span className="text-primary">sin salir de casa</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
              Tecnología de inteligencia artificial que te muestra cómo te queda cualquier prenda. Simple, rápido y
              preciso.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4">
              <Link href="/tryon">
                <Button size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 font-semibold rounded-lg text-sm sm:text-base">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Probar Ahora
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 font-semibold rounded-lg border-border hover:bg-secondary bg-transparent text-sm sm:text-base"
              >
                Ver Ejemplo
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span>Gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span>Sin registro</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span>Resultados instantáneos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Cómo Funciona</h2>
              <p className="text-base sm:text-lg text-muted-foreground">Tres pasos simples para ver tu nuevo look</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { num: "1", title: "Sube tu foto", desc: "Toma o sube una imagen de cuerpo completo" },
                { num: "2", title: "Elige prendas", desc: "Selecciona de nuestro catálogo o sube las tuyas" },
                { num: "3", title: "Ve el resultado", desc: "Obtén tu nueva imagen en segundos" },
              ].map((step) => (
                <div key={step.num} className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold">
                    {step.num}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Por Qué TryWear</h2>
              <p className="text-base sm:text-lg text-muted-foreground">La forma más inteligente de comprar ropa online</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Zap,
                  title: "Instantáneo",
                  desc: "Resultados en menos de 3 segundos con nuestra tecnología IA optimizada",
                },
                {
                  icon: Shield,
                  title: "Privado",
                  desc: "Tus imágenes se procesan de forma segura y nunca se almacenan",
                },
                {
                  icon: Clock,
                  title: "24/7 Disponible",
                  desc: "Prueba prendas cuando quieras, sin horarios ni restricciones",
                },
              ].map((feature, i) => (
                <div key={i} className="bg-card rounded-xl p-6 sm:p-8 border border-border">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto bg-primary rounded-2xl p-8 sm:p-12 md:p-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 sm:mb-6">
              Comienza a probar ropa ahora
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/90 mb-6 sm:mb-8">
              Únete a miles de usuarios que ya usan TryWear para comprar con confianza
            </p>
            <Link href="/tryon">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto h-11 sm:h-12 px-8 sm:px-10 font-semibold rounded-lg hover:bg-secondary/90 text-sm sm:text-base"
              >
                Comenzar Gratis
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm sm:text-base">TryWear</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">© 2025 TryWear. Todos los derechos reservados</div>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Términos
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
