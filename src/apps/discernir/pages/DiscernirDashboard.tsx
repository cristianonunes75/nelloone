import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  FileHeart, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export function DiscernirDashboard() {
  const { user } = useAuth();
  const { 
    couple, 
    hasIndividualConsent, 
    hasConjugalConsent, 
    hasPriestAccessConsent 
  } = useDiscernirAuth();

  const userName = user?.user_metadata?.full_name || 'Peregrino';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-semibold text-amber-900">
          Olá, {userName}
        </h1>
        <p className="text-amber-800/70">
          Seja bem vindo à experiência DISCERNIR
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Consent Status */}
        <Card className="border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-amber-700" />
              Consentimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {hasIndividualConsent ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span>Individual</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {hasPriestAccessConsent ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span>Acesso pastoral</span>
            </div>
            {!hasIndividualConsent && (
              <Link to="/consentimento">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Gerenciar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Apoio de Escuta */}
        <Card className="border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileHeart className="h-5 w-5 text-amber-700" />
              Apoio de Escuta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Material para apoiar a conversa pastoral sobre seu momento atual
            </CardDescription>
            <Link to="/apoio-escuta">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                disabled={!hasIndividualConsent}
              >
                Acessar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Couple Protection */}
        <Card className="border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-700" />
              Proteção do Casal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {couple ? (
              <>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Casal vinculado
                </Badge>
                <Link to="/cruzamento">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    disabled={!hasConjugalConsent}
                  >
                    Acessar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <CardDescription className="text-sm">
                Aguardando vínculo com seu cônjuge
              </CardDescription>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="border-amber-200/50 bg-amber-50/30">
        <CardContent className="pt-6">
          <p className="text-center text-amber-800 italic">
            "Este é um tempo que pede escuta, cuidado e discernimento, respeitando o ritmo da vida familiar."
          </p>
          <p className="text-center text-xs text-amber-700/60 mt-4">
            Baseado em Amoris Laetitia e Evangelii Gaudium
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
