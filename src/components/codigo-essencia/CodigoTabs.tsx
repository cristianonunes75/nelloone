import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BarChart3, Heart, Sparkles } from "lucide-react";
import { ReactNode, useState } from "react";

interface CodigoTabsProps {
  essenciaContent: ReactNode;
  perfilContent: ReactNode;
  vidaPraticaContent: ReactNode;
  ativacaoContent: ReactNode;
  language?: string;
}

const translations = {
  pt: {
    essencia: "Sua Essência",
    perfil: "Seu Perfil",
    vidaPratica: "Vida Prática",
    ativacao: "Ativação",
  },
  "pt-pt": {
    essencia: "A Tua Essência",
    perfil: "O Teu Perfil",
    vidaPratica: "Vida Prática",
    ativacao: "Ativação",
  },
  en: {
    essencia: "Your Essence",
    perfil: "Your Profile",
    vidaPratica: "Practical Life",
    ativacao: "Activation",
  },
};

export const CodigoTabs = ({
  essenciaContent,
  perfilContent,
  vidaPraticaContent,
  ativacaoContent,
  language = "pt"
}: CodigoTabsProps) => {
  const [activeTab, setActiveTab] = useState("essencia");
  const t = translations[language as keyof typeof translations] || translations.pt;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Sticky Tab Navigation */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-border/50">
        <TabsList className="w-full h-auto flex-wrap justify-center gap-1 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger 
            value="essencia" 
            className="flex-1 min-w-[100px] gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg py-2.5 px-3 text-xs sm:text-sm font-medium transition-all"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{t.essencia}</span>
            <span className="sm:hidden">Essência</span>
          </TabsTrigger>
          <TabsTrigger 
            value="perfil" 
            className="flex-1 min-w-[100px] gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg py-2.5 px-3 text-xs sm:text-sm font-medium transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.perfil}</span>
            <span className="sm:hidden">Perfil</span>
          </TabsTrigger>
          <TabsTrigger 
            value="vida-pratica" 
            className="flex-1 min-w-[100px] gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm rounded-lg py-2.5 px-3 text-xs sm:text-sm font-medium transition-all"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">{t.vidaPratica}</span>
            <span className="sm:hidden">Vida</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ativacao" 
            className="flex-1 min-w-[100px] gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-600 data-[state=active]:shadow-sm rounded-lg py-2.5 px-3 text-xs sm:text-sm font-medium transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.ativacao}</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        <TabsContent value="essencia" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {essenciaContent}
          </div>
        </TabsContent>

        <TabsContent value="perfil" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {perfilContent}
          </div>
        </TabsContent>

        <TabsContent value="vida-pratica" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {vidaPraticaContent}
          </div>
        </TabsContent>

        <TabsContent value="ativacao" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {ativacaoContent}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
