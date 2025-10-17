import conceptImage from "@/assets/concept-image.jpg";

export const Manifesto = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={conceptImage} 
                alt="Conceito Essentia" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl p-6 shadow-xl border border-border">
              <p className="text-3xl font-bold text-gold">Essentia</p>
              <p className="text-sm text-muted-foreground">Com propósito</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <span className="text-gold text-sm font-medium tracking-wider uppercase">
                Nosso Manifesto
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
                Onde a fé encontra a estética
              </h2>
            </div>

            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Essentia é mais que imagem, é identidade revelada.</strong>
              </p>
              
              <p>
                Nós acreditamos que a verdadeira beleza é expressão de quem você é em essência — 
                e essa essência é divina.
              </p>
              
              <p>
                Criamos uma plataforma onde a fotografia não é só um registro, mas um chamado à missão. 
                Um lugar onde a fé encontra a estética, onde o arquétipo se encontra com o espírito, 
                e onde a imagem comunica aquilo que você nasceu para ser.
              </p>
              
              <p className="text-foreground font-medium pt-4">
                Uma nova forma de se ver. Uma nova forma de se posicionar.
                <br />
                <span className="text-gold">Com propósito. Com beleza. Com fé.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
