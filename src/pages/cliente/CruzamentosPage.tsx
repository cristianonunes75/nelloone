import { useLanguage } from "@/contexts/LanguageContext";
import { useCodigoEssenciaAccess } from "@/hooks/useCodigoEssenciaAccess";
import { CruzamentoCodigos } from "@/components/codigo-essencia/CruzamentoCodigos";
import { ImpersonateBanner } from "@/components/ImpersonateBanner";
import { NelloGlobalHeader } from "@/components/global/NelloGlobalHeader";
import { NelloGlobalFooter } from "@/components/global/NelloGlobalFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TRANSLATIONS = {
  pt: {
    title: "Cruzamento de Códigos",
    subtitle: "Compare seu perfil com pessoas importantes da sua vida",
    back: "Voltar",
    locked: {
      title: "Complete sua Jornada",
      description: "Para acessar o Cruzamento de Códigos, você precisa completar todos os 7 testes e gerar seu Código da Essência.",
      cta: "Continuar Jornada"
    }
  },
  'pt-pt': {
    title: "Cruzamento de Códigos",
    subtitle: "Compara o teu perfil com pessoas importantes da tua vida",
    back: "Voltar",
    locked: {
      title: "Completa a tua Jornada",
      description: "Para aceder ao Cruzamento de Códigos, precisas de completar todos os 7 testes e gerar o teu Código da Essência.",
      cta: "Continuar Jornada"
    }
  },
  en: {
    title: "Code Crossing",
    subtitle: "Compare your profile with important people in your life",
    back: "Back",
    locked: {
      title: "Complete Your Journey",
      description: "To access Code Crossing, you need to complete all 7 tests and generate your Essence Code.",
      cta: "Continue Journey"
    }
  }
};

const CruzamentosPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { hasUnlocked, isLoading } = useCodigoEssenciaAccess();
  
  const lang = (language === 'en' ? 'en' : language === 'pt-pt' ? 'pt-pt' : 'pt') as 'pt' | 'pt-pt' | 'en';
  const t = TRANSLATIONS[lang];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Users className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ImpersonateBanner />
      <NelloGlobalHeader />
      
      <main className="flex-1">
        <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
            </div>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </motion.div>

          {/* Content */}
          {hasUnlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CruzamentoCodigos language={lang} hasSavedCodigo={true} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center py-16 px-6 border rounded-2xl bg-muted/30"
            >
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t.locked.title}</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {t.locked.description}
              </p>
              <Button onClick={() => {
                const basePath = lang === 'en' ? '/en' : lang === 'pt-pt' ? '/pt-pt' : '';
                navigate(`${basePath}/cliente`);
              }}>
                {t.locked.cta}
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      
      <NelloGlobalFooter />
    </div>
  );
};

export default CruzamentosPage;
