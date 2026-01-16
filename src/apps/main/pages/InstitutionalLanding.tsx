import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { NelloWordmark } from '@/components/brand/NelloWordmark';

/**
 * Portal Maestro Nello - Institutional Landing Page
 * 
 * World-class design inspired by Apple, Linear, and Stripe.
 * Presenting the complete Nello ecosystem vision for users and investors.
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

const ecosystemApps = [
  {
    id: 'one',
    name: 'Nello One',
    tagline: 'O Diagnóstico',
    description: 'Clareza sobre quem você é, seus padrões, talentos e propósito através de ciência e autoconhecimento profundo.',
    cta: 'Conhecer Metodologia',
    url: 'https://one.nello.one',
    accentColor: 'from-amber-500/10 via-orange-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(38_70%_50%/0.3)]',
    size: 'large',
  },
  {
    id: 'life',
    name: 'Nello Life',
    tagline: 'O Hábito',
    description: 'Movimento, espiritualidade e hábitos que sustentam a alma no dia a dia.',
    cta: 'Ver Estilo de Vida',
    url: 'https://life.nello.one',
    accentColor: 'from-emerald-500/10 via-teal-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(145_55%_42%/0.3)]',
    size: 'medium',
  },
  {
    id: 'flow',
    name: 'Nello Flow',
    tagline: 'A Execução',
    description: 'Produtividade consciente para mentes inquietas que querem transformar ideias em realidade.',
    cta: 'Descobrir o Método',
    url: 'https://flow.nello.one',
    accentColor: 'from-violet-500/10 via-purple-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(252_47%_40%/0.3)]',
    size: 'medium',
  },
  {
    id: 'business',
    name: 'Nello Business',
    tagline: 'A Inteligência',
    description: 'Autoconhecimento aplicado a equipes, contratações e cultura organizacional.',
    cta: 'Soluções Corporativas',
    url: 'https://business.nello.one',
    accentColor: 'from-blue-500/10 via-cyan-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(210_70%_50%/0.3)]',
    size: 'medium',
  },
  {
    id: 'praxis',
    name: 'Nello Praxis',
    tagline: 'A Ferramenta',
    description: 'Plataforma completa para coaches, terapeutas e mentores acompanharem seus clientes.',
    cta: 'Para Profissionais',
    url: 'https://business.nello.one/praxis',
    accentColor: 'from-rose-500/10 via-pink-400/5 to-transparent',
    borderGlow: 'group-hover:shadow-[0_0_60px_-15px_hsl(340_70%_50%/0.3)]',
    size: 'small',
  },
];

export function InstitutionalLanding() {
  return (
    <>
      <SEOHead
        title="Nello | A Inteligência que Integra Essência, Fé e Impacto"
        description="Do autoconhecimento à alta performance profissional. Uma jornada unificada para quem busca viver com propósito, foco e verdade."
      />

      <div className="min-h-screen bg-[#F9F9F9] text-[#1A1A1A] selection:bg-nello-gold/20 selection:text-nello-gold-deep">
        
        {/* ========== HEADER ========== */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-2xl border-b border-[#1A1A1A]/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <NelloWordmark variant="nello" colorVariant="dark" size="md" />
              
              <nav className="hidden md:flex items-center gap-8">
                <a href="#ecossistema" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
                  Ecossistema
                </a>
                <a href="#inteligencia" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
                  Nello IA
                </a>
                <a href="#investidor" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
                  Investidores
                </a>
              </nav>
              
              <a 
                href="https://one.nello.one"
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
                Portal Nello
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#1A1A1A] leading-[1.1] tracking-tight mb-8"
            >
              A Inteligência que Integra sua{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nello-gold via-amber-600 to-nello-gold-deep">
                Essência
              </span>
              , sua{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nello-gold via-amber-600 to-nello-gold-deep">
                Fé
              </span>
              {' '}e seu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nello-gold via-amber-600 to-nello-gold-deep">
                Impacto no Mundo
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl lg:text-2xl text-[#1A1A1A]/60 font-light leading-relaxed max-w-2xl mx-auto mb-12"
            >
              Do autoconhecimento à alta performance profissional, uma jornada unificada para quem busca viver com propósito.
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
                O Ecossistema
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] font-semibold tracking-tight">
                A Jornada em 5 Atos
              </h2>
            </motion.div>
            
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              
              {/* Nello One - Featured/Large */}
              <motion.a
                href={ecosystemApps[0].url}
                className="group relative md:col-span-2 lg:col-span-2 lg:row-span-2 p-8 lg:p-10 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemApps[0].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemApps[0].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium text-nello-gold uppercase tracking-widest">
                      {ecosystemApps[0].tagline}
                    </span>
                    <ExternalLink className="w-4 h-4 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <h3 className="font-display text-3xl lg:text-4xl font-semibold text-[#1A1A1A] mb-4 tracking-tight">
                    {ecosystemApps[0].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-lg leading-relaxed mb-8 max-w-lg">
                    {ecosystemApps[0].description}
                  </p>
                  
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-nello-gold transition-colors">
                      {ecosystemApps[0].cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.a>
              
              {/* Nello Life */}
              <motion.a
                href={ecosystemApps[1].url}
                className="group relative p-6 lg:p-8 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemApps[1].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemApps[1].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-widest">
                      {ecosystemApps[1].tagline}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                    {ecosystemApps[1].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                    {ecosystemApps[1].description}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-emerald-600 transition-colors">
                    {ecosystemApps[1].cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
              
              {/* Nello Flow */}
              <motion.a
                href={ecosystemApps[2].url}
                className="group relative p-6 lg:p-8 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemApps[2].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemApps[2].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-violet-600 uppercase tracking-widest">
                      {ecosystemApps[2].tagline}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                    {ecosystemApps[2].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                    {ecosystemApps[2].description}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-violet-600 transition-colors">
                    {ecosystemApps[2].cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
              
              {/* Nello Business */}
              <motion.a
                href={ecosystemApps[3].url}
                className="group relative p-6 lg:p-8 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemApps[3].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemApps[3].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-widest">
                      {ecosystemApps[3].tagline}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                    {ecosystemApps[3].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                    {ecosystemApps[3].description}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-blue-600 transition-colors">
                    {ecosystemApps[3].cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
              
              {/* Nello Praxis */}
              <motion.a
                href={ecosystemApps[4].url}
                className="group relative md:col-span-2 lg:col-span-1 p-6 lg:p-8 rounded-3xl bg-white border border-[#1A1A1A]/[0.06] hover:border-[#1A1A1A]/10 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ecosystemApps[4].accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 ${ecosystemApps[4].borderGlow} transition-shadow duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-rose-600 uppercase tracking-widest">
                      {ecosystemApps[4].tagline}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50 transition-colors" />
                  </div>
                  
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#1A1A1A] mb-3 tracking-tight">
                    {ecosystemApps[4].name}
                  </h3>
                  
                  <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                    {ecosystemApps[4].description}
                  </p>
                  
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] group-hover:text-rose-600 transition-colors">
                    {ecosystemApps[4].cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* ========== NELLO IA - INTELIGÊNCIA UNIFICADA ========== */}
        <section id="inteligencia" className="py-24 md:py-32 px-6 scroll-mt-20 bg-gradient-to-b from-[#F9F9F9] via-[#F5F5F5] to-[#F9F9F9]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Visual representation of connected dots */}
              <div className="relative mb-12">
                <div className="flex items-center justify-center gap-3 md:gap-5">
                  {['One', 'Life', 'Flow', 'Business', 'Praxis'].map((name, i) => (
                    <div key={name} className="relative">
                      <div 
                        className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border border-[#1A1A1A]/10 flex items-center justify-center"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <span className="text-[10px] md:text-xs font-medium text-[#1A1A1A]/60">
                          {name.slice(0, 2)}
                        </span>
                      </div>
                      {i < 4 && (
                        <div className="absolute top-1/2 -right-2 md:-right-3 w-4 md:w-6 h-px bg-gradient-to-r from-[#1A1A1A]/20 to-transparent" />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Central AI dot */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 w-px h-8 bg-gradient-to-b from-[#1A1A1A]/20 to-nello-gold/40" />
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 w-8 h-8 rounded-full bg-gradient-to-br from-nello-gold to-nello-gold-deep flex items-center justify-center shadow-lg shadow-nello-gold/30">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="mt-20">
                <span className="text-xs font-medium text-[#1A1A1A]/40 uppercase tracking-widest mb-4 block">
                  Inteligência Artificial
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] font-semibold tracking-tight mb-6">
                  Nello
                </h2>
                <p className="text-xl md:text-2xl text-[#1A1A1A]/60 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                  Uma única inteligência que conhece sua jornada por inteiro.
                </p>
                <p className="text-base text-[#1A1A1A]/50 leading-relaxed max-w-xl mx-auto">
                  O Nello é o fio condutor que conecta cada dimensão da sua vida. Ele aprende, 
                  acompanha e orienta — integrando autoconhecimento, hábitos, produtividade e propósito profissional.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========== ESPAÇO DO INVESTIDOR ========== */}
        <section id="investidor" className="py-24 md:py-32 px-6 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="relative p-10 md:p-16 rounded-3xl bg-[#1A1A1A] text-white overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Background gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-nello-gold/10 via-transparent to-violet-500/10" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-nello-gold/5 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <span className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4 block">
                  Para Investidores
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white font-semibold tracking-tight mb-6">
                  Construindo o Futuro do<br />Desenvolvimento Humano
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8 my-12">
                  <div>
                    <div className="text-3xl font-display font-semibold text-nello-gold mb-2">5</div>
                    <div className="text-sm text-white/60">Produtos integrados em um ecossistema SaaS unificado</div>
                  </div>
                  <div>
                    <div className="text-3xl font-display font-semibold text-nello-gold mb-2">B2B + B2C</div>
                    <div className="text-sm text-white/60">Modelo de negócio escalável com múltiplos canais</div>
                  </div>
                  <div>
                    <div className="text-3xl font-display font-semibold text-nello-gold mb-2">IA</div>
                    <div className="text-sm text-white/60">Tecnologia proprietária de personalização contextual</div>
                  </div>
                </div>
                
                <p className="text-white/60 leading-relaxed mb-10 max-w-2xl">
                  O Nello é uma plataforma vertical que integra autoconhecimento, bem-estar, produtividade 
                  e gestão de pessoas — criando uma jornada contínua de desenvolvimento pessoal e profissional.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:investidor@nello.one?subject=Interesse%20de%20Investimento%20-%20Nello"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-nello-gold text-[#1A1A1A] font-medium hover:bg-nello-gold-light transition-colors"
                  >
                    Solicitar Deck Institucional
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:expansao@nello.one?subject=Contato%20Expansão%20-%20Nello"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                  >
                    Falar com a Expansão
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer className="py-16 px-6 border-t border-[#1A1A1A]/[0.06]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
              <div className="lg:col-span-2">
                <NelloWordmark variant="nello" colorVariant="dark" size="md" className="mb-4" />
                <p className="text-sm text-[#1A1A1A]/50 max-w-xs">
                  A inteligência que integra essência, fé e impacto no mundo.
                </p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-4">Ecossistema</h4>
                <ul className="space-y-3">
                  <li><a href="https://one.nello.one" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Nello One</a></li>
                  <li><a href="https://life.nello.one" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Nello Life</a></li>
                  <li><a href="https://flow.nello.one" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Nello Flow</a></li>
                  <li><a href="https://business.nello.one" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Nello Business</a></li>
                  <li><a href="https://business.nello.one/praxis" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Nello Praxis</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-4">Empresa</h4>
                <ul className="space-y-3">
                  <li><a href="#ecossistema" className="text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">Sobre</a></li>
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
                © {new Date().getFullYear()} Nello. Todos os direitos reservados.
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
