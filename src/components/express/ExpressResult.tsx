import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Brain, Heart, Shield, Compass, Flame, Star } from "lucide-react";
import type { ExpressPrediction, ExpressDimension } from "@/lib/codigoExpress";
import LeadCaptureGate from "./LeadCaptureGate";
import EssenceUpsell from "./EssenceUpsell";

interface Props {
  prediction: ExpressPrediction;
  answers: Record<string, number>;
  onDeepen: () => void;
  refCode?: string | null;
}

const DIMENSION_META: Record<ExpressDimension, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  decision_mode: { label: 'Estilo de Decisão', description: 'Como você escolhe e age', icon: <Brain className="h-4 w-4" />, color: 'text-blue-500' },
  social_reaction: { label: 'Forma de Conectar', description: 'Como você se relaciona', icon: <Heart className="h-4 w-4" />, color: 'text-rose-500' },
  pressure_response: { label: 'Modo de Ação', description: 'Como você reage sob pressão', icon: <Shield className="h-4 w-4" />, color: 'text-amber-500' },
  mental_processing: { label: 'Energia Base', description: 'Como sua mente processa', icon: <Compass className="h-4 w-4" />, color: 'text-emerald-500' },
  inner_tension: { label: 'Força Interior', description: 'O que move você por dentro', icon: <Flame className="h-4 w-4" />, color: 'text-purple-500' },
};

const ACTION_MODE_LABELS: Record<string, string> = { D: 'Ação Direta', I: 'Conexão Ativa', S: 'Presença Constante', C: 'Precisão Estratégica' };
const ENERGY_LABELS: Record<string, string> = { sanguineo: 'Energia Expansiva', colerico: 'Energia Propulsora', melancolico: 'Energia Profunda', fleumatico: 'Energia Sustentada' };
const DRIVE_LABELS: Record<string, string> = {
  '1': 'Busca pela Excelência', '2': 'Cuidado Essencial', '3': 'Realização e Impacto',
  '4': 'Autenticidade Profunda', '5': 'Compreensão do Mundo', '6': 'Segurança e Lealdade',
  '7': 'Liberdade e Possibilidades', '8': 'Força e Autonomia', '9': 'Paz e Harmonia',
};

const RESULT_TESTIMONIALS = [
  "Quando vi meu resultado inicial percebi que existia algo muito maior por trás.",
  "A leitura foi certeira. O Código completo explicou o resto.",
  "Foi aqui que entendi que precisava ir mais fundo.",
];

type FlowStep = 'result' | 'lead_capture' | 'upsell';

