import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft, Mail, Clock } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-miguel-deep hover:text-miguel-deep/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <LogoText variant="solid" className="text-4xl mb-4" />
          <h1 className="text-3xl md:text-4xl font-semibold text-miguel-deep font-display">
            Estamos aqui para você.
          </h1>
          <p className="text-miguel-deep/70 mt-4 max-w-xl mx-auto leading-relaxed">
            Para dúvidas, suporte ou solicitações sobre sua experiência no NELLO ONE, 
            entre em contato com nossa equipe.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-apple p-8 md:p-12 max-w-2xl mx-auto">
          <div className="space-y-8">
            {/* Suporte */}
            <div className="flex items-start gap-4 p-6 rounded-xl bg-soul-light/50 border border-soul-sand/30">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-medium text-miguel-deep mb-1">Suporte Geral</h3>
                <p className="text-miguel-deep/70 text-sm mb-3">
                  Dúvidas sobre a plataforma, testes, pagamentos ou sua conta.
                </p>
                <a 
                  href="mailto:suporte@nelloone.app"
                  className="text-primary hover:underline font-medium"
                >
                  suporte@nelloone.app
                </a>
              </div>
            </div>

            {/* Privacidade */}
            <div className="flex items-start gap-4 p-6 rounded-xl bg-soul-light/50 border border-soul-sand/30">
              <div className="w-12 h-12 rounded-full bg-miguel-deep/10 flex items-center justify-center flex-shrink-0">
                <svg 
                  className="w-5 h-5 text-miguel-deep" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-miguel-deep mb-1">Privacidade e Dados</h3>
                <p className="text-miguel-deep/70 text-sm mb-3">
                  Solicitações sobre seus dados, exclusão de conta ou direitos de privacidade.
                </p>
                <a 
                  href="mailto:privacidade@nelloone.app"
                  className="text-primary hover:underline font-medium"
                >
                  privacidade@nelloone.app
                </a>
              </div>
            </div>

            {/* Tempo de resposta */}
            <div className="flex items-center gap-3 pt-6 border-t border-soul-sand/30">
              <Clock className="w-5 h-5 text-miguel-silver" strokeWidth={1.5} />
              <p className="text-miguel-deep/70 text-sm">
                <strong className="text-miguel-deep">Tempo médio de resposta:</strong> 1 a 2 dias úteis
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl shadow-apple"
          >
            Voltar para o site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
