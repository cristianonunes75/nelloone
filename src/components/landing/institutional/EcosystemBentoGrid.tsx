import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Brain, Heart, Zap, Users, Briefcase } from "lucide-react";
import { CrossDivider } from "@/components/landing/v2/CrossDivider";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ecosystemModules = [
  {
    id: 'identity',
    name: 'Identity',
    tagline: 'Onde Tudo Começa',
    description: 'Jornada de autoconhecimento em 7 etapas. Clareza sobre quem você é, seus padrões, talentos e propósito.',
    cta: 'Explorar Identity',
    url: 'https://identity.nello.one',
    icon: Brain,
    accentColor: 'from-amber-500/10 via-orange-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(38_70%_50%/0.3)]',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    textAccent: 'text-amber-600',
    size: 'large',
  },
  {
    id: 'life',
    name: 'Life',
    tagline: 'Fé e Rotina',
    description: 'Onde a fé encontra o hábito. Treinos, oração e comunidade para uma vida equilibrada.',
    cta: 'Explorar Life',
    url: 'https://life.nello.one',
    icon: Heart,
    accentColor: 'from-emerald-500/10 via-teal-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(145_55%_42%/0.3)]',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    textAccent: 'text-emerald-600',
    size: 'medium',
  },
  {
    id: 'flow',
    name: 'Flow',
    tagline: 'Foco e Execução',
    description: 'Onde a ideia vira renda. Mentoria com IA para execução, foco e produtividade consciente.',
    cta: 'Explorar Flow',
    url: 'https://flow.nello.one',
    icon: Zap,
    accentColor: 'from-violet-500/10 via-purple-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(252_47%_40%/0.3)]',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    textAccent: 'text-violet-600',
    size: 'medium',
  },
  {
    id: 'business',
    name: 'Hiring',
    tagline: 'Contratação Assertiva',
    description: 'Avaliação comportamental para contratações mais assertivas. DISC + Temperamentos em processos seletivos.',
    cta: 'Soluções de Recrutamento',
    url: 'https://business.nello.one',
    icon: Users,
    accentColor: 'from-blue-500/10 via-cyan-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(210_70%_50%/0.3)]',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
    textAccent: 'text-blue-600',
    size: 'medium',
  },
  {
    id: 'praxis',
    name: 'Praxis',
    tagline: 'Para Profissionais',
    description: 'Plataforma completa para coaches, terapeutas e mentores acompanharem seus clientes.',
    cta: 'Para Profissionais',
    url: 'https://business.nello.one/praxis',
    icon: Briefcase,
    accentColor: 'from-rose-500/10 via-pink-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(340_70%_50%/0.3)]',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600',
    textAccent: 'text-rose-600',
    size: 'small',
  },
];

export const EcosystemBentoGrid = () => {
  const mainModule = ecosystemModules[0]; // Identity
  const secondaryModules = ecosystemModules.slice(1, 4); // Life, Flow, Business
  const praxisModule = ecosystemModules[4]; // Praxis

  return (
    <section id="ecossistema" className="py-20 md:py-28 px-5 sm:px-6 lg:px-8 bg-muted/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4 block">
            5 Módulos. Uma Jornada.
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground font-semibold tracking-tight mb-4">
            O Ecossistema Integrado
          </h2>
          <CrossDivider className="mb-6" />
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Cada módulo é uma extensão do "One" — a unidade que conecta todas as áreas da sua vida.
          </p>
        </motion.div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          
          {/* Identity - Featured/Large */}
          <motion.a
            href={mainModule.url}
            className="group relative md:col-span-2 lg:col-span-2 lg:row-span-2 p-8 lg:p-10 rounded-3xl bg-card border border-border/50 hover:border-border transition-all duration-500 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${mainModule.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute inset-0 ${mainModule.borderGlow} transition-shadow duration-500`} />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-nello-gold/10 text-nello-gold text-xs font-medium">
                  Módulo Principal
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${mainModule.iconBg}`}>
                  <mainModule.icon className={`w-8 h-8 ${mainModule.iconColor}`} />
                </div>
                <div>
                  <span className={`text-xs font-medium ${mainModule.textAccent} uppercase tracking-widest`}>
                    {mainModule.tagline}
                  </span>
                  <h3 className="font-display text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
                    {mainModule.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-foreground/70 text-lg leading-relaxed mb-8 max-w-lg">
                {mainModule.description}
              </p>
              
              <div className="mt-auto">
                <span className={`inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:${mainModule.textAccent} transition-colors`}>
                  {mainModule.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </motion.a>
          
          {/* Secondary Modules - Life, Flow, Business */}
          {secondaryModules.map((module, index) => (
            <motion.a
              key={module.id}
              href={module.url}
              className="group relative p-6 lg:p-8 rounded-3xl bg-card border border-border/50 hover:border-border transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + index * 0.1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`absolute inset-0 ${module.borderGlow} transition-shadow duration-500`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl ${module.iconBg}`}>
                    <module.icon className={`w-5 h-5 ${module.iconColor}`} />
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors" />
                </div>
                
                <span className={`text-xs font-medium ${module.textAccent} uppercase tracking-widest`}>
                  {module.tagline}
                </span>
                <h3 className="font-display text-xl lg:text-2xl font-semibold text-foreground mb-3 tracking-tight">
                  {module.name}
                </h3>
                
                <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                  {module.description}
                </p>
                
                <span className={`inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:${module.textAccent} transition-colors`}>
                  {module.cta}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.a>
          ))}
          
          {/* Praxis - Full Width */}
          <motion.a
            href={praxisModule.url}
            className="group relative md:col-span-2 lg:col-span-3 p-6 lg:p-8 rounded-3xl bg-card border border-border/50 hover:border-border transition-all duration-500 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${praxisModule.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute inset-0 ${praxisModule.borderGlow} transition-shadow duration-500`} />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${praxisModule.iconBg}`}>
                  <praxisModule.icon className={`w-6 h-6 ${praxisModule.iconColor}`} />
                </div>
                <div>
                  <span className={`text-xs font-medium ${praxisModule.textAccent} uppercase tracking-widest`}>
                    {praxisModule.tagline}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground tracking-tight">
                    {praxisModule.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-foreground/60 text-sm leading-relaxed max-w-md">
                {praxisModule.description}
              </p>
              
              <span className={`inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:${praxisModule.textAccent} transition-colors shrink-0`}>
                {praxisModule.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};
