import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileHeart, 
  Compass, 
  Heart, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FunctionalCardsProps {
  // Apoio de Escuta
  hasIndividualConsent: boolean;
  isJourneyComplete: boolean;
  
  // Experiência de Autoconhecimento
  essencialLoading: boolean;
  essencialProgress: number;
  essencialCompletionSource?: string | null;
  
  // Consentimentos
  hasConjugalConsent: boolean;
  hasPriestAccessConsent: boolean;
}

export function FunctionalCards({
  hasIndividualConsent,
  isJourneyComplete,
  essencialLoading,
  essencialProgress,
  essencialCompletionSource,
  hasConjugalConsent,
  hasPriestAccessConsent
}: FunctionalCardsProps) {
  return (
    <div className="grid gap-5">
      {/* Experiência de Autoconhecimento */}
      <Card className="border-amber-200/50 bg-white/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 font-serif text-amber-900">
            <Compass className="h-5 w-5 text-amber-600" />
            Experiência de Autoconhecimento
          </CardTitle>
          <CardDescription className="text-sm text-amber-700/70">
            Base humana para a escuta pastoral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {essencialLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
            </div>
          ) : isJourneyComplete ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium text-sm">Jornada concluída</span>
              {essencialCompletionSource === 'reused' && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                  Dados reaproveitados
                </Badge>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-amber-700">
                  <span>Progresso</span>
                  <span>{Math.round(essencialProgress)}%</span>
                </div>
                <Progress value={essencialProgress} className="h-2" />
              </div>
              <Link to="/identity-essencial">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm">
                  {essencialProgress > 0 ? 'Continuar Jornada' : 'Iniciar Jornada'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>

      {/* Apoio de Escuta */}
      <Card className="border-amber-200/50 bg-white/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 font-serif text-amber-900">
            <FileHeart className="h-5 w-5 text-amber-600" />
            Apoio de Escuta
          </CardTitle>
          <CardDescription className="text-sm text-amber-700/70">
            Material para apoiar a conversa pastoral sobre seu momento atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/apoio-escuta">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 text-sm"
              disabled={!hasIndividualConsent || !isJourneyComplete}
            >
              Acessar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {!isJourneyComplete && hasIndividualConsent && (
            <p className="text-xs text-amber-600 mt-2">
              Complete a Experiência de Autoconhecimento primeiro
            </p>
          )}
          {!hasIndividualConsent && (
            <p className="text-xs text-amber-600 mt-2">
              Necessário consentimento individual
            </p>
          )}
        </CardContent>
      </Card>

      {/* Consentimentos */}
      <Card className="border-amber-200/50 bg-white/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 font-serif text-amber-900">
            <Heart className="h-5 w-5 text-amber-600" />
            Consentimentos
          </CardTitle>
          <CardDescription className="text-sm text-amber-700/70">
            Gerencie suas permissões para a escuta pastoral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {hasIndividualConsent ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-amber-800">Consentimento individual</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {hasPriestAccessConsent ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-amber-800">Acesso pastoral</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {hasConjugalConsent ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-amber-800">Consentimento conjugal</span>
            </div>
          </div>
          
          <Link to="/consentimento">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 border-amber-200 text-amber-700 hover:bg-amber-50 text-sm"
            >
              Gerenciar consentimentos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
