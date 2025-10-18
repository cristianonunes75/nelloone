import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ARCHETYPES } from "@/lib/archetypes";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Palette, Camera, Share2 } from "lucide-react";
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
}

export default function ArchetypeResults({
  primaryArchetype,
  secondaryArchetype,
  tertiaryArchetype,
  primaryScore,
  secondaryScore,
  tertiaryScore,
  allScores = {},
}: ArchetypeResultsProps) {
  const primary = ARCHETYPES[primaryArchetype];
  const secondary = secondaryArchetype ? ARCHETYPES[secondaryArchetype] : null;
  const tertiary = tertiaryArchetype ? ARCHETYPES[tertiaryArchetype] : null;

  if (!primary) return null;

  // Calculate total points for percentage
  const totalPoints = Object.values(allScores).reduce((sum, score) => sum + score, 0) || 1;
  const primaryPercentage = Math.round((primaryScore / totalPoints) * 100);
  const secondaryPercentage = secondaryScore ? Math.round((secondaryScore / totalPoints) * 100) : 0;
  const tertiaryPercentage = tertiaryScore ? Math.round((tertiaryScore / totalPoints) * 100) : 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Meu Arquétipo Essentia',
        text: `Descobri que meu arquétipo dominante é ${primary.name}! Descubra o seu também.`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title */}
      <Card className="border-none bg-gradient-to-br from-accent/10 to-accent/5">
        <CardContent className="pt-12 pb-10 text-center">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-3xl font-light tracking-tight mb-3">Leitura Completa</h2>
          <p className="text-xl text-muted-foreground font-light">Seu Arquétipo de Essência</p>
        </CardContent>
      </Card>

      {/* Visual Graph - All 12 Archetypes */}
      {Object.keys(allScores).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-light">Seu Campo Arquetípico</CardTitle>
            <CardDescription>Distribuição dos 12 arquétipos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(allScores)
              .sort(([, a], [, b]) => b - a)
              .map(([archetype, score]) => {
                const percentage = Math.round((score / totalPoints) * 100);
                const archetypeData = ARCHETYPES[archetype];
                if (!archetypeData) return null;
                
                return (
                  <div key={archetype} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{archetypeData.emoji}</span>
                        <span className="font-medium">{archetypeData.name}</span>
                      </div>
                      <span className="text-muted-foreground">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      {/* Arquétipo Primário */}
      <Card className="border-2 border-accent">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{primary.emoji}</span>
              <div>
                <CardTitle className="text-2xl font-light">{primary.name}</CardTitle>
                <CardDescription>Arquétipo Predominante · {primaryPercentage}%</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2 bg-accent text-accent-foreground">
              {primaryScore} {primaryScore === 1 ? 'ponto' : 'pontos'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Sua Essência
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {primary.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Características Marcantes</h3>
            <div className="grid gap-2">
              {primary.characteristics.map((char, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm">{char}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Direção Fotográfica
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {primary.photographyDirection}
            </p>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Estilo Visual: </span>
                <span className="text-sm text-muted-foreground">{primary.visualStyle}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Paleta de Cores Sugerida
            </h3>
            <div className="flex gap-2 flex-wrap">
              {primary.colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arquétipo Secundário */}
      {secondary && secondaryScore && (
        <Card>
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{secondary.emoji}</span>
                <div>
                  <CardTitle className="text-xl">{secondary.name}</CardTitle>
                  <CardDescription>Arquétipo Secundário</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {secondaryScore} {secondaryScore === 1 ? 'ponto' : 'pontos'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {secondary.description}
            </p>
            <div>
              <h4 className="font-semibold mb-2">Características Complementares</h4>
              <div className="grid gap-2">
                {secondary.characteristics.slice(0, 3).map((char, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Arquétipo Terciário */}
      {tertiary && tertiaryScore && (
        <Card>
          <CardHeader className="bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tertiary.emoji}</span>
                <div>
                  <CardTitle className="text-lg">{tertiary.name}</CardTitle>
                  <CardDescription>Arquétipo Terciário</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-sm px-2 py-1">
                {tertiaryScore} {tertiaryScore === 1 ? 'ponto' : 'pontos'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tertiary.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Leitura Interpretativa */}
      <Card className="bg-gradient-to-br from-accent/5 to-transparent border-accent/30">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Leitura Interpretativa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 text-accent">✨ Essência</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {primary.description}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🌑 Sombra</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quando esse arquétipo domina em excesso, pode levar a {primary.characteristics[0].toLowerCase()} sem limites. O equilíbrio vem ao integrar outros arquétipos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-accent">🎯 Propósito</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Você floresce quando vive como <strong>{primary.name}</strong> — guiado por propósito, beleza e fé. Sua missão é expressar essa energia com autenticidade.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
            ✨ "Você floresce quando vive como <strong>{primary.name}</strong> — guiado por propósito, beleza e fé."
          </p>
          <p className="text-sm text-muted-foreground/80">
            Seus arquétipos revelam sua essência única. Agora que você conhece sua identidade arquetípica,
            podemos criar uma sessão fotográfica que captura verdadeiramente quem você é.
          </p>
          {navigator.share && (
            <div className="pt-4">
              <Button onClick={handleShare} variant="outline" size="lg" className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar Resultado
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}