import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ExternalLink, Brain, Heart, Zap, Users, Briefcase } from 'lucide-react';
import { NelloWordmark, ModuleBadge } from '@/components/brand/NelloWordmark';
import { NelloSymbolOne } from '@/components/brand/NelloSymbol';

/**
 * Portal NELLO ONE - Institutional Landing Page
 * 
 * NELLO ONE é agora a marca-mãe do ecossistema.
 * "One" representa a unidade de todas as áreas da vida.
 * 
 * Módulos:
 * - NELLO ONE | Identity (Autoconhecimento)
 * - NELLO ONE | Life (Estilo de Vida)
 * - NELLO ONE | Flow (Execução)
 * - NELLO ONE | Business (Gestão)
 * - NELLO ONE | Praxis (Prática Profissional)
 */

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const ecosystemModules = [
  {
    id: 'identity',
    name: 'Identity',
    fullName: 'NELLO ONE | Identity',
    tagline: 'O Fundamento',
    description: 'Clareza sobre quem você é, seus padrões, talentos e propósito através de ciência e autoconhecimento profundo.',
    cta: 'Explorar Módulo',
    url: 'https://identity.nello.one',
    icon: Brain,
    accentColor: 'from-amber-500/10 via-orange-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(38_70%_50%/0.3)]',
    textAccent: 'text-amber-600',
    size: 'large',
  },
  {
    id: 'life',
    name: 'Life',
    fullName: 'NELLO ONE | Life',
    tagline: 'O Equilíbrio',
    description: 'Movimento, espiritualidade e hábitos que sustentam a alma no dia a dia.',
    cta: 'Explorar Módulo',
    url: 'https://life.nello.one',
    icon: Heart,
    accentColor: 'from-emerald-500/10 via-teal-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(145_55%_42%/0.3)]',
    textAccent: 'text-emerald-600',
    size: 'medium',
  },
  {
    id: 'flow',
    name: 'Flow',
    fullName: 'NELLO ONE | Flow',
    tagline: 'A Execução',
    description: 'Produtividade consciente para mentes inquietas que querem transformar ideias em realidade.',
    cta: 'Explorar Módulo',
    url: 'https://flow.nello.one',
    icon: Zap,
    accentColor: 'from-violet-500/10 via-purple-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(252_47%_40%/0.3)]',
    textAccent: 'text-violet-600',
    size: 'medium',
  },
  {
    id: 'business',
    name: 'Business',
    fullName: 'NELLO ONE | Business',
    tagline: 'A Inteligência',
    description: 'Autoconhecimento aplicado a equipes, contratações e cultura organizacional.',
    cta: 'Soluções Corporativas',
    url: 'https://business.nello.one',
    icon: Users,
    accentColor: 'from-blue-500/10 via-cyan-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(210_70%_50%/0.3)]',
    textAccent: 'text-blue-600',
    size: 'medium',
  },
  {
    id: 'praxis',
    name: 'Praxis',
    fullName: 'NELLO ONE | Praxis',
    tagline: 'A Ferramenta',
    description: 'Plataforma completa para coaches, terapeutas e mentores acompanharem seus clientes.',
    cta: 'Para Profissionais',
    url: 'https://business.nello.one/praxis',
    icon: Briefcase,
    accentColor: 'from-rose-500/10 via-pink-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(340_70%_50%/0.3)]',
    textAccent: 'text-rose-600',
    size: 'small',
  },
];

