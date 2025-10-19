import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  const navigate = useNavigate();
  const { content, isLoading } = useHomeContent("hero");

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Essentia" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="container relative z-10 px-6 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-24 w-3/4 mx-auto mb-16" />
            <Skeleton className="h-16 w-full mb-6" />
            <Skeleton className="h-12 w-2/3 mx-auto mb-12" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Essentia - Sua imagem com propósito" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-6 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <LogoText 
            variant="outline" 
            className="text-6xl md:text-8xl mb-16 animate-fade-in text-white"
          />
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            {content?.title || "Sua imagem pode comunicar"}<br />
            <span className="text-gold">{(content?.content as any)?.subtitle || "verdade, fé e autoridade"}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            {(content?.content as any)?.description || "Uma experiência completa de autoconhecimento, consultoria de imagem e fotografia profissional. Tudo com propósito e verdade."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gold hover:bg-gold-dark text-white"
              onClick={() => navigate("/auth")}
            >
              {(content?.content as any)?.primaryButtonText || "Comece sua jornada Essentia"}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => {
                document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {(content?.content as any)?.secondaryButtonText || "Conheça o Essentia"}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};
