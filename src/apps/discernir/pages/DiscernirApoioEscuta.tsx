import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
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
  AlertCircle
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

export function DiscernirApoioEscuta() {
  const { user } = useAuth();
  const { hasIndividualConsent } = useDiscernirAuth();
  const [apoioEscuta, setApoioEscuta] = useState<ApoioEscuta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchApoioEscuta = async () => {
    if (!user) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApoioEscuta();
  }, [user]);

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
          description: 'O material foi gerado com base nos seus dados do Identity'
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

  if (!apoioEscuta) {
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
              Nenhum Apoio de Escuta gerado
            </h2>
            <p className="text-amber-800/70 mb-6">
              O Apoio de Escuta será gerado com base nos seus dados do Identity, sem duplicar informações.
            </p>
            <Button 
              onClick={generateApoioEscuta}
              disabled={isGenerating}
              className="bg-amber-700 hover:bg-amber-800"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gerar Apoio de Escuta
            </Button>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-amber-200/50 bg-amber-50/30">
          <CardContent className="pt-6">
            <p className="text-center text-amber-800 italic text-sm">
              "Este apoio não descreve a pessoa. Apenas ajuda a escutar melhor o momento."
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
      data: apoioEscuta.current_moment 
    },
    { 
      key: 'responsibility_relation', 
      title: 'Relação com Responsabilidade', 
      icon: Briefcase,
      data: apoioEscuta.responsibility_relation 
    },
    { 
      key: 'fatigue_signals', 
      title: 'Sinais de Cansaço ou Excesso', 
      icon: Battery,
      data: apoioEscuta.fatigue_signals 
    },
    { 
      key: 'family_situation', 
      title: 'Situação Familiar', 
      icon: Home,
      data: apoioEscuta.family_situation 
    },
    { 
      key: 'suggested_questions', 
      title: 'Perguntas Sugeridas', 
      icon: MessageCircle,
      data: apoioEscuta.suggested_questions 
    },
    { 
      key: 'care_pathways', 
      title: 'Caminhos de Cuidado', 
      icon: Compass,
      data: apoioEscuta.care_pathways 
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-amber-900">
            Apoio de Escuta
          </h1>
          <p className="text-amber-800/70 mt-1">
            Gerado em {new Date(apoioEscuta.generated_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
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

      {/* Disclaimer at top */}
      <Card className="border-amber-300 bg-amber-100/50">
        <CardContent className="py-4">
          <p className="text-center text-amber-800 font-medium">
            ⚠️ Este apoio não descreve a pessoa. Apenas ajuda a escutar melhor o momento.
          </p>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.key} className="border-amber-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <section.icon className="h-5 w-5 text-amber-700" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.data ? (
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
              ) : (
                <p className="text-amber-600/60 italic">
                  Informação não disponível neste momento
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Disclaimer */}
      <Card className="border-amber-200/50 bg-amber-50/30">
        <CardContent className="pt-6">
          <p className="text-center text-amber-800/70 text-sm">
            Este material é válido apenas para apoiar a conversa pastoral. 
            O verdadeiro discernimento acontece no encontro pessoal, na oração e no acompanhamento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