export function InstitutionalLanding() {
  return (
    <>
      <SEOHead
        title="Nello One | Uma Vida. Um Ecossistema."
        description="A inteligência que integra sua essência, sua fé e seu impacto no mundo em uma única jornada unificada."
      />

      <div className="min-h-screen bg-[#F9F9F9] text-[#1A1A1A] selection:bg-nello-gold/20 selection:text-nello-gold-deep">
        
        {/* ========== HEADER ========== */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-2xl border-b border-[#1A1A1A]/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <NelloWordmark variant="nello-one" colorVariant="dark" size="md" />
              
              <nav className="hidden md:flex items-center gap-8">
                <a href="#ecossistema" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
                  Ecossistema
                </a>
                <a href="#nello-ia" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
                  Nello IA
                </a>
                <a href="#investidor" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
                  Investidores
                </a>
              </nav>
              
              <a 
                href="https://identity.nello.one"
                className="text-sm font-medium text-[#1A1A1A] hover:text-nello-gold transition-colors flex items-center gap-1.5"
              >
                Entrar
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-16 lg:h-20" />

        {/* ========== HERO SECTION ========== */}
        <section className="relative py-24 md:py-32 lg:py-44 px-6 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nello-gold/[0.02] to-transparent" />
          
          {/* Glassmorphism abstract element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-30 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nello-gold/20 via-transparent to-violet-500/10 blur-3xl" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-emerald-500/10 via-transparent to-amber-500/15 blur-2xl animate-float" />
            <div className="absolute inset-16 rounded-full bg-[#F9F9F9]/80 backdrop-blur-xl" />
          </div>
          
          <motion.div 
            className="relative max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1A1A]/[0.03] border border-[#1A1A1A]/[0.06] text-xs font-medium text-[#1A1A1A]/50 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Uma Vida. Um Ecossistema.
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#1A1A1A] leading-[1.1] tracking-tight mb-8"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nello-gold via-amber-600 to-nello-gold-deep">
                Nello One
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl lg:text-3xl text-[#1A1A1A]/80 font-display leading-relaxed max-w-3xl mx-auto mb-6"
            >
              A inteligência que integra sua{' '}
              <span className="text-nello-gold">essência</span>, sua{' '}
              <span className="text-nello-gold">fé</span> e seu{' '}
              <span className="text-nello-gold">impacto no mundo</span>
            </motion.p>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-[#1A1A1A]/60 font-light leading-relaxed max-w-2xl mx-auto mb-12"
            >
              Em uma única jornada unificada.
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <a
                href="#ecossistema"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[#1A1A1A]/10 text-[#1A1A1A] font-medium hover:border-nello-gold/30 hover:bg-nello-gold/5 transition-all duration-300 group"
              >
                Explore o Ecossistema
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ========== MANIFESTO ========== */}
        <section className="py-24 md:py-32 px-6">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] font-medium leading-snug tracking-tight text-center">
              "Do autoconhecimento à alta performance profissional, uma jornada unificada para quem busca viver com{' '}
              <span className="text-nello-gold">propósito</span>,{' '}
              <span className="text-nello-gold">foco</span> e{' '}
              <span className="text-nello-gold">verdade</span>."
            </p>
          </motion.div>
        </section>

        {/* ========== ECOSSISTEMA - BENTO GRID ========== */}
        <section id="ecossistema" className="py-24 md:py-32 px-6 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16 md:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-medium text-[#1A1A1A]/40 uppercase tracking-widest mb-4 block">
                5 Módulos. Uma Jornada.
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] font-semibold tracking-tight mb-4">
                O Ecossistema Nello One
              </h2>
              <p className="text-lg text-[#1A1A1A]/60 max-w-2xl mx-auto">
                Cada módulo é uma extensão do "One" — a unidade que conecta todas as áreas da sua vida.
              </p>
            </motion.div>
            
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              
              {/* Identity - Featured/Large */}
              <motion.a
                href={ecosystemModules[0].url}
                className="group relative md:col-span-2 lg:col-span-2 lg:row-span-2 p-8 lg:p-10 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemModules[0].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemModules[0].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <ModuleBadge module="identity" />
                    <ExternalLink className="w-4 h-4 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10">
                      <Brain className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <span className={`text-xs font-medium ${ecosystemModules[0].textAccent} uppercase tracking-widest`}>
                        {ecosystemModules[0].tagline}
                      </span>
                      <h3 className="font-display text-2xl lg:text-3xl font-semibold text-[#1A1A1A] tracking-tight">
                        {ecosystemModules[0].name}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-[#1A1A1A]/60 text-lg leading-relaxed mb-8 max-w-lg">
                    {ecosystemModules[0].description}
                  </p>
                  
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-amber-600 transition-colors">
                      {ecosystemModules[0].cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.a>
              
              {/* Life */}
              <motion.a
                href={ecosystemModules[1].url}
                className="group relative p-6 lg:p-8 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemModules[1].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemModules[1].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                      <Heart className="w-5 h-5 text-emerald-600" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <span className={`text-xs font-medium ${ecosystemModules[1].textAccent} uppercase tracking-widest`}>
                    {ecosystemModules[1].tagline}
                  </span>
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                    {ecosystemModules[1].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                    {ecosystemModules[1].description}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-emerald-600 transition-colors">
                    {ecosystemModules[1].cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
              
              {/* Flow */}
              <motion.a
                href={ecosystemModules[2].url}
                className="group relative p-6 lg:p-8 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemModules[2].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemModules[2].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-violet-500/10">
                      <Zap className="w-5 h-5 text-violet-600" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <span className={`text-xs font-medium ${ecosystemModules[2].textAccent} uppercase tracking-widest`}>
                    {ecosystemModules[2].tagline}
                  </span>
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                    {ecosystemModules[2].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                    {ecosystemModules[2].description}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-violet-600 transition-colors">
                    {ecosystemModules[2].cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
              
              {/* Business */}
              <motion.a
                href={ecosystemModules[3].url}
                className="group relative p-6 lg:p-8 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemModules[3].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemModules[3].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <span className={`text-xs font-medium ${ecosystemModules[3].textAccent} uppercase tracking-widest`}>
                    {ecosystemModules[3].tagline}
                  </span>
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                    {ecosystemModules[3].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                    {ecosystemModules[3].description}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-blue-600 transition-colors">
                    {ecosystemModules[3].cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
              
              {/* Praxis */}
              <motion.a
                href={ecosystemModules[4].url}
                className="group relative p-6 lg:p-8 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemModules[4].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemModules[4].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-rose-500/10">
                      <Briefcase className="w-5 h-5 text-rose-600" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <span className={`text-xs font-medium ${ecosystemModules[4].textAccent} uppercase tracking-widest`}>
                    {ecosystemModules[4].tagline}
                  </span>
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                    {ecosystemModules[4].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                    {ecosystemModules[4].description}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-rose-600 transition-colors">
                    {ecosystemModules[4].cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* ========== NELLO IA - A INTELIGÊNCIA UNIFICADA ========== */}
        <section id="nello-ia" className="py-24 md:py-32 px-6 bg-[#1A1A1A] scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4 block">
                A Inteligência Unificada
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white font-semibold tracking-tight mb-6">
                Nello
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Uma única inteligência que conhece sua jornada por inteiro.
              </p>
            </motion.div>
            
            {/* Visual representation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center mb-12">
                <div className="relative">
                  {/* Central Nello symbol */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-nello-gold/20 to-nello-gold/5 flex items-center justify-center border border-nello-gold/30">
                    <NelloSymbolOne size={64} variant="gradient" />
                  </div>
                  
                  {/* Connection lines to modules */}
                  <div className="absolute -inset-16 rounded-full border border-dashed border-white/10" />
                  <div className="absolute -inset-32 rounded-full border border-dashed border-white/5" />
                  
                  {/* Module dots */}
                  <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-500/50" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 w-4 h-4 rounded-full bg-emerald-500/50" />
                  <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-4 h-4 rounded-full bg-violet-500/50" />
                  <div className="absolute bottom-0 left-1/4 translate-y-16 w-4 h-4 rounded-full bg-blue-500/50" />
                  <div className="absolute bottom-0 right-1/4 translate-y-16 w-4 h-4 rounded-full bg-rose-500/50" />
                </div>
              </div>
              
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-white/80 text-lg leading-relaxed mb-8 italic font-display">
                  "Eu sou o Nello, sua inteligência de suporte no ecossistema Nello One. 
                  Eu conheço o que você descobriu sobre si mesmo, e uso isso para te guiar 
                  em cada área da sua vida."
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Visão</p>
                    <p className="text-white font-medium">360º</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Módulos</p>
                    <p className="text-white font-medium">Conectados</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 md:col-span-1 col-span-2">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Jornada</p>
                    <p className="text-white font-medium">Unificada</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========== INVESTIDOR ========== */}
        <section id="investidor" className="py-24 md:py-32 px-6 bg-[#F9F9F9] scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-medium text-[#1A1A1A]/40 uppercase tracking-widest mb-4 block">
                Para Investidores
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] font-semibold tracking-tight mb-4">
                Nello One: Escalando a Inteligência Humana
              </h2>
              <p className="text-lg text-[#1A1A1A]/60 max-w-2xl mx-auto">
                Construindo o futuro do desenvolvimento humano integrado.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A]/[0.06]">
                <p className="text-4xl font-display font-semibold text-nello-gold mb-2">5</p>
                <p className="text-[#1A1A1A]/60 text-sm">Módulos integrados em um único ecossistema</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A]/[0.06]">
                <p className="text-4xl font-display font-semibold text-nello-gold mb-2">SaaS</p>
                <p className="text-[#1A1A1A]/60 text-sm">Modelo unificado B2C e B2B escalável</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A]/[0.06]">
                <p className="text-4xl font-display font-semibold text-nello-gold mb-2">IA</p>
                <p className="text-[#1A1A1A]/60 text-sm">Inteligência proprietária com visão 360º</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a
                href="https://wa.me/5561992430090"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1A1A1A] text-white font-medium hover:bg-[#1A1A1A]/90 transition-all duration-300 group"
              >
                Falar com a Expansão
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer className="py-16 md:py-24 px-6 border-t border-[#1A1A1A]/[0.06]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div>
                <NelloWordmark variant="nello-one" colorVariant="dark" size="md" className="mb-4" />
                <p className="text-sm text-[#1A1A1A]/50 max-w-xs">
                  Uma Vida. Um Ecossistema. A solução definitiva para a fragmentação da vida moderna.
                </p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-4">Módulos</h4>
                <ul className="space-y-3">
                  <li><a href="https://one.nello.one" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">NELLO ONE | Identity</a></li>
                  <li><a href="https://life.nello.one" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">NELLO ONE | Life</a></li>
                  <li><a href="https://flow.nello.one" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">NELLO ONE | Flow</a></li>
                  <li><a href="https://business.nello.one" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">NELLO ONE | Business</a></li>
                  <li><a href="https://business.nello.one/praxis" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">NELLO ONE | Praxis</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-4">Empresa</h4>
                <ul className="space-y-3">
                  <li><a href="#ecossistema" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Conhecer Visão</a></li>
                  <li><a href="#investidor" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Investidores</a></li>
                  <li><a href="https://wa.me/5561992430090" target="_blank" rel="noopener noreferrer" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">WhatsApp</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-4">Legal</h4>
                <ul className="space-y-3">
                  <li><a href="https://one.nello.one/termos" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Termos de Uso</a></li>
                  <li><a href="https://one.nello.one/privacidade" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Privacidade</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-[#1A1A1A]/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#1A1A1A]/40">
                © {new Date().getFullYear()} Nello One. Todos os direitos reservados.
              </p>
              <p className="text-xs text-[#1A1A1A]/40 font-scripture italic">
                Vida de dentro para fora. Com Cristo no centro.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}