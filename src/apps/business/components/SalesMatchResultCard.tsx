import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Users,
  Heart,
  Zap,
  Building2
} from "lucide-react";
import { 
  MatchResult, 
  getMatchLevelConfig, 
  getRecommendationConfig 
} from "../lib/salesMatchEngine";

interface SalesMatchResultCardProps {
  result: MatchResult;
  candidateName: string;
}

export function SalesMatchResultCard({ result, candidateName }: SalesMatchResultCardProps) {
  const levelConfig = getMatchLevelConfig(result.level);
  const recConfig = getRecommendationConfig(result.recommendation);

  const DetailBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Target }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );

  return (
    <Card className={`border-2 ${
      result.level === 'ideal' ? 'border-green-200 bg-green-50/30' :
      result.level === 'parcial' ? 'border-yellow-200 bg-yellow-50/30' :
      'border-red-200 bg-red-50/30'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Match de Compatibilidade
          </CardTitle>
          <Badge className={`${levelConfig.bgColor} ${levelConfig.color} text-sm px-3 py-1`}>
            {levelConfig.icon} {levelConfig.label}
          </Badge>
        </div>
        <CardDescription>
          Análise de compatibilidade funcional para {candidateName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Principal */}
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-primary mb-1">
            {result.percentage}%
          </div>
          <p className="text-sm text-muted-foreground">Compatibilidade Geral</p>
        </div>

        {/* Tipo de Vendedor */}
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Tipo de Vendedor Identificado
          </p>
          <p className="text-lg font-semibold">{result.sellerType}</p>
        </div>

        <Separator />

        {/* Detalhes por Dimensão */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Compatibilidade por Dimensão</h4>
          <DetailBar label="Segmento" value={result.details.segmentFit} icon={Building2} />
          <DetailBar label="Perfil do Cliente" value={result.details.customerFit} icon={Users} />
          <DetailBar label="Ritmo e Pressão" value={result.details.rhythmFit} icon={Zap} />
          <DetailBar label="Cultura" value={result.details.cultureFit} icon={Heart} />
        </div>

        <Separator />

        {/* Pontos Fortes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Pontos Fortes no Contexto
          </h4>
          <ul className="space-y-1">
            {result.strengths.map((strength, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Riscos */}
        {result.risks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Riscos de Desgaste
            </h4>
            <ul className="space-y-1">
              {result.risks.map((risk, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Recomendação Final */}
        <div className={`rounded-lg p-4 ${
          result.recommendation === 'contratar' ? 'bg-green-100' :
          result.recommendation === 'entrevistar_atencao' ? 'bg-yellow-100' :
          'bg-red-100'
        }`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Recomendação Final
          </p>
          <p className={`text-lg font-semibold ${
            result.recommendation === 'contratar' ? 'text-green-700' :
            result.recommendation === 'entrevistar_atencao' ? 'text-yellow-700' :
            'text-red-700'
          }`}>
            {recConfig.label}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {recConfig.description}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center italic">
          Este sistema não define quem a pessoa é, apenas onde ela tende a funcionar melhor.
        </p>
      </CardContent>
    </Card>
  );
}
