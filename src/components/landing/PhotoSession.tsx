import { Camera, Palette, Sparkles } from "lucide-react";
import archetypeImage from "@/assets/archetype-image.jpg";

export const PhotoSession = () => {
  return (
    <section className="py-24 bg-accent/20">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sessão Fotográfica <span className="text-gold">com Propósito</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Após seus testes, criamos uma sessão personalizada que revela sua essência através da imagem.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fotografia Profissional</h3>
                  <p className="text-muted-foreground">
                    Sessão completa com direção personalizada baseada no seu perfil de personalidade e arquétipos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Consultoria de Imagem</h3>
                  <p className="text-muted-foreground">
                    Orientação completa sobre cores, estilos e expressões que comunicam sua verdadeira identidade.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Edição Premium</h3>
                  <p className="text-muted-foreground">
                    Todas as fotos editadas profissionalmente e entregues em alta resolução para uso em qualquer mídia.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={archetypeImage} 
                  alt="Sessão fotográfica Essentia" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>

          <div className="bg-gold/10 border border-gold/20 rounded-2xl p-8 text-center">
            <p className="text-lg mb-2">
              <strong className="text-gold">Bônus exclusivo:</strong>
            </p>
            <p className="text-muted-foreground">
              Visualize suas fotos em mockups profissionais para redes sociais, materiais impressos e apresentações.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
