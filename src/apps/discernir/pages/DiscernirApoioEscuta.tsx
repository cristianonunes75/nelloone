import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { useIdentityEssencial } from '../hooks/useIdentityEssencial';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileHeart, 
  RefreshCw, 
  Loader2,
  Heart,
  MessageCircle,
  Compass,
  AlertCircle,
  Scale,
  ArrowRight,
  Info,
  Sparkles,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface ApoioEscuta {
  id: string;
  current_moment: any;
  responsibility_relation: any;
  fatigue_signals: any;
  family_situation: any;
  suggested_questions: any;
  care_pathways: any;
  generated_at: string;
  expires_at: string;
  is_valid: boolean;
}

interface RhythmSynthesis {
  rhythm_state: 'equilibrado' | 'exigente_sustentavel' | 'exigente_desgaste' | 'risco_sobrecarga';
  user_message: string;
  pastoral_questions: string[];
  generated_at: string;
  expires_at: string;
  is_valid: boolean;
}

const RHYTHM_STATE_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  equilibrado: { label: 'Ritmo Equilibrado', color: 'text-green-700', bgColor: 'bg-green-50' },
  exigente_sustentavel: { label: 'Ritmo Exigente (Sustentável)', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  exigente_desgaste: { label: 'Ritmo Exigente (Atenção)', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  risco_sobrecarga: { label: 'Risco de Sobrecarga', color: 'text-red-700', bgColor: 'bg-red-50' },
};

export function DiscernirApoioEscuta() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasIndividualConsent } = useDiscernirAuth();
  const { isJourneyComplete, status: essencialStatus } = useIdentityEssencial();
  
  const [apoioEscuta, setApoioEscuta] = useState<ApoioEscuta | null>(null);
  const [synthesis, setSynthesis] = useState<RhythmSynthesis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState(false);

  const fetchApoioEscuta = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('discernir_apoio_escuta')
        .select('*')
        .eq('user_id', user.id)
        .eq('artifact_type', 'individual')
        .eq('is_valid', true)
        .gte('expires_at', new Date().toISOString())
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setApoioEscuta(data);
    } catch (error: any) {
      console.error('Error fetching apoio escuta:', error);
    }
  };

  const fetchSynthesis = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('identity_essencial_synthesis')
        .select('rhythm_state, user_message, pastoral_questions, generated_at, expires_at, is_valid')
        .eq('user_id', user.id)
        .eq('is_valid', true)
        .gte('expires_at', new Date().toISOString())
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setSynthesis(data as RhythmSynthesis);
      }
    } catch (error) {
      console.error('Error fetching synthesis:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchApoioEscuta(), fetchSynthesis()]);
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  const generateSynthesis = async () => {
    if (!user) return;
    
    setIsGeneratingSynthesis(true);
    try {
      const { data, error } = await supabase.functions.invoke('identity-essencial-synthesis');
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Síntese de Ritmo gerada');
        await fetchSynthesis();
      } else {
        throw new Error(data?.error || 'Erro ao gerar síntese');
      }
    } catch (error: any) {
      console.error('Error generating synthesis:', error);
      toast.error('Erro ao gerar Síntese', { description: error.message });
    } finally {
      setIsGeneratingSynthesis(false);
    }
  };

  const generateApoioEscuta = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('discernir-generate-apoio', {
        body: { artifact_type: 'individual' }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Apoio de Escuta gerado', {
          description: 'O material foi gerado com base nos seus dados'
        });
        await fetchApoioEscuta();
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error('Error generating apoio escuta:', error);
      toast.error('Erro ao gerar Apoio de Escuta', { 
        description: error.message || 'Tente novamente mais tarde' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Consent required
  if (!hasIndividualConsent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/40">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="border-amber-300 bg-amber-50/80">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h2 className="font-serif text-lg font-semibold text-amber-900 mb-2">
                Consentimento necessário
              </h2>
              <p className="text-amber-800/70">
                Para acessar o Apoio de Escuta, é necessário dar o consentimento individual primeiro.
              </p>
              <Link to="/consentimento">
                <Button className="mt-4 bg-amber-700 hover:bg-amber-800">
                  Ir para Consentimento
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Identity Essencial not complete
  if (!isJourneyComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/40">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="border-amber-300 bg-amber-50/80">
            <CardContent className="pt-6 text-center">
              <Compass className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h2 className="font-serif text-lg font-semibold text-amber-900 mb-2">
                Complete a Experiência de Autoconhecimento
              </h2>
              <p className="text-amber-800/70 mb-4">
                Antes de gerar o Apoio de Escuta, é necessário concluir a experiência de autoconhecimento.
              </p>
              <Link to="/identity-essencial">
                <Button className="bg-amber-700 hover:bg-amber-800">
                  Ir para Experiência
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/40 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  // No data yet - show generation screen
  if (!apoioEscuta && !synthesis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/40">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-2xl font-semibold text-amber-900">
              Apoio de Escuta
            </h1>
            <p className="text-amber-700/70">
              Material para apoiar a conversa pastoral
            </p>
          </div>

          <Card className="border-amber-200/50 bg-white/80">
            <CardContent className="pt-6 text-center">
              <FileHeart className="h-14 w-14 text-amber-300 mx-auto mb-4" />
              <h2 className="font-serif text-lg font-semibold text-amber-900 mb-2">
                Pronto para gerar
              </h2>
              <p className="text-amber-800/70 mb-6 text-sm">
                O Apoio de Escuta será gerado com base na sua experiência de autoconhecimento.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={generateSynthesis}
                  disabled={isGeneratingSynthesis}
                  className="bg-amber-700 hover:bg-amber-800"
                >
                  {isGeneratingSynthesis && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Scale className="mr-2 h-4 w-4" />
                  Gerar Síntese de Ritmo
                </Button>
                <Button 
                  onClick={generateApoioEscuta}
                  disabled={isGenerating}
                  variant="outline"
                  className="border-amber-300 text-amber-700"
                >
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <FileHeart className="mr-2 h-4 w-4" />
                  Gerar Apoio de Escuta Completo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200/40 bg-amber-50/50">
            <CardContent className="py-5">
              <p className="text-center text-amber-800 italic text-sm font-serif">
                "A Síntese de Ritmo não mede a pessoa. Ela apenas ajuda a escutar o momento."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/40">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-amber-900">
              Apoio de Escuta
            </h1>
            {synthesis && (
              <p className="text-sm text-amber-700/70 mt-1">
                Gerado em {new Date(synthesis.generated_at).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateSynthesis}
            disabled={isGeneratingSynthesis}
            className="text-amber-700 border-amber-200 hover:bg-amber-50"
          >
            {isGeneratingSynthesis ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* 1. Pastoral Framing Block - "O que você está vendo aqui" */}
        <Card className="border-amber-200/40 bg-amber-100/40">
          <CardContent className="py-5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-serif text-sm font-medium text-amber-800">
                  O que você está vendo aqui
                </h3>
                <p className="text-sm text-amber-700/80 leading-relaxed">
                  Este apoio foi gerado a partir da sua experiência pessoal de autoconhecimento e serve apenas para ajudar a escutar o seu momento atual.
                </p>
                <p className="text-sm text-amber-700/80 leading-relaxed">
                  Ele não substitui a conversa pastoral, nem aponta decisões.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Rhythm Synthesis - Central Block with Visual Emphasis */}
        {synthesis && (
          <Card className={`border-2 border-amber-300/60 shadow-sm ${RHYTHM_STATE_LABELS[synthesis.rhythm_state]?.bgColor || 'bg-amber-50'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-lg flex items-center gap-2 text-amber-900">
                  <Scale className="h-5 w-5 text-amber-700" />
                  Síntese de Ritmo e Responsabilidade
                </CardTitle>
                <Badge className={`${RHYTHM_STATE_LABELS[synthesis.rhythm_state]?.bgColor} ${RHYTHM_STATE_LABELS[synthesis.rhythm_state]?.color} border-0 text-xs`}>
                  {RHYTHM_STATE_LABELS[synthesis.rhythm_state]?.label || synthesis.rhythm_state}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-amber-800 whitespace-pre-line leading-relaxed">
                {synthesis.user_message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 3. Aspects Considered Block - "Aspectos considerados nesta leitura" */}
        <Card className="border-amber-200/50 bg-white/70">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base text-amber-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Aspectos considerados nesta leitura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-sm text-amber-800/80 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Forma de agir e assumir responsabilidades</span>
              </li>
              <li className="text-sm text-amber-800/80 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Ritmo pessoal de energia e recuperação</span>
              </li>
              <li className="text-sm text-amber-800/80 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Forma de se vincular e receber cuidado</span>
              </li>
              <li className="text-sm text-amber-800/80 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Volume atual de compromissos assumidos</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 4. Pastoral Questions Block */}
        {synthesis?.pastoral_questions && synthesis.pastoral_questions.length > 0 && (
          <Card className="border-amber-200/50 bg-white/80">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base text-amber-900 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-amber-600" />
                Perguntas Pastorais
              </CardTitle>
              <CardDescription className="text-xs text-amber-700/60">
                Perguntas que podem ajudar na conversa de escuta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {synthesis.pastoral_questions.slice(0, 5).map((q: string, i: number) => (
                  <li key={i} className="text-sm text-amber-800/80 flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* 5. Next Step Block - "Próximo passo sugerido" */}
        <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base text-amber-900 flex items-center gap-2">
              <Heart className="h-4 w-4 text-amber-600" />
              Próximo passo sugerido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-amber-800/80 leading-relaxed">
              Este material ganha sentido quando levado à conversa pastoral.
            </p>
            <p className="text-sm text-amber-800/80 leading-relaxed">
              Se desejar, marque um encontro ou leve estas perguntas para um momento de escuta e oração.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 mt-2"
            >
              <Users className="mr-2 h-4 w-4" />
              Levar este apoio para a conversa pastoral
            </Button>
          </CardContent>
        </Card>

        {/* 6. Safety Disclaimers */}
        <Card className="border-amber-200/40 bg-amber-50/50">
          <CardContent className="py-5 space-y-3">
            <p className="text-center text-amber-800/70 text-sm leading-relaxed">
              Este material é válido apenas para apoiar a conversa pastoral. 
              O verdadeiro discernimento acontece no encontro pessoal, na oração e no acompanhamento.
            </p>
            <p className="text-center text-xs text-amber-700/50 italic">
              "Esta leitura refere-se ao momento atual e pode mudar com o tempo."
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