export default function ExpressResult({ prediction, answers, onDeepen, refCode }: Props) {
  const [step, setStep] = useState<FlowStep>('result');
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string>('');
  const [savedEmail, setSavedEmail] = useState<string>('');

  if (step === 'lead_capture') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <LeadCaptureGate
          prediction={prediction}
          answers={answers}
          refCode={refCode}
          onSaved={(leadId, name, email) => {
            setSavedLeadId(leadId);
            setSavedName(name);
            setSavedEmail(email || '');
            setStep('upsell');
          }}
        />
      </div>
    );
  }

  if (step === 'upsell') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <EssenceUpsell
          onDeepen={onDeepen}
          inviterName={savedName}
          inviterLeadId={savedLeadId || undefined}
          leadEmail={savedEmail}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-lg mx-auto space-y-8">
        
        {/* ========== BLOCO 1 — RESULTADO ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-nello-gold/10"
          >
            <Star className="h-8 w-8 text-nello-gold" />
          </motion.div>
          
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Sua Leitura Inicial</p>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{prediction.archetypeName}</h1>
        </motion.div>

        {/* Emotional message */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="text-center space-y-3 py-4">
            <p className="font-display text-lg text-foreground/90 leading-relaxed">
              Esta é sua Leitura Inicial.
              <br />
              <span className="text-nello-gold font-medium">Ela revela o primeiro código do seu funcionamento.</span>
            </p>
            <p className="text-sm text-muted-foreground italic">
              Não é uma definição completa.
              <br />
              É o início da sua jornada Identity.
            </p>
          </div>
        </motion.div>

        {/* Narrative */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="border-nello-gold/20 bg-nello-gold/5">
            <CardContent className="p-5 space-y-3">
              <p className="text-base text-foreground leading-relaxed">{prediction.narrativeText}</p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Este resultado oferece um norte inicial sobre como você tende a perceber o mundo, agir e tomar decisões.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dimensions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Suas Dimensões</h3>
              {(Object.entries(prediction.dimensionProfile) as [ExpressDimension, number][]).map(([dim, value]) => {
                const meta = DIMENSION_META[dim];
                return (
                  <div key={dim} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={meta.color}>{meta.icon}</span>
                      <span className="text-sm font-medium text-foreground">{meta.label}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground ml-6">{meta.description}</p>
                    <div className="flex items-center gap-3 ml-6">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, value)}%` }} transition={{ delay: 1.1, duration: 0.8 }} className="h-full rounded-full bg-nello-gold/70" />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{value}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Identity cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium px-1">O que compõe sua Leitura</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Modo de Ação', value: ACTION_MODE_LABELS[prediction.disc.primary] || 'Modo Natural', sub: ACTION_MODE_LABELS[prediction.disc.secondary] || '', confidence: prediction.disc.confidence },
              { label: 'Energia Base', value: ENERGY_LABELS[prediction.temperament.primary] || 'Energia Natural', sub: ENERGY_LABELS[prediction.temperament.secondary] || '', confidence: prediction.temperament.confidence },
              { label: 'Arquitetura Cognitiva', value: 'Padrão Identificado', sub: `Clareza: ${prediction.nello16.confidence}%`, confidence: prediction.nello16.confidence },
              { label: 'Força Interior', value: DRIVE_LABELS[prediction.enneagram.primary] || 'Motivação Central', sub: DRIVE_LABELS[prediction.enneagram.secondary] || '', confidence: prediction.enneagram.confidence },
            ].map((item) => (
              <Card key={item.label} className="h-full">
                <CardContent className="p-3 space-y-1">
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-bold text-foreground leading-tight">{item.value}</p>
                  {item.sub && <p className="text-[11px] text-muted-foreground">{item.sub}</p>}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-nello-gold/50 transition-all duration-1000" style={{ width: `${item.confidence}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.confidence}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Human notice */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <p className="text-sm text-muted-foreground text-center leading-relaxed italic px-4">
            A Leitura Inicial não mostra toda a profundidade do seu funcionamento.
            Ela apenas revela a primeira camada.
          </p>
        </motion.div>

        {/* ========== BLOCO 2 — DEPOIMENTOS ========== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="space-y-4 pt-4">
          <h3 className="text-base font-semibold text-foreground text-center">
            Outras pessoas começaram exatamente daqui
          </h3>
          <div className="space-y-3">
            {RESULT_TESTIMONIALS.map((text, i) => (
              <div key={i} className="py-3 px-4 bg-muted/30 rounded-xl">
                <p className="text-sm text-foreground/70 italic leading-relaxed">"{text}"</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ========== BLOCO 3 — TRANSIÇÃO ========== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="space-y-4 pt-4">
          <div className="text-center space-y-3">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Existe uma leitura muito mais profunda esperando por você.
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed max-w-md mx-auto">
              O Código da Essência conecta múltiplas dimensões do seu funcionamento e revela padrões que não aparecem nesta etapa inicial.
            </p>
          </div>
        </motion.div>

        {/* ========== BLOCO 4 — OFERTA ========== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
          <Card className="border-nello-gold/30 bg-gradient-to-b from-nello-gold/5 to-transparent">
            <CardContent className="p-6 text-center space-y-4">
              <div className="space-y-2">
                <span className="font-display text-3xl font-bold text-foreground">R$ 99</span>
              </div>

              <Button onClick={() => setStep('lead_capture')} className="w-full bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite font-semibold rounded-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Desbloquear Código da Essência
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground leading-relaxed">
                A Leitura Inicial mostra o caminho.
                <br />
                O Código da Essência revela o mapa completo.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Confidence + disclaimer */}
        <div className="space-y-3 text-center">
          <Badge variant="secondary" className="text-[10px]">Confiança geral: {prediction.overallConfidence}%</Badge>
          <p className="text-[11px] text-muted-foreground">
            Este resultado é uma leitura inicial. Não constitui diagnóstico clínico ou avaliação terapêutica.
          </p>
        </div>
      </div>
    </div>
  );
}
