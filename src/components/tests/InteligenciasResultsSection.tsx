import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { INTELLIGENCES, InteligenciasResult } from "@/lib/inteligenciasMultiplas";
import { Share2, Brain, Lightbulb, Target, BookOpen, Wrench, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IntelligenceMapCards } from "./inteligencias/IntelligenceMapCards";

interface InteligenciasResultsSectionProps {
  inteligenciasResults: InteligenciasResult;
  userName: string;
  lang: 'pt' | 'pt-pt' | 'en';
}

export function InteligenciasResultsSection({ 
  inteligenciasResults, 
  userName,
  lang 
}: InteligenciasResultsSectionProps) {
  const top3 = inteligenciasResults.ranking.slice(0, 3);
  const lowestIntel = INTELLIGENCES[inteligenciasResults.lowest];
  const dominantIntel = INTELLIGENCES[inteligenciasResults.top1];
  const langKey = lang === 'pt-pt' ? 'pt' : lang;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Meu Perfil de Inteligências Múltiplas',
        text: `Descobri que minha inteligência dominante é ${dominantIntel.name[langKey]}! Descubra a sua também.`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* CAPA DO RELATÓRIO */}
      <Card className="border-none bg-gradient-to-br from-[hsl(var(--accent))]/10 via-[hsl(var(--accent))]/5 to-background overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--accent))] to-transparent" />
        <CardContent className="pt-16 pb-16 text-center relative">
          <div className="text-7xl mb-6">🧠</div>
          <h1 className="text-4xl font-light tracking-tight mb-3">
            Inteligências Múltiplas
          </h1>
          <h2 className="text-2xl font-light text-muted-foreground mb-6">
            Seu Jeito de Pensar, Aprender e Criar
          </h2>
          <div className="max-w-2xl mx-auto mt-8 pt-8 border-t border-border/30">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {userName}, este perfil não mede quanto você é inteligente. Ele mostra <strong>como</strong> você é inteligente. 
              Revela seus padrões de funcionamento mental, como você aprende, resolve problemas e cria soluções.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
              <div>Data: {new Date().toLocaleDateString("pt-BR")}</div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div>Relatório NELLO ONE</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TOP 3 INTELIGÊNCIAS COM PROFUNDIDADE */}
      <Card className="border-2 border-[hsl(var(--accent))]">
        <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/10 to-background">
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <span className="text-3xl">🏆</span>
            Suas 3 Inteligências Dominantes
          </CardTitle>
          <CardDescription className="text-base">
            Essas são as formas como você naturalmente processa o mundo
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          {top3.map((item, idx) => {
            const intel = INTELLIGENCES[item.key];
            const badges = ['🥇', '🥈', '🥉'];
            const borderColors = [
              'border-[hsl(var(--accent))]',
              'border-amber-500/50',
              'border-orange-500/30'
            ];
            
            return (
              <div key={item.key} className={`p-6 rounded-lg border-2 ${borderColors[idx]} bg-gradient-to-r from-muted/30 to-transparent`}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{intel.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{intel.name[langKey]}</h3>
                      <span className="text-2xl">{badges[idx]}</span>
                      <Badge variant={idx === 0 ? "default" : "outline"} className="ml-auto">
                        {item.percentage}% • {item.score}/25 pts
                      </Badge>
                    </div>
                    <Progress value={item.percentage} className="h-2 mb-4" />
                  </div>
                </div>
                
                {/* Descrição Profunda */}
                <div className="space-y-4 pl-14">
                  <p className="text-muted-foreground leading-relaxed">
                    {intel.description[langKey]}
                  </p>
                  
                  {/* Frases de Identificação */}
                  <div className="bg-[hsl(var(--accent))]/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-[hsl(var(--accent))]" />
                      {userName}, você provavelmente se reconhece quando...
                    </h4>
                    <ul className="space-y-2">
                      {intel.identificationPhrases[langKey].map((phrase, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-[hsl(var(--accent))] mt-1">•</span>
                          {phrase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* RANKING COMPLETO COM ANÁLISE */}
      <Card className="border-2 border-[hsl(var(--accent))]/30">
        <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-background">
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Ranking Completo
          </CardTitle>
          <CardDescription className="text-base">
            Suas 8 inteligências em ordem de expressão
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-4">
          {inteligenciasResults.ranking.map((item, idx) => {
            const intel = INTELLIGENCES[item.key];
            const isTop3 = idx < 3;
            const isLowest = idx === inteligenciasResults.ranking.length - 1;
            
            return (
              <div 
                key={item.key} 
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  isTop3 ? 'bg-[hsl(var(--accent))]/10' : 
                  isLowest ? 'bg-amber-500/10' : 'bg-muted/30'
                }`}
              >
                <span className="text-2xl w-10">{intel.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${isTop3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {intel.name[langKey]}
                    </span>
                    <span className="text-sm font-bold">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              </div>
            );
          })}
          
          {/* Análise do Conjunto */}
          <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-[hsl(var(--accent))]/10 to-transparent border border-[hsl(var(--accent))]/20">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-[hsl(var(--accent))]" />
              O que esse conjunto revela sobre você
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {userName}, com <strong>{INTELLIGENCES[top3[0].key].name[langKey]}</strong> e <strong>{INTELLIGENCES[top3[1].key].name[langKey]}</strong> fortes, 
              você tende a aprender melhor quando pode {INTELLIGENCES[top3[0].key].learningStyle[langKey].toLowerCase()}. 
              Seu perfil indica que você processa informações de forma {top3[0].percentage > 70 ? 'muito intensa' : 'equilibrada'} nessas áreas, 
              o que significa que essas são suas ferramentas naturais de pensamento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* O QUE SIGNIFICA CADA INTELIGÊNCIA */}
      <IntelligenceMapCards results={inteligenciasResults} lang={lang} />

      {/* INTELIGÊNCIAS EM EXCESSO */}
      <Card className="border-2 border-amber-500/30">
        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-background">
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <span className="text-3xl">⚖️</span>
            Quando suas Forças viram Excesso
          </CardTitle>
          <CardDescription className="text-base">
            Toda força usada sem equilíbrio tem um preço
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {userName}, suas inteligências mais fortes são presentes naturais. Mas quando usadas em excesso ou como única forma de lidar com a vida, podem virar armadilhas.
          </p>
          
          {top3.slice(0, 2).map((item) => {
            const intel = INTELLIGENCES[item.key];
            return (
              <div key={item.key} className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{intel.emoji}</span>
                  <h4 className="font-semibold">{intel.name[langKey]} em excesso</h4>
                </div>
                <ul className="space-y-2 pl-10">
                  {intel.excessBehaviors[langKey].map((behavior, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                      {behavior}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* INTELIGÊNCIA EM DESENVOLVIMENTO */}
      <Card className="border-2 border-sky-500/30">
        <CardHeader className="bg-gradient-to-r from-sky-500/10 to-background">
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <span className="text-3xl">🌱</span>
            Área para Desenvolvimento
          </CardTitle>
          <CardDescription className="text-base">
            Sua inteligência com maior potencial de crescimento
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{lowestIntel.emoji}</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{lowestIntel.name[langKey]}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {userName}, quando essa inteligência é menos desenvolvida, é comum você evitar situações que exigem {lowestIntel.shortDescription[langKey].toLowerCase()}. 
                Isso pode significar perder oportunidades que exigiriam justamente essa capacidade.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-sky-500/5 border border-sky-500/20">
                  <h4 className="font-medium mb-2">Situações que você pode estar evitando:</h4>
                  <ul className="space-y-1">
                    {lowestIntel.challenges[langKey].map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-sky-500">•</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <h4 className="font-medium mb-2 text-emerald-700 dark:text-emerald-400">Por que vale a pena desenvolver:</h4>
                  <p className="text-sm text-muted-foreground">
                    {lowestIntel.developmentPractice[langKey].weak}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* APLICAÇÕES PRÁTICAS */}
      <Card className="border-2 border-[hsl(var(--accent))]/30">
        <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-background">
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            Aplicações Práticas no Dia a Dia
          </CardTitle>
          <CardDescription className="text-base">
            Como usar suas inteligências a seu favor
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          {/* Como aprende melhor */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent))]/10">
                <BookOpen className="h-6 w-6 text-[hsl(var(--accent))]" />
              </div>
              <h3 className="font-semibold text-xl">Como você aprende melhor</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {top3.slice(0, 2).map((item) => {
                const intel = INTELLIGENCES[item.key];
                return (
                  <div key={item.key} className="p-4 rounded-lg bg-muted/30 border-l-4 border-[hsl(var(--accent))]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{intel.emoji}</span>
                      <span className="font-medium text-sm">{intel.name[langKey]}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{intel.practicalApplications[langKey].learning}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Como resolve problemas */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent))]/10">
                <Target className="h-6 w-6 text-[hsl(var(--accent))]" />
              </div>
              <h3 className="font-semibold text-xl">Como você resolve problemas</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {top3.slice(0, 2).map((item) => {
                const intel = INTELLIGENCES[item.key];
                return (
                  <div key={item.key} className="p-4 rounded-lg bg-muted/30 border-l-4 border-emerald-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{intel.emoji}</span>
                      <span className="font-medium text-sm">{intel.name[langKey]}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{intel.practicalApplications[langKey].problemSolving}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* No trabalho e projetos */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent))]/10">
                <Wrench className="h-6 w-6 text-[hsl(var(--accent))]" />
              </div>
              <h3 className="font-semibold text-xl">No trabalho e projetos</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {top3.slice(0, 2).map((item) => {
                const intel = INTELLIGENCES[item.key];
                return (
                  <div key={item.key} className="p-4 rounded-lg bg-muted/30 border-l-4 border-sky-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{intel.emoji}</span>
                      <span className="font-medium text-sm">{intel.name[langKey]}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{intel.practicalApplications[langKey].workProjects}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRÁTICAS DE DESENVOLVIMENTO */}
      <Card className="border-2 border-[hsl(var(--accent))]/30">
        <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-background">
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            Práticas de Desenvolvimento
          </CardTitle>
          <CardDescription className="text-base">
            Sugestões para potencializar e equilibrar suas inteligências
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          {/* Potencializar fortes */}
          <div className="p-6 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="h-5 w-5" />
              Para potencializar sua {INTELLIGENCES[top3[0].key].name[langKey]}
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {INTELLIGENCES[top3[0].key].developmentPractice[langKey].strong}
            </p>
          </div>
          
          {/* Estimular fracas */}
          <div className="p-6 rounded-lg bg-sky-500/5 border border-sky-500/20">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-sky-700 dark:text-sky-400">
              <Target className="h-5 w-5" />
              Para estimular sua {lowestIntel.name[langKey]}
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {lowestIntel.developmentPractice[langKey].weak}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* BLOCO FINAL */}
      <Card className="border-none bg-gradient-to-br from-[hsl(var(--accent))]/10 via-[hsl(var(--accent))]/5 to-background">
        <CardContent className="pt-12 pb-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-light flex items-center justify-center gap-2">
              <span className="text-3xl">🧭</span>
              Uma Leitura Direta do Seu Jeito de Pensar
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                O que aparece aqui não é sobre ser mais inteligente. É sobre entender <strong>como você é inteligente</strong>.
              </p>
              <p>
                {userName}, este perfil não mede valor. Ele mostra como você funciona. 
                Não existe inteligência melhor, existe encaixe com a vida que você quer construir.
              </p>
              <p className="font-medium text-foreground">
                Tomar consciência disso muda escolhas. Muda a forma como você estuda, trabalha, se relaciona e cria.
              </p>
            </div>
            {navigator.share && (
              <div className="pt-4">
                <Button onClick={handleShare} variant="outline" size="lg" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar Resultado
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
