import { useState } from 'react';
import { Target, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SEOHead } from '@/components/SEOHead';
import { FlowLayout } from '../components/FlowLayout';
import { useFlowData } from '../hooks/useFlowData';
import { toast } from 'sonner';

export default function FlowOffer() {
  const { offer, chosenIdea, saveOffer, loading } = useFlowData();
  
  const [audience, setAudience] = useState(offer?.audience || '');
  const [problem, setProblem] = useState(offer?.problem || '');
  const [promise, setPromise] = useState(offer?.promise || '');
  const [format, setFormat] = useState(offer?.format || '');
  const [price, setPrice] = useState(offer?.price_suggested?.toString() || '');
  const [status, setStatus] = useState(offer?.status || 'draft');
  const [isSaving, setIsSaving] = useState(false);

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

          {/* Connected Idea */}
          {chosenIdea && (
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <div className="text-xs text-violet-400 mb-1">Baseada na ideia:</div>
              <div className="text-white font-medium">{chosenIdea.title}</div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="space-y-2">
              <Label className="text-slate-300">Público-alvo</Label>
              <Textarea
                placeholder="Para quem é essa oferta? Descreva seu cliente ideal..."
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Problema que resolve</Label>
              <Textarea
                placeholder="Qual dor ou problema você resolve?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Promessa / Transformação</Label>
              <Textarea
                placeholder="O que a pessoa vai conseguir após comprar?"
                value={promise}
                onChange={(e) => setPromise(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Formato do produto/serviço</Label>
              <Input
                placeholder="Ex: Consultoria 1:1, Curso online, Mentoria em grupo..."
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Preço sugerido (R$)</Label>
              <Input
                type="number"
                placeholder="497"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
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
            </ul>
          </div>
        </div>
      </FlowLayout>
    </>
  );
}
