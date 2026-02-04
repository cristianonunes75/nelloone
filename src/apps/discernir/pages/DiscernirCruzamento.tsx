import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Loader2,
  Clock,
  Home,
  Handshake,
  AlertCircle,
  Heart,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface AxisData {
  observation?: string;
  attention_points?: string[];
  suggestion?: string;
  message?: string;
  reflection?: string;
}

interface CruzamentoData {
  id: string;
  rhythm_axis: AxisData | null;
  family_service_axis: AxisData | null;
  decision_axis: AxisData | null;
  current_moment: string | null;
  generated_at: string;
  expires_at: string;
}

export function DiscernirCruzamento() {
  const { user } = useAuth();
  const { couple, hasConjugalConsent } = useDiscernirAuth();
  const [cruzamento, setCruzamento] = useState<CruzamentoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchCruzamento = async () => {
    if (!user || !couple) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('discernir_apoio_escuta')
        .select('id, rhythm_axis, family_service_axis, decision_axis, current_moment, generated_at, expires_at')
        .eq('couple_id', couple.id)
        .eq('artifact_type', 'conjugal')
        .eq('is_valid', true)
        .gte('expires_at', new Date().toISOString())
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setCruzamento(data as CruzamentoData | null);
    } catch (error: any) {
      console.error('Error fetching cruzamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (couple) {
      fetchCruzamento();
    } else {
      setIsLoading(false);
    }
  }, [user, couple]);

  const generateCruzamento = async () => {
    if (!user || !couple) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('discernir-generate-cruzamento', {
        body: {}
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Cruzamento gerado', {
          description: 'O cruzamento de proteção foi gerado com sucesso'
        });
        await fetchCruzamento();
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error('Error generating cruzamento:', error);
      toast.error('Erro ao gerar Cruzamento', { 
        description: error.message || 'Tente novamente mais tarde' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!couple) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-amber-300 bg-amber-50/50">
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Casal não vinculado
            </h2>
            <p className="text-amber-800/70">
              O Cruzamento Essencial de Proteção requer que ambos os cônjuges estejam vinculados.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasConjugalConsent) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-amber-300 bg-amber-50/50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Consentimento conjugal necessário
            </h2>
            <p className="text-amber-800/70">
              Ambos os cônjuges precisam dar o consentimento conjugal para acessar o Cruzamento.
            </p>
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

  const axes = [
    {
      key: 'rhythm',
      title: 'Ritmo do Casal',
      icon: Clock,
      description: 'Tempo, energia, descanso e carga de atividades',
      data: cruzamento?.rhythm_axis,
      defaultMessage: 'Hoje vocês podem estar vivendo ritmos diferentes, o que pede conversa e cuidado.',
    },
    {
      key: 'family_service',
      title: 'Família x Serviço',
      icon: Home,
      description: 'Impacto do serviço no lar e proteção do tempo conjugal',
      data: cruzamento?.family_service_axis,
      defaultMessage: 'Talvez este seja um tempo de proteger mais o casal antes de assumir novas demandas.',
    },
    {
      key: 'decision',
      title: 'Forma de Decidir Juntos',
      icon: Handshake,
      description: 'Diálogo, escuta mútua e tomada de decisão compartilhada',
      data: cruzamento?.decision_axis,
      defaultMessage: 'Esse ponto pode ser conversado juntos, com calma, na presença de Deus.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Heart className="h-6 w-6 text-amber-700" />
          <h1 className="font-serif text-3xl font-semibold text-amber-900">
            Cruzamento Essencial de Proteção
          </h1>
        </div>
        <p className="text-amber-800/70">
          {couple.couple_name || 'Seu casal'}
        </p>
      </div>

      {/* Important Notice */}
      <Card className="border-amber-300 bg-amber-100/50">
        <CardContent className="py-4">
          <p className="text-center text-amber-800 font-medium text-sm">
            ⚠️ Este cruzamento existe apenas para proteção, nunca para avaliação.
            <br />
            Não mede compatibilidade nem analisa personalidade.
          </p>
        </CardContent>
      </Card>

      {!cruzamento ? (
        <Card className="border-amber-200/50">
          <CardContent className="pt-6 text-center">
            <Users className="h-16 w-16 text-amber-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Nenhum Cruzamento gerado
            </h2>
            <p className="text-amber-800/70 mb-6">
              O Cruzamento será gerado com base nos dados do Identity de ambos os cônjuges.
            </p>
            <Button 
              onClick={generateCruzamento}
              disabled={isGenerating}
              className="bg-amber-700 hover:bg-amber-800"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gerar Cruzamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateCruzamento}
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

          {/* Three Axes */}
          <div className="space-y-6">
            {axes.map((axis) => (
              <Card key={axis.key} className="border-amber-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-100/50 to-transparent px-6 py-4 border-b border-amber-200/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-700/10 rounded-lg">
                      <axis.icon className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900">{axis.title}</h3>
                      <p className="text-sm text-amber-700/70">{axis.description}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200/30">
                    <p className="text-amber-800 italic">
                      "{axis.data?.message || axis.defaultMessage}"
                    </p>
                  </div>
                  {axis.data?.reflection && (
                    <div className="mt-4 text-sm text-amber-700/80">
                      <p className="font-medium mb-1">Ponto para reflexão:</p>
                      <p>{axis.data.reflection}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Biblical Foundation */}
      <Card className="border-amber-200/50 bg-amber-50/30">
        <CardContent className="pt-6 text-center space-y-3">
          <p className="text-amber-800 italic font-serif">
            "Onde dois ou três estiverem reunidos em meu nome, eu estou no meio deles."
          </p>
          <p className="text-xs text-amber-700/60">Mateus 18,20</p>
          <p className="text-sm text-amber-800/70 pt-4">
            O discernimento do casal acontece no encontro, na oração e na conversa. 
            Este cruzamento é apenas um ponto de partida.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
