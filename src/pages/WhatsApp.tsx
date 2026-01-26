import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/LogoText";

const WHATSAPP_NUMBER = "5561992430090";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const WhatsApp = () => {
  const { language } = useLanguage();
  
  const content = {
    pt: {
      title: "Fale Conosco pelo WhatsApp",
      subtitle: "Tire suas dúvidas ou peça suporte diretamente com nossa equipe",
      redirecting: "Você será redirecionado automaticamente...",
      buttonText: "Abrir WhatsApp",
      notRedirected: "Se não for redirecionado automaticamente, clique no botão abaixo:",
      backHome: "Voltar para o início"
    },
    en: {
      title: "Contact Us via WhatsApp",
      subtitle: "Ask questions or get support directly from our team",
      redirecting: "You will be redirected automatically...",
      buttonText: "Open WhatsApp",
      notRedirected: "If you are not redirected automatically, click the button below:",
      backHome: "Back to home"
    },
    "pt-pt": {
      title: "Fale Connosco pelo WhatsApp",
      subtitle: "Tire as suas dúvidas ou peça suporte diretamente à nossa equipa",
      redirecting: "Será redirecionado automaticamente...",
      buttonText: "Abrir WhatsApp",
      notRedirected: "Se não for redirecionado automaticamente, clique no botão abaixo:",
      backHome: "Voltar ao início"
    }
  };

  const t = content[language as keyof typeof content] || content.pt;

  useEffect(() => {
    // Auto-redirect after a short delay
    const timer = setTimeout(() => {
      window.location.href = WHATSAPP_URL;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenWhatsApp = () => {
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <LogoText className="h-8" />
        </div>

        {/* WhatsApp Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t.title}
          </h1>
          <p className="text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {/* Redirecting indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {t.redirecting}
        </div>

        {/* Manual button */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t.notRedirected}
          </p>
          <Button
            onClick={handleOpenWhatsApp}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white gap-2 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            {t.buttonText}
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Back home link */}
        <a 
          href="/" 
          className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          {t.backHome}
        </a>
      </div>
    </div>
  );
};

export default WhatsApp;
