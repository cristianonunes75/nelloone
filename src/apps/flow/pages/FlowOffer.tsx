import { useState } from 'react';
import { Target, Save, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SEOHead } from '@/components/SEOHead';
import { FlowLayout } from '../components/FlowLayout';
import { useFlowData } from '../hooks/useFlowData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type FieldType = 'audience' | 'problem' | 'promise' | 'format' | 'price';

const FIELD_PROMPTS: Record<FieldType, { label: string; prompt: string }> = {
  audience: {
    label: 'Público-alvo',
    prompt: 'Me ajude a definir meu público-alvo. Quero uma descrição clara e específica de quem é meu cliente ideal para a minha oferta.',
  },
  problem: {
    label: 'Problema',
    prompt: 'Me ajude a articular o problema que minha oferta resolve. Qual a dor principal do meu cliente ideal?',
  },
  promise: {
    label: 'Promessa',
    prompt: 'Me ajude a criar uma promessa de transformação clara. O que meu cliente vai conseguir após comprar minha oferta?',
  },
  format: {
    label: 'Formato',
    prompt: 'Me ajude a escolher o formato ideal para minha oferta (consultoria, curso, mentoria, etc). Qual formato combina mais comigo e com minha proposta?',
  },
  price: {
    label: 'Preço',
    prompt: 'Me ajude a definir um preço justo e estratégico para minha oferta. Considere o valor entregue e o mercado.',
  },
};

const AUTO_GENERATE_PROMPT = `Com base na ideia abaixo, me ajude a estruturar uma oferta completa. Responda em formato JSON com os campos:
- audience: descrição do público-alvo (2-3 frases)
- problem: o problema que resolve (2-3 frases)
- promise: a promessa/transformação (2-3 frases)
- format: formato sugerido (ex: "Mentoria em grupo de 8 semanas")
- price: preço sugerido em reais (apenas número, ex: 497)

Seja específico e prático. Responda APENAS o JSON, sem explicações adicionais.`;

