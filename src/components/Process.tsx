import archetypeImage from "@/assets/archetype-image.jpg";

const steps = [
  {
    number: "01",
    title: "Descoberta",
    description: "Identificamos sua essência, valores e missão através de uma conversa profunda sobre quem você é."
  },
  {
    number: "02",
    title: "Arquétipos",
    description: "Definimos seu arquétipo visual que comunica sua identidade de forma autêntica e poderosa."
  },
  {
    number: "03",
    title: "Sessão",
    description: "Capturamos imagens que revelam sua verdadeira essência em um ambiente profissional e acolhedor."
  },
  {
    number: "04",
    title: "Posicionamento",
    description: "Criamos mockups e simulações para você visualizar como sua imagem comunica em diferentes contextos."
  }
];

export const Process = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-gold text-sm font-medium tracking-wider uppercase">
            Como Funciona
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
            O Processo Essentia
          </h2>
          <p className="text-lg text-muted-foreground">
            Uma jornada guiada para revelar e posicionar sua identidade visual com propósito
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <div className="bg-card rounded-2xl p-8 h-full shadow-md hover:shadow-xl transition-all duration-300 border border-border">
                <div className="text-5xl font-bold text-gold/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Image Showcase */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
          <img 
            src={archetypeImage} 
            alt="Arquétipos Essentia" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end justify-center pb-12">
            <div className="text-center">
              <p className="text-primary-foreground text-2xl font-semibold mb-4">
                Pronto para descobrir sua essência?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
