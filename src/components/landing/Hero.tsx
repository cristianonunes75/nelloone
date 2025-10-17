import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
            className="text-6xl md:text-8xl mb-8 animate-fade-in text-white"
          />
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Sua imagem pode comunicar<br />
            <span className="text-gold">verdade, fé e autoridade</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Uma experiência completa de autoconhecimento, consultoria de imagem e fotografia profissional. 
            Tudo com propósito e verdade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gold hover:bg-gold-dark text-white"
              onClick={() => navigate("/auth")}
            >
              Comece sua jornada Essentia
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => {
                document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Conheça o Essentia
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
