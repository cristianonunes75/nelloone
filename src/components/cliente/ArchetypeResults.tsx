import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ARCHETYPES } from "@/lib/archetypes";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Palette, Camera } from "lucide-react";

interface ArchetypeResultsProps {
  primaryArchetype: string;
  secondaryArchetype?: string;
  primaryScore: number;
  secondaryScore?: number;
}

export default function ArchetypeResults({
  primaryArchetype,
  secondaryArchetype,
  primaryScore,
  secondaryScore,
}: ArchetypeResultsProps) {
  const primary = ARCHETYPES[primaryArchetype];
  const secondary = secondaryArchetype ? ARCHETYPES[secondaryArchetype] : null;

  if (!primary) return null;

  return (
    <div className="space-y-6">
      {/* Arquétipo Primário */}
      <Card className="border-2 border-primary">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{primary.emoji}</span>
              <div>
                <CardTitle className="text-2xl">{primary.name}</CardTitle>
                <CardDescription>Seu Arquétipo Dominante</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
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

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground leading-relaxed">
            Seus arquétipos revelam sua essência única. Agora que você conhece sua identidade arquetípica,
            podemos criar uma sessão fotográfica que captura verdadeiramente quem você é.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}