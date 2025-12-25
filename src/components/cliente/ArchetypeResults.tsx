import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ARCHETYPES } from "@/lib/archetypes";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ArchetypeResultsProps {
  primaryArchetype: string;
  secondaryArchetype?: string;
  tertiaryArchetype?: string;
  primaryScore: number;
  secondaryScore?: number;
  tertiaryScore?: number;
  allScores?: Record<string, number>;
  userName?: string;
}

export default function ArchetypeResults({
  primaryArchetype,
  secondaryArchetype,
  tertiaryArchetype,
  primaryScore,
  secondaryScore,
  tertiaryScore,
  allScores = {},
  userName = "Você",
}: ArchetypeResultsProps) {
  const primaryData = ARCHETYPES[primaryArchetype];
  const secondaryData = secondaryArchetype ? ARCHETYPES[secondaryArchetype] : null;
  const tertiaryData = tertiaryArchetype ? ARCHETYPES[tertiaryArchetype] : null;

  if (!primaryData) return null;

  // Calculate total points for percentage
  const totalPoints = Object.values(allScores).reduce((sum, score) => sum + score, 0) || 1;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Meu Arquétipo NELLO ONE',
        text: `Descobri que meu arquétipo dominante é ${primaryData.name}! Descubra o seu também.`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* PÁGINA 1 - CAPA DO RELATÓRIO COMPLETO */}
      <Card className="border-none bg-gradient-to-br from-[hsl(var(--accent))]/10 via-[hsl(var(--accent))]/5 to-background overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--accent))] to-transparent" />
        <CardContent className="pt-20 pb-20 text-center relative">
          <div className="text-7xl mb-8">{primaryData.emoji}</div>
          <h1 className="text-5xl font-light tracking-tight mb-4">
            Relatório Completo
          </h1>
          <h2 className="text-3xl font-light text-muted-foreground mb-8">
            Essência Revelada
          </h2>
          <div className="max-w-2xl mx-auto mt-12 pt-12 border-t border-border/30">
            <p className="text-lg italic text-muted-foreground leading-relaxed mb-6">
              "{userName}, você floresce quando vive como <strong>{primaryData.name}</strong> — 
              guiado por propósito, beleza e fé."
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground mt-8">
              <div>Data: {new Date().toLocaleDateString("pt-BR")}</div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div>Relatório NELLO ONE</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PÁGINA 2 - MAPA GERAL (Gráfico dos 12 Arquétipos) */}
      {Object.keys(allScores).length > 0 && (
        <Card className="border-2 border-[hsl(var(--accent))]/30">
          <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-background">
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              <span className="text-3xl">📊</span>
              Mapa Geral dos Arquétipos
            </CardTitle>
            <CardDescription className="text-base">
              Seu campo de presença mostra equilíbrio entre forças criativas, racionais e emocionais. 
              O gráfico abaixo representa como essas energias se distribuem em sua personalidade simbólica.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-4">
            {Object.entries(allScores)
              .sort(([, a], [, b]) => b - a)
              .map(([archetype, score]) => {
                const percentage = Math.round((score / totalPoints) * 100);
                const archetypeData = ARCHETYPES[archetype];
                if (!archetypeData) return null;
                
                const isPrimary = archetype === primaryArchetype;
                
                return (
                  <div key={archetype} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{archetypeData.emoji}</span>
                        <span className={isPrimary ? "font-semibold" : "font-medium"}>
                          {archetypeData.name}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-medium">{percentage}%</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-3 ${isPrimary ? 'bg-[hsl(var(--accent))]/20' : ''}`}
                    />
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      {/* PÁGINA 3 - ARQUÉTIPO DE ESSÊNCIA */}
      <Card className="border-2 border-[hsl(var(--accent))]">
        <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/10 to-background">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--accent))]/20">
              <span className="text-4xl">{primaryData.emoji}</span>
            </div>
            <div>
              <CardTitle className="text-3xl font-light">{primaryData.name}</CardTitle>
              <CardDescription className="text-base">Seu Arquétipo de Essência</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <div className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-transparent p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Descrição Simbólica
            </h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              {primaryData.description}
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              Características Principais
            </h3>
            <div className="grid gap-3">
              {primaryData.characteristics.map((char, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <span className="text-[hsl(var(--accent))] text-lg mt-0.5">•</span>
                  <span className="text-muted-foreground flex-1">{char}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">💪</span>
              Pontos Fortes e Desafios
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <span>✓</span> Quando Alinhado
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {primaryData.alignedBehavior}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                  <span>⚠</span> Quando em Excesso
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {primaryData.excessBehavior}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Estilo Visual e Expressão
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Paleta de Cores Sugerida</h4>
                <div className="flex flex-wrap gap-3 mt-3">
                  {primaryData.colorPalette.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border border-border shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                      <span className="text-xs text-muted-foreground font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Estilo de Expressão</h4>
                <p className="text-sm text-muted-foreground">
                  {primaryData.visualStyle}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="bg-[hsl(var(--accent))]/5 p-6 rounded-lg border border-[hsl(var(--accent))]/20">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">💫</span>
                Frase de Poder
              </h3>
              <p className="text-lg italic text-foreground leading-relaxed">
                "{primaryData.powerPhrase}"
              </p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* PÁGINA 4 - COMBINAÇÃO DE ARQUÉTIPOS SECUNDÁRIOS */}
      {(secondaryArchetype || tertiaryArchetype) && (
        <Card className="border-2 border-[hsl(var(--accent))]/20">
          <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-background">
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              <span className="text-3xl">🪞</span>
              Como seus arquétipos se combinam
            </CardTitle>
            <CardDescription className="text-base">
              Sua essência não é única, é um campo composto
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <p className="text-muted-foreground leading-relaxed text-base">
              {secondaryArchetype && secondaryData && (
                <>
                  <strong>{secondaryData.name}</strong> complementa seu modo de ser {secondaryData.complementsEnergy}.{" "}
                </>
              )}
              {tertiaryArchetype && tertiaryData && (
                <>
                  <strong>{tertiaryData.name}</strong> reforça sua expressão no mundo {tertiaryData.reinforcesExpression}.
                </>
              )}
            </p>

            {secondaryArchetype && secondaryData && (
              <div className="p-6 rounded-lg bg-gradient-to-r from-muted/50 to-transparent border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{secondaryData.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl">{secondaryData.name}</h3>
                    <p className="text-sm text-muted-foreground">Arquétipo Secundário</p>
                  </div>
                  <Badge variant="secondary" className="text-base px-4 py-1">
                    {secondaryScore} pontos
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {secondaryData.description}
                </p>
              </div>
            )}

            {tertiaryArchetype && tertiaryData && (
              <div className="p-6 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{tertiaryData.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{tertiaryData.name}</h3>
                    <p className="text-sm text-muted-foreground">Arquétipo Terciário</p>
                  </div>
                  <Badge variant="outline" className="text-base px-4 py-1">
                    {tertiaryScore} pontos
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {tertiaryData.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PÁGINA 5 - APLICAÇÕES PRÁTICAS */}
      <Card className="border-2 border-[hsl(var(--accent))]/30">
        <CardHeader className="bg-gradient-to-r from-[hsl(var(--accent))]/5 to-background">
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <span className="text-3xl">🧭</span>
            Aplicações Práticas para o seu Dia a Dia
          </CardTitle>
          <CardDescription className="text-base">
            Ações concretas para viver sua essência de {primaryData.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          {/* Vida Pessoal */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent))]/10">
                <span className="text-2xl">💛</span>
              </div>
              <h3 className="font-semibold text-xl">Nos Relacionamentos</h3>
            </div>
            <div className="space-y-3">
              {primaryData.practicalRelationships.map((tip, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border-l-4 border-[hsl(var(--accent))]">
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trabalho e Missão */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent))]/10">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="font-semibold text-xl">No Trabalho</h3>
            </div>
            <div className="space-y-3">
              {primaryData.practicalWork.map((tip, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border-l-4 border-[hsl(var(--accent))]">
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Espiritualidade */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent))]/10">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold text-xl">Para sua Alma</h3>
            </div>
            <div className="space-y-3">
              {primaryData.practicalSpiritual.map((tip, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border-l-4 border-[hsl(var(--accent))]">
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rotina Diária */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent))]/10">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-semibold text-xl">Rotina Diária Sugerida</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20">
                <div className="text-2xl mb-2">🌅</div>
                <h4 className="font-medium text-sm mb-2 text-amber-700 dark:text-amber-400">Pela Manhã</h4>
                <p className="text-xs text-muted-foreground">
                  {primaryData.morningPractice}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-b from-sky-500/10 to-transparent border border-sky-500/20">
                <div className="text-2xl mb-2">☀️</div>
                <h4 className="font-medium text-sm mb-2 text-sky-700 dark:text-sky-400">Durante o Dia</h4>
                <p className="text-xs text-muted-foreground">
                  {primaryData.dailyExpression}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20">
                <div className="text-2xl mb-2">🌙</div>
                <h4 className="font-medium text-sm mb-2 text-indigo-700 dark:text-indigo-400">À Noite</h4>
                <p className="text-xs text-muted-foreground">
                  {primaryData.eveningReflection}
                </p>
              </div>
            </div>
          </div>

          {/* Jaculatória Pessoal */}
          <div className="pt-4">
            <div className="bg-gradient-to-br from-[hsl(var(--accent))]/15 to-[hsl(var(--accent))]/5 p-6 rounded-lg border border-[hsl(var(--accent))]/30">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">🕯️</span>
                Sua Jaculatória Pessoal
              </h3>
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Uma oração breve para repetir ao longo do dia e manter o coração voltado para Deus.
              </p>
              <p className="text-xl italic text-foreground leading-relaxed text-center">
                "{primaryData.personalMantra}"
              </p>
            </div>
          </div>

          {/* Como Cultivar seu Arquétipo */}
          {primaryData.cultivationPractices && (
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--accent))]/10">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-semibold text-xl">Como Cultivar seu Arquétipo</h3>
              </div>
              <div className="space-y-3">
                {primaryData.cultivationPractices.map((practice, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30 border-l-4 border-emerald-500">
                    <p className="text-muted-foreground">{practice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uma Leitura Direta da Sua Essência */}
          <div className="pt-8 border-t">
            <div className="bg-gradient-to-br from-[hsl(var(--accent))]/10 to-[hsl(var(--accent))]/5 p-8 rounded-lg space-y-6">
              <h3 className="font-semibold text-xl flex items-center gap-2">
                <span className="text-2xl">🧭</span>
                Uma Leitura Direta da Sua Essência
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  O que aparece aqui não é aleatório. Esse arquétipo descreve formas muito específicas de como você encara a vida, toma decisões e se posiciona no mundo.
                </p>
                <p>
                  {userName}, não é um texto que serviria para qualquer pessoa. Existem padrões reais por trás dessa leitura: como você se comporta sob pressão, o que te motiva, o que te frustra, o que você busca provar.
                </p>
                <p className="font-medium text-foreground">
                  Se você se reconheceu em alguma dessas descrições, não é coincidência. É reconhecimento.
                </p>
              </div>
              {navigator.share && (
                <div className="pt-4 text-center">
                  <Button onClick={handleShare} variant="outline" size="lg" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartilhar Resultado
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
