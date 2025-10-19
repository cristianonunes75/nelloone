import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const InfluenceModule = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-gold/5 via-background to-gold/10">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">Novo Módulo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Essentia <span className="text-gold">Influence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Marketing com Propósito e Verdade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunique sua Essência</h3>
              <p className="text-muted-foreground">
                Aprenda a expressar sua verdade interior com autenticidade e propósito.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Marketing Ético</h3>
              <p className="text-muted-foreground">
                Construa presença digital coerente com seus valores e missão cristã.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Influência Autêntica</h3>
              <p className="text-muted-foreground">
                Transforme sua identidade descoberta em comunicação que inspira.
              </p>
            </div>
          </div>

          <div className="text-center bg-card border border-gold/20 rounded-3xl p-8 md:p-12">
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Agora que você descobriu sua essência, é hora de comunicá-la com propósito.
              <br />
              <strong className="text-foreground">Aprenda a transformar sua verdade interior em uma presença autêntica no mundo.</strong>
            </p>
            <Button 
              size="lg" 
              className="bg-gold hover:bg-gold-dark text-foreground font-semibold"
              onClick={() => navigate("/influence")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Quero expressar minha essência
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
