import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, Zap, Brain, Lightbulb, Rocket } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

/**
 * Nello Flow Landing Page
 * 
 * Mentor digital com IA para multipotenciais e pessoas dispersas
 * transformarem ideias em ação e renda, usando o Método FLOW.
 */
export default function FlowLanding() {
  return (
    <>
      <SEOHead
        title="Nello Flow | Mentor Digital para Multipotenciais"
        description="Transforme ideias em ação e renda. Mentor digital com IA para multipotenciais usando o Método FLOW."
        keywords="multipotencial, produtividade, foco, método flow, mentor digital, IA"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">Nello Flow</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Entrar
                </Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Mentor Digital com IA</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Transforme ideias em{' '}
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  ação e renda
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Você é multipotencial, cheio de ideias, mas disperso?
                <br />
                O Método FLOW te ajuda a focar no que importa e executar.
              </p>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link to="/auth?signup=true">
                  <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-violet-500/25">
                    Começar Minha Jornada
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-slate-500 text-sm">Grátis para começar • Sem cartão</p>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center gap-8 text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900" />
                    ))}
                  </div>
                  <span className="text-sm">+500 usuários ativos</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Problem Section */}
        <section className="py-20 border-t border-slate-800/50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Você se identifica?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Brain,
                  title: "Muitas ideias, pouca execução",
                  description: "Você tem 10 projetos começados e nenhum terminado"
                },
                {
                  icon: Target,
                  title: "Dificuldade de focar",
                  description: "Cada dia uma nova prioridade, nunca sabe por onde começar"
                },
                {
                  icon: Lightbulb,
                  title: "Potencial desperdiçado",
                  description: "Sente que poderia fazer muito mais, mas algo te trava"
                }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Method Section */}
        <section className="py-20 border-t border-slate-800/50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm mb-6">
                <Rocket className="w-4 h-4" />
                <span>Método FLOW</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                De ideias dispersas a resultados concretos
              </h2>
              <p className="text-xl text-slate-400">
                4 passos simples para transformar sua mente multipotencial em uma máquina de execução
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { letter: "F", title: "Focus", desc: "Identifique o que realmente importa agora" },
                { letter: "L", title: "List", desc: "Organize suas ideias em ações concretas" },
                { letter: "O", title: "Operate", desc: "Execute com foco e sem distrações" },
                { letter: "W", title: "Win", desc: "Celebre vitórias e mantenha momentum" },
              ].map((step, i) => (
                <div key={i} className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/50">
                  <div className="text-6xl font-bold bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
                    {step.letter}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 border-t border-slate-800/50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto para sair do modo "pensar" <br />e entrar no modo "fazer"?
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Comece grátis e descubra como o Flow pode transformar sua produtividade.
              </p>
              <Link to="/auth?signup=true">
                <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-violet-500/25">
                  Começar Agora — É Grátis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 border-t border-slate-800/50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-400">Nello Flow</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 text-sm">Parte da família Nello</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <a href="https://one.nello.one" className="hover:text-slate-300 transition-colors">Nello One</a>
                <a href="https://life.nello.one" className="hover:text-slate-300 transition-colors">Nello Life</a>
                <Link to="/termos" className="hover:text-slate-300 transition-colors">Termos</Link>
                <Link to="/privacidade" className="hover:text-slate-300 transition-colors">Privacidade</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
