import { SEOHead } from '@/components/SEOHead';
import { LogoText } from '@/components/LogoText';
import { 
  Heart, 
  Compass, 
  Sparkles, 
  Briefcase,
  ArrowRight,
  Activity,
  Users,
  Lightbulb
} from 'lucide-react';

/**
 * Institutional Landing Page for Nello Ecosystem
 * 
 * Minimalist, contemplative design presenting the vision
 * of the complete Nello ecosystem.
 * 
 * NO prices, NO commercial CTAs, NO forms.
 */
export function InstitutionalLanding() {
  const ecosystemApps = [
    {
      id: 'life',
      name: 'Life',
      tagline: 'Corpo, rotina e espiritualidade',
      description: 'Movimento diário, hábitos que sustentam e práticas que nutrem a alma.',
      icon: Heart,
      url: 'https://life.nello.one',
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'one',
      name: 'One',
      tagline: 'Autoconhecimento e identidade',
      description: 'Clareza sobre quem você é, seus padrões, talentos e propósito.',
      icon: Compass,
      url: 'https://one.nello.one',
      color: 'from-nello-gold/20 to-amber-500/20',
      borderColor: 'border-nello-gold/30',
      iconColor: 'text-nello-gold',
    },
    {
      id: 'flow',
      name: 'Flow',
      tagline: 'Organização e produtividade consciente',
      description: 'Transforme ideias em ação com clareza e propósito.',
      icon: Sparkles,
      url: 'https://flow.nello.one',
      color: 'from-purple-500/20 to-violet-500/20',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-500',
    },
    {
      id: 'business',
      name: 'Business',
      tagline: 'Valores no trabalho e liderança',
      description: 'Aplique autoconhecimento em equipes, contratações e cultura.',
      icon: Briefcase,
      url: 'https://business.nello.one',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-500',
    },
  ];

  return (
    <>
      <SEOHead
        title="Nello | Um ecossistema para viver melhor a vida"
        description="Corpo, rotina, clareza e fé no dia a dia. Conheça o ecossistema Nello."
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* ========== HEADER ========== */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
          <div className="container px-6 py-4">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <LogoText className="text-xl" variant="solid" />
              <p className="text-xs text-muted-foreground hidden sm:block">
                Um ecossistema para viver melhor
              </p>
            </div>
          </div>
        </header>

        {/* Spacer for fixed header */}
        <div className="h-16" />

        {/* ========== 1️⃣ HERO ========== */}
        <section className="py-24 md:py-32 lg:py-40 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight tracking-tight mb-8">
              Um ecossistema para<br />
              <span className="text-nello-gold font-normal">viver melhor a vida.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              Corpo, rotina, clareza e fé no dia a dia.
            </p>
          </div>
        </section>

        {/* ========== 2️⃣ PROBLEMA HUMANO ========== */}
        <section className="py-20 md:py-28 px-6 bg-muted/20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed mb-8">
              Existe um cansaço que não é só do corpo.
            </p>
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed mb-8">
              Existe uma desorganização que não é só da rotina.
            </p>
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
              Existe uma falta de constância que não é só de disciplina.
            </p>
          </div>
        </section>

        {/* ========== 3️⃣ INTUIÇÃO CENTRAL ========== */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-10 md:gap-16">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-nello-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-5 h-5 text-nello-gold" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-display font-medium text-foreground mb-3">
                  O corpo como porta de entrada
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O movimento físico é onde tudo começa. A saúde do corpo abre espaço para a clareza da mente.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-nello-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-5 h-5 text-nello-gold" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-display font-medium text-foreground mb-3">
                  A rotina como sustentação
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sem estrutura, a vida se dispersa. Com ritmo, há espaço para crescer.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-nello-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-5 h-5 text-nello-gold" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-display font-medium text-foreground mb-3">
                  A clareza como caminho
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Saber quem você é ilumina as escolhas. A identidade guia a direção.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== 4️⃣ O NELLO ========== */}
        <section className="py-20 md:py-28 px-6 bg-muted/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-8">
              Nello
            </h2>
            <p className="text-lg text-foreground/80 font-light leading-relaxed mb-6">
              Um companheiro de jornada.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Não é uma ferramenta fria. Não é uma promessa vazia.<br />
              É uma presença que organiza, escuta e orienta —<br />
              respeitando o seu tempo, seu ritmo e sua fé.
            </p>
          </div>
        </section>

        {/* ========== 5️⃣ O ECOSSISTEMA ========== */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-4">
                O Ecossistema
              </h2>
              <p className="text-muted-foreground text-lg font-light">
                Quatro dimensões, uma jornada integrada.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {ecosystemApps.map((app) => (
                <a
                  key={app.id}
                  href={app.url}
                  className={`group relative p-8 rounded-2xl border ${app.borderColor} bg-gradient-to-br ${app.color} hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-background/80 ${app.iconColor}`}>
                      <app.icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-medium text-foreground mb-1">
                        Nello {app.name}
                      </h3>
                      <p className={`text-sm ${app.iconColor} font-medium mb-3`}>
                        {app.tagline}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ========== 6️⃣ MOVIMENTO COMO MOTOR ========== */}
        <section className="py-20 md:py-28 px-6 bg-muted/20">
          <div className="max-w-2xl mx-auto text-center">
            <Activity className="w-8 h-8 text-nello-gold mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground mb-6">
              O movimento como ponto de partida
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              O ecossistema Nello começa pelo corpo porque é ali que a transformação se torna tangível.
              O exercício físico não é um fim — é o primeiro passo de uma jornada maior.
            </p>
          </div>
        </section>

        {/* ========== 7️⃣ ACOMPANHAMENTO HUMANO ========== */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Users className="w-8 h-8 text-nello-gold mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground mb-6">
              Tecnologia e humanidade, juntas
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              O Nello organiza, mas não substitui.<br />
              Profissionais de saúde, terapeutas, coaches e líderes espirituais<br />
              têm espaço garantido nesta jornada.
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              A tecnologia ilumina. O humano acolhe.
            </p>
          </div>
        </section>

        {/* ========== 8️⃣ LIMITES CLAROS ========== */}
        <section className="py-20 md:py-28 px-6 bg-muted/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground mb-8">
              O que o Nello não é
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>Não é uma rede social.</p>
              <p>Não é uma promessa de transformação instantânea.</p>
              <p>Não é um substituto para profissionais de saúde.</p>
              <p>Não é uma ferramenta para quem busca atalhos.</p>
            </div>
          </div>
        </section>

        {/* ========== 9️⃣ ENCERRAMENTO ========== */}
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed mb-8 italic">
              "Se você chegou até aqui, talvez esteja buscando algo mais profundo
              do que uma nova ferramenta. Talvez esteja buscando um caminho."
            </p>
            
            <div className="w-16 h-px bg-border mx-auto mb-8" />
            
            <p className="text-base text-muted-foreground mb-2">
              Nello
            </p>
            <p className="text-sm text-muted-foreground/70">
              Um companheiro de jornada.
            </p>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer className="py-8 px-6 border-t border-border/30">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <LogoText className="text-lg" variant="solid" />
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Nello — Corpo, rotina, clareza e fé.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
