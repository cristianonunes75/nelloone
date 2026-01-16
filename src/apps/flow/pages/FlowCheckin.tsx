import { useState } from 'react';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SEOHead } from '@/components/SEOHead';
import { FlowLayout } from '../components/FlowLayout';
import { useFlowData } from '../hooks/useFlowData';
import { toast } from 'sonner';

export default function FlowCheckin() {
  const { checkins, getCurrentWeek, saveCheckin, loading } = useFlowData();
  
  const [whatWorked, setWhatWorked] = useState('');
  const [whatNot, setWhatNot] = useState('');
  const [adjustments, setAdjustments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentWeek = getCurrentWeek();
  const hasCheckinThisWeek = checkins.some(c => c.week_ref === currentWeek);

  const handleSubmit = async () => {
    if (!whatWorked.trim() || !whatNot.trim() || !adjustments.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveCheckin({
        what_worked: whatWorked,
        what_not: whatNot,
        adjustments,
      });
      setWhatWorked('');
      setWhatNot('');
      setAdjustments('');
      toast.success('Excelente! Um passo de cada vez é o que constrói o caminho. — Nello', {
        duration: 5000,
      });
    } catch (error) {
      toast.error('Erro ao salvar check-in');
    } finally {
      setIsSubmitting(false);
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
      <SEOHead title="Check-in Semanal | Nello Flow" description="Revise sua semana no Nello Flow" />
      
      <FlowLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-violet-400" />
              Check-in Semanal
            </h1>
            <p className="text-slate-400 mt-1">
              Semana: {currentWeek}
            </p>
          </div>

          {/* Already done message */}
          {hasCheckinThisWeek && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <p className="text-green-400">
                ✓ Você já fez o check-in desta semana! Pode fazer outro se quiser atualizar.
              </p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="space-y-2">
              <Label className="text-slate-300">O que funcionou essa semana?</Label>
              <Textarea
                placeholder="Descreva o que deu certo, pequenas vitórias, aprendizados positivos..."
                value={whatWorked}
                onChange={(e) => setWhatWorked(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">O que não funcionou?</Label>
              <Textarea
                placeholder="O que te travou? Distrações? Falta de tempo? Procrastinação?"
                value={whatNot}
                onChange={(e) => setWhatNot(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">O que vamos ajustar para a próxima semana?</Label>
              <Textarea
                placeholder="Que mudanças você vai fazer? Novos hábitos? Eliminar algo?"
                value={adjustments}
                onChange={(e) => setAdjustments(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !whatWorked.trim() || !whatNot.trim() || !adjustments.trim()}
              className="w-full bg-violet-500 hover:bg-violet-600"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Send className="w-4 h-4 mr-2" />
              Enviar Check-in
            </Button>
          </div>

          {/* Previous Check-ins */}
          {checkins.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Check-ins Anteriores</h2>
              {checkins.slice(0, 3).map(checkin => (
                <div 
                  key={checkin.id}
                  className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30"
                >
                  <div className="text-sm text-slate-500 mb-3">Semana: {checkin.week_ref}</div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-green-400">✓ Funcionou:</span>
                      <p className="text-slate-300 mt-1">{checkin.what_worked}</p>
                    </div>
                    <div>
                      <span className="text-red-400">✗ Não funcionou:</span>
                      <p className="text-slate-300 mt-1">{checkin.what_not}</p>
                    </div>
                    <div>
                      <span className="text-violet-400">→ Ajustes:</span>
                      <p className="text-slate-300 mt-1">{checkin.adjustments}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FlowLayout>
    </>
  );
}
