import conceptImage from "@/assets/concept-image.jpg";

export const About = () => {
  return (
    <section id="sobre" className="py-24 bg-background">
      <div className="container px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              O que é o <span className="text-gold">Essentia</span>?
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Essentia é mais que um ensaio fotográfico. É uma <strong className="text-foreground">jornada de autoconhecimento</strong> que revela sua identidade verdadeira através da imagem.
              </p>
              <p>
                Combinamos <strong className="text-foreground">9 testes de personalidade</strong> com consultoria de imagem profissional e fotografia de alta qualidade para criar uma imagem que comunica verdade e autenticidade.
              </p>
              <p>
                Seu resultado? Uma imagem que não apenas impressiona, mas que <strong className="text-foreground">comunica quem você realmente é</strong> — sua essência, sua missão, seu propósito.
              </p>
              <p className="text-gold font-semibold pt-4 border-t border-border/30 mt-6">
                Inspirado por valores cristãos, aberto a todos que buscam propósito e autenticidade.
              </p>
              <p className="text-sm text-muted-foreground/80 italic">
                Atendemos exclusivamente em <strong className="text-foreground">Brasília-DF</strong>, garantindo qualidade e excelência em cada detalhe.
              </p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={conceptImage} 
                alt="Conceito Essentia" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