export default function FlowOffer() {
  const { offer, chosenIdea, saveOffer, loading } = useFlowData();
  const { user } = useAuth();
  
  const [audience, setAudience] = useState(offer?.audience || '');
  const [problem, setProblem] = useState(offer?.problem || '');
  const [promise, setPromise] = useState(offer?.promise || '');
  const [format, setFormat] = useState(offer?.format || '');
  const [price, setPrice] = useState(offer?.price_suggested?.toString() || '');
  const [status, setStatus] = useState(offer?.status || 'draft');
  const [isSaving, setIsSaving] = useState(false);
  
  // AI assistance state
  const [aiLoading, setAiLoading] = useState<FieldType | 'auto' | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ field: FieldType; content: string } | null>(null);
  const [autoGeneratePreview, setAutoGeneratePreview] = useState<{
    audience: string;
    problem: string;
    promise: string;
    format: string;
    price: string;
  } | null>(null);

  const handleSave = async (newStatus?: 'draft' | 'active') => {
    setIsSaving(true);
    try {
      await saveOffer({
        idea_id: chosenIdea?.id || null,
        audience,
        problem,
        promise,
        format,
        price_suggested: price ? parseFloat(price) : null,
        status: newStatus || status,
      });
      if (newStatus) setStatus(newStatus);
      toast.success(newStatus === 'active' ? 'Oferta ativada!' : 'Oferta salva!');
    } catch (error) {
      toast.error('Erro ao salvar oferta');
    } finally {
      setIsSaving(false);
    }
  };

  const requestAIHelp = async (field: FieldType) => {
    if (!user?.id) {
      toast.error('Faça login para usar o Mentor IA');
      return;
    }

    setAiLoading(field);
    setAiSuggestion(null);

    try {
      // Build context from current offer data
      const context = [
        chosenIdea?.title ? `Minha ideia: ${chosenIdea.title}` : '',
        chosenIdea?.description ? `Descrição: ${chosenIdea.description}` : '',
        audience ? `Público-alvo atual: ${audience}` : '',
        problem ? `Problema que resolvo: ${problem}` : '',
        promise ? `Promessa: ${promise}` : '',
        format ? `Formato: ${format}` : '',
        price ? `Preço sugerido: R$ ${price}` : '',
      ].filter(Boolean).join('\n');

      const fullPrompt = `${FIELD_PROMPTS[field].prompt}\n\nContexto da minha oferta:\n${context || 'Ainda estou começando a estruturar.'}\n\nMe dê uma sugestão direta e prática que eu possa usar.`;

      const { data, error } = await supabase.functions.invoke('flow-mentor', {
        body: {
          message: fullPrompt,
          userId: user.id,
        },
      });

      if (error) throw error;

      if (data?.response) {
        setAiSuggestion({ field, content: data.response });
      }
    } catch (error) {
      console.error('Error getting AI help:', error);
      toast.error('Erro ao obter ajuda do Mentor IA');
    } finally {
      setAiLoading(null);
    }
  };

  const applySuggestion = (field: FieldType, suggestion: string) => {
    // Extract just the core suggestion (remove explanatory text)
    const cleanSuggestion = suggestion.trim();
    
    switch (field) {
      case 'audience':
        setAudience(cleanSuggestion);
        break;
      case 'problem':
        setProblem(cleanSuggestion);
        break;
      case 'promise':
        setPromise(cleanSuggestion);
        break;
      case 'format':
        setFormat(cleanSuggestion);
        break;
      case 'price':
        // Try to extract a number from the suggestion
        const priceMatch = cleanSuggestion.match(/R?\$?\s*(\d+[.,]?\d*)/);
        if (priceMatch) {
          setPrice(priceMatch[1].replace(',', '.'));
        }
        break;
    }
    setAiSuggestion(null);
    toast.success('Sugestão aplicada!');
  };

  // Auto-generate all fields with AI
  const handleAutoGenerate = async () => {
    if (!user?.id) {
      toast.error('Faça login para usar o Mentor IA');
      return;
    }

    if (!chosenIdea) {
      toast.error('Defina uma ideia como foco primeiro');
      return;
    }

    setAiLoading('auto');
    setAutoGeneratePreview(null);

    try {
      const ideaContext = `Título: ${chosenIdea.title}${chosenIdea.description ? `\nDescrição: ${chosenIdea.description}` : ''}`;
      
      const fullPrompt = `${AUTO_GENERATE_PROMPT}\n\nMinha ideia:\n${ideaContext}`;

      const { data, error } = await supabase.functions.invoke('flow-mentor', {
        body: {
          message: fullPrompt,
          userId: user.id,
        },
      });

      if (error) throw error;

      if (data?.response) {
        // Try to parse JSON from response
        try {
          // Clean the response - remove markdown code blocks if present
          let jsonStr = data.response.trim();
          if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
          } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```\n?/, '').replace(/\n?```$/, '');
          }
          
          const parsed = JSON.parse(jsonStr);
          setAutoGeneratePreview({
            audience: parsed.audience || '',
            problem: parsed.problem || '',
            promise: parsed.promise || '',
            format: parsed.format || '',
            price: String(parsed.price || ''),
          });
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          toast.error('A IA não retornou um formato válido. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Error auto-generating offer:', error);
      toast.error('Erro ao gerar oferta automaticamente');
    } finally {
      setAiLoading(null);
    }
  };

  const applyAutoGenerated = () => {
    if (!autoGeneratePreview) return;
    
    setAudience(autoGeneratePreview.audience);
    setProblem(autoGeneratePreview.problem);
    setPromise(autoGeneratePreview.promise);
    setFormat(autoGeneratePreview.format);
    setPrice(autoGeneratePreview.price);
    setAutoGeneratePreview(null);
    toast.success('Oferta preenchida! Revise e ajuste conforme necessário.');
  };

  const AIHelpButton = ({ field }: { field: FieldType }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => requestAIHelp(field)}
      disabled={aiLoading !== null}
      className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 gap-1.5 h-7 px-2"
    >
      {aiLoading === field ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      <span className="text-xs">Pedir ajuda à IA</span>
    </Button>
  );

  const AISuggestionBox = ({ field }: { field: FieldType }) => {
    if (!aiSuggestion || aiSuggestion.field !== field) return null;

    return (
      <div className="mt-2 p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 space-y-3">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-300 whitespace-pre-wrap">
            {aiSuggestion.content}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => applySuggestion(field, aiSuggestion.content)}
            className="bg-violet-500 hover:bg-violet-600 text-white h-8"
          >
            Usar esta sugestão
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAiSuggestion(null)}
            className="text-slate-400 hover:text-slate-300 h-8"
          >
            Ignorar
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <FlowLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </FlowLayout>
    );
  }

  return (
    <>
      <SEOHead title="Minha Oferta | Nello Flow" description="Estruture sua oferta no Nello Flow" />
      
      <FlowLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Target className="w-7 h-7 text-amber-400" />
              Minha Oferta
            </h1>
            <p className="text-slate-400 mt-1">
              Estruture sua oferta de forma clara e objetiva
            </p>
          </div>

          {/* Status Badge */}
          {status && (
            <div className={`inline-flex px-3 py-1 rounded-full text-sm ${
              status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {status === 'active' ? '✓ Oferta Ativa' : '⏳ Rascunho'}
            </div>
          )}

          {/* Connected Idea + Auto Generate */}
          {chosenIdea && (
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-violet-400 mb-1">Baseada na ideia:</div>
                  <div className="text-white font-medium">{chosenIdea.title}</div>
                </div>
                <Button
                  onClick={handleAutoGenerate}
                  disabled={aiLoading !== null}
                  variant="outline"
                  size="sm"
                  className="border-violet-500/50 text-violet-400 hover:bg-violet-500/20 gap-1.5 shrink-0"
                >
                  {aiLoading === 'auto' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  Gerar tudo com IA
                </Button>
              </div>
            </div>
          )}

          {/* Auto-generate Preview */}
          {autoGeneratePreview && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/40 space-y-4">
              <div className="flex items-center gap-2 text-violet-400 font-medium">
                <Wand2 className="w-5 h-5" />
                Oferta gerada pela IA
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-400 text-xs mb-1">Público-alvo</div>
                  <div className="text-white">{autoGeneratePreview.audience}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Problema que resolve</div>
                  <div className="text-white">{autoGeneratePreview.problem}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Promessa / Transformação</div>
                  <div className="text-white">{autoGeneratePreview.promise}</div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Formato</div>
                    <div className="text-white">{autoGeneratePreview.format}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Preço sugerido</div>
                    <div className="text-white">R$ {autoGeneratePreview.price}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={applyAutoGenerated}
                  className="bg-violet-500 hover:bg-violet-600"
                >
                  Usar esta oferta
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setAutoGeneratePreview(null)}
                  className="text-slate-400 hover:text-slate-300"
                >
                  Cancelar
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleAutoGenerate}
                  disabled={aiLoading !== null}
                  className="text-violet-400 hover:text-violet-300 ml-auto"
                >
                  {aiLoading === 'auto' ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Gerar outra
                </Button>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Público-alvo</Label>
                <AIHelpButton field="audience" />
              </div>
              <Textarea
                placeholder="Para quem é essa oferta? Descreva seu cliente ideal..."
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              />
              <AISuggestionBox field="audience" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Problema que resolve</Label>
                <AIHelpButton field="problem" />
              </div>
              <Textarea
                placeholder="Qual dor ou problema você resolve?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              />
              <AISuggestionBox field="problem" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Promessa / Transformação</Label>
                <AIHelpButton field="promise" />
              </div>
              <Textarea
                placeholder="O que a pessoa vai conseguir após comprar?"
                value={promise}
                onChange={(e) => setPromise(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              />
              <AISuggestionBox field="promise" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Formato do produto/serviço</Label>
                <AIHelpButton field="format" />
              </div>
              <Input
                placeholder="Ex: Consultoria 1:1, Curso online, Mentoria em grupo..."
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
              <AISuggestionBox field="format" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Preço sugerido (R$)</Label>
                <AIHelpButton field="price" />
              </div>
              <Input
                type="number"
                placeholder="497"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
              <AISuggestionBox field="price" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleSave()}
                disabled={isSaving}
                variant="outline"
                className="border-slate-700 text-slate-300"
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Salvar Rascunho
              </Button>
              
              <Button
                onClick={() => handleSave('active')}
                disabled={isSaving || !audience || !problem || !format}
                className="bg-violet-500 hover:bg-violet-600"
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Ativar Oferta
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <h3 className="text-sm font-medium text-white mb-2">💡 Dicas do Mentor</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Seja específico sobre quem você quer ajudar</li>
              <li>• Foque em um problema concreto e urgente</li>
              <li>• Sua promessa deve ser alcançável e mensurável</li>
              <li>• Comece com um formato simples que você domina</li>
              <li>• Use o botão <Sparkles className="w-3 h-3 inline text-violet-400" /> para pedir ajuda da IA em cada campo</li>
            </ul>
          </div>
        </div>
      </FlowLayout>
    </>
  );
}