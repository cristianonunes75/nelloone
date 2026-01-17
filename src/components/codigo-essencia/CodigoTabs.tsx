import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BarChart3, Heart, Sparkles } from "lucide-react";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

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

  const tabConfig = [
    { 
      value: "essencia", 
      label: t.essencia, 
      shortLabel: "Essência",
      icon: User,
      gradient: "from-[hsl(var(--nello-gold))] to-[hsl(var(--nello-gold-deep))]",
      activeBg: "bg-gradient-to-r from-[hsl(var(--nello-gold)/0.15)] to-[hsl(var(--nello-gold-deep)/0.15)]",
      activeText: "text-[hsl(var(--nello-gold-deep))]",
      activeBorder: "border-[hsl(var(--nello-gold)/0.5)]"
    },
    { 
      value: "perfil", 
      label: t.perfil, 
      shortLabel: "Perfil",
      icon: BarChart3,
      gradient: "from-[hsl(220,50%,18%)] to-[hsl(220,40%,30%)]",
      activeBg: "bg-gradient-to-r from-[hsl(220,50%,18%,0.12)] to-[hsl(220,40%,30%,0.12)]",
      activeText: "text-[hsl(220,50%,30%)]",
      activeBorder: "border-[hsl(220,50%,30%,0.5)]"
    },
    { 
      value: "vida-pratica", 
      label: t.vidaPratica, 
      shortLabel: "Vida",
      icon: Heart,
      gradient: "from-emerald-600 to-teal-600",
      activeBg: "bg-gradient-to-r from-emerald-500/12 to-teal-500/12",
      activeText: "text-emerald-700 dark:text-emerald-400",
      activeBorder: "border-emerald-500/50"
    },
    { 
      value: "ativacao", 
      label: t.ativacao, 
      shortLabel: "Ativação",
      icon: Sparkles,
      gradient: "from-amber-500 to-orange-500",
      activeBg: "bg-gradient-to-r from-amber-500/12 to-orange-500/12",
      activeText: "text-amber-600 dark:text-amber-400",
      activeBorder: "border-amber-500/50"
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Sticky Tab Navigation - Premium Design */}
      <div className="sticky top-16 z-20 bg-background/98 backdrop-blur-md py-3 -mx-4 px-4 border-b border-border/30">
        <TabsList className="w-full h-auto flex justify-center gap-1.5 bg-[hsl(220,50%,18%,0.06)] dark:bg-[hsl(220,50%,80%,0.08)] p-1.5 rounded-2xl border border-border/30">
          {tabConfig.map((tab, index) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value}
              className={`
                flex-1 min-w-[80px] max-w-[140px] gap-1.5 rounded-xl py-3 px-3 
                text-xs sm:text-sm font-medium transition-all duration-300
                border border-transparent
                data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/50
                data-[state=active]:${tab.activeBg} 
                data-[state=active]:${tab.activeText} 
                data-[state=active]:${tab.activeBorder}
                data-[state=active]:shadow-sm
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tab Contents with smooth transitions */}
      <div className="mt-8">
        <TabsContent value="essencia" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            {essenciaContent}
          </motion.div>
        </TabsContent>

        <TabsContent value="perfil" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            {perfilContent}
          </motion.div>
        </TabsContent>

        <TabsContent value="vida-pratica" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            {vidaPraticaContent}
          </motion.div>
        </TabsContent>

        <TabsContent value="ativacao" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            {ativacaoContent}
          </motion.div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
