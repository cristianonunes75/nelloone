import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import logo from "@/assets/logo.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Essentia Photography" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="mb-8">
            <img 
              src={logo} 
              alt="Essentia" 
              className="h-16 md:h-20 w-auto"
            />
          </div>
          
          <div className="mb-6 inline-block">
            <span className="text-gold text-sm font-medium tracking-wider uppercase">
              Mais que Imagem
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            <span className="block text-gold">Identidade Revelada</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed">
            Cada olhar, cada gesto, cada luz capturada tem um propósito. 
            A verdadeira beleza é expressão de quem você é em essência — e essa essência é divina.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="gold" className="text-base">
              Descobrir Minha Essência
            </Button>
            <Button size="lg" variant="outline" className="text-base border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Conhecer o Processo
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};
