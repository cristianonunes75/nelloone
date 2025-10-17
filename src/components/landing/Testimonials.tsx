import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Padre João Silva",
    role: "Pároco da Paróquia São Francisco",
    text: "O Essentia me ajudou a transmitir verdade e acolhimento através da minha imagem. Os testes revelaram aspectos da minha personalidade que eu não sabia como comunicar visualmente. O resultado foi transformador.",
    image: "👨‍⚕️"
  },
  {
    name: "Dra. Mariana Costa",
    role: "Médica Cardiologista",
    text: "Precisava de uma imagem profissional que transmitisse confiança e empatia. O processo de autoconhecimento foi profundo, e as fotos refletem exatamente quem eu sou e o que represento para meus pacientes.",
    image: "👩‍⚕️"
  },
  {
    name: "Rafael Mendes",
    role: "Empresário e Mentor de Negócios",
    text: "A consultoria de imagem do Essentia foi além das minhas expectativas. Cada detalhe foi pensado para comunicar liderança e autenticidade. Minha presença digital agora reflete meus valores e propósito.",
    image: "👨‍💼"
  },
  {
    name: "Ana Paula Ferreira",
    role: "Coach de Carreira",
    text: "O que mais me impressionou foi como os testes de personalidade guiaram toda a sessão fotográfica. Cada foto conta uma história verdadeira sobre quem eu sou. Recomendo de olhos fechados!",
    image: "👩‍🏫"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              O que dizem sobre o <span className="text-gold">Essentia</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Histórias reais de pessoas que descobriram sua verdadeira essência através da imagem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-xl transition-shadow duration-300 border-border/50"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <Quote className="w-8 h-8 text-gold/30" />
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Pronto para iniciar sua jornada de transformação?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
