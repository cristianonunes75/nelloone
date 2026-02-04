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
  Briefcase,
  Battery,
  Home,
  MessageCircle,
  Compass,
  AlertCircle,
  Scale,
  ArrowRight
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
      <div className="max-w-2xl mx-auto">
        <Card className="border-amber-300 bg-amber-50/50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
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
    );
  }

  // Identity Essencial not complete
  if (!isJourneyComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-amber-300 bg-amber-50/50">
          <CardContent className="pt-6 text-center">
            <Compass className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Complete o Identity Essencial
            </h2>
            <p className="text-amber-800/70 mb-4">
              Antes de gerar o Apoio de Escuta, é necessário concluir a jornada Identity Essencial.
            </p>
            <Link to="/identity-essencial">
              <Button className="bg-amber-700 hover:bg-amber-800">
                Ir para Identity Essencial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  // No data yet - show generation screen
  if (!apoioEscuta && !synthesis) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-semibold text-amber-900">
            Apoio de Escuta
          </h1>
          <p className="text-amber-800/70">
            Material para apoiar a conversa pastoral
          </p>
        </div>

        <Card className="border-amber-200/50">
          <CardContent className="pt-6 text-center">
            <FileHeart className="h-16 w-16 text-amber-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Pronto para gerar
            </h2>
            <p className="text-amber-800/70 mb-6">
              O Apoio de Escuta será gerado com base nos seus dados do Identity Essencial.
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
                className="border-amber-300"
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <FileHeart className="mr-2 h-4 w-4" />
                Gerar Apoio de Escuta Completo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200/50 bg-amber-50/30">
          <CardContent className="pt-6">
            <p className="text-center text-amber-800 italic text-sm">
              "A Síntese de Ritmo não mede a pessoa. Ela apenas ajuda a escutar o momento."
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = [
    { 
      key: 'current_moment', 
      title: 'Momento Atual', 
      icon: Heart,
      data: apoioEscuta?.current_moment 
    },
    { 
      key: 'responsibility_relation', 
      title: 'Relação com Responsabilidade', 
      icon: Briefcase,
      data: apoioEscuta?.responsibility_relation 
    },
    { 
      key: 'fatigue_signals', 
      title: 'Sinais de Cansaço ou Excesso', 
      icon: Battery,
      data: apoioEscuta?.fatigue_signals 
    },
    { 
      key: 'family_situation', 
      title: 'Situação Familiar', 
      icon: Home,
      data: apoioEscuta?.family_situation 
    },
    { 
      key: 'suggested_questions', 
      title: 'Perguntas Sugeridas', 
      icon: MessageCircle,
      data: apoioEscuta?.suggested_questions 
    },
    { 
      key: 'care_pathways', 
      title: 'Caminhos de Cuidado', 
      icon: Compass,
      data: apoioEscuta?.care_pathways 
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-amber-900">
            Apoio de Escuta
          </h1>
          {apoioEscuta && (
            <p className="text-amber-800/70 mt-1">
              Gerado em {new Date(apoioEscuta.generated_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateSynthesis}
            disabled={isGeneratingSynthesis}
            className="text-amber-700 border-amber-200"
          >
            {isGeneratingSynthesis ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Scale className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateApoioEscuta}
            disabled={isGenerating}
            className="text-amber-700 border-amber-200"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {/* Disclaimer at top */}
      <Card className="border-amber-300 bg-amber-100/50">
        <CardContent className="py-4">
          <p className="text-center text-amber-800 font-medium">
            ⚠️ Este apoio não descreve a pessoa. Apenas ajuda a escutar melhor o momento.
          </p>
        </CardContent>
      </Card>

      {/* Rhythm Synthesis - NEW SECTION */}
      {synthesis && (
        <Card className={`border-amber-200/50 ${RHYTHM_STATE_LABELS[synthesis.rhythm_state]?.bgColor || 'bg-amber-50'}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-amber-700" />
                Síntese de Ritmo e Responsabilidade
              </CardTitle>
              <Badge className={`${RHYTHM_STATE_LABELS[synthesis.rhythm_state]?.bgColor} ${RHYTHM_STATE_LABELS[synthesis.rhythm_state]?.color} border-0`}>
                {RHYTHM_STATE_LABELS[synthesis.rhythm_state]?.label || synthesis.rhythm_state}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Gerado em {new Date(synthesis.generated_at).toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-amber-800 whitespace-pre-line">
              {synthesis.user_message}
            </p>
            
            {synthesis.pastoral_questions && synthesis.pastoral_questions.length > 0 && (
              <div className="pt-2 border-t border-amber-200/50">
                <h4 className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Perguntas Pastorais
                </h4>
                <ul className="space-y-1">
                  {synthesis.pastoral_questions.slice(0, 5).map((q: string, i: number) => (
                    <li key={i} className="text-sm text-amber-800/80 flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Sections */}
      {apoioEscuta && (
        <div className="space-y-4">
          {sections.map((section) => (
            section.data && (
              <Card key={section.key} className="border-amber-200/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <section.icon className="h-5 w-5 text-amber-700" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-amber-800/80">
                    {typeof section.data === 'string' ? (
                      <p>{section.data}</p>
                    ) : Array.isArray(section.data) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {section.data.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{JSON.stringify(section.data)}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}

      {/* Bottom Disclaimer */}
      <Card className="border-amber-200/50 bg-amber-50/30">
        <CardContent className="pt-6">
          <p className="text-center text-amber-800/70 text-sm">
            Este material é válido apenas para apoiar a conversa pastoral. 
            O verdadeiro discernimento acontece no encontro pessoal, na oração e no acompanhamento.
          </p>
          <p className="text-center text-xs text-amber-700/50 mt-2">
            "Esta leitura refere-se ao momento atual e pode mudar com o tempo."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
