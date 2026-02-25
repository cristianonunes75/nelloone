import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Brain, Heart, Shield, Compass, Flame, Star } from "lucide-react";
import type { ExpressPrediction, ExpressDimension } from "@/lib/codigoExpress";

interface Props {
  prediction: ExpressPrediction;
  onDeepen: () => void;
}

/** Human-readable dimension labels — no technical siglas */
const DIMENSION_META: Record<ExpressDimension, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  decision_mode: { label: 'Estilo de Decisão', description: 'Como você escolhe e age', icon: <Brain className="h-4 w-4" />, color: 'text-blue-500' },
  social_reaction: { label: 'Forma de Conectar', description: 'Como você se relaciona', icon: <Heart className="h-4 w-4" />, color: 'text-rose-500' },
  pressure_response: { label: 'Modo de Ação', description: 'Como você reage sob pressão', icon: <Shield className="h-4 w-4" />, color: 'text-amber-500' },
  mental_processing: { label: 'Energia Base', description: 'Como sua mente processa', icon: <Compass className="h-4 w-4" />, color: 'text-emerald-500' },
  inner_tension: { label: 'Força Interior', description: 'O que move você por dentro', icon: <Flame className="h-4 w-4" />, color: 'text-purple-500' },
};

/** Human identity translations for DISC — used only for display */
const ACTION_MODE_LABELS: Record<string, string> = { D: 'Ação Direta', I: 'Conexão Ativa', S: 'Presença Constante', C: 'Precisão Estratégica' };
/** Human identity translations for Temperaments */
const ENERGY_LABELS: Record<string, string> = { sanguineo: 'Energia Expansiva', colerico: 'Energia Propulsora', melancolico: 'Energia Profunda', fleumatico: 'Energia Sustentada' };
/** Human identity translations for Enneagram */
const DRIVE_LABELS: Record<string, string> = {
  '1': 'Busca pela Excelência', '2': 'Cuidado Essencial', '3': 'Realização e Impacto',
  '4': 'Autenticidade Profunda', '5': 'Compreensão do Mundo', '6': 'Segurança e Lealdade',
  '7': 'Liberdade e Possibilidades', '8': 'Força e Autonomia', '9': 'Paz e Harmonia',
};

export default function ExpressResult({ prediction, onDeepen }: Props) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full space-y-6"
      >
        {/* Header — Archetype Identity */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10"
          >
            <Star className="h-8 w-8 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mb-2">
              Seu Código Inicial
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {prediction.archetypeName}
            </h1>
          </motion.div>
        </div>

        {/* Human Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <p className="text-base text-foreground leading-relaxed">
                {prediction.narrativeText}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dimension Profile — Primary visual (human labels) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
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
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, value)}%` }}
                          transition={{ delay: 1.1, duration: 0.8 }}
                          className="h-full rounded-full bg-primary/70"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{value}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Identity Dimensions — humanized, no siglas */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-2"
        >
          <p className="text-xs text-muted-foreground font-medium px-1">O que compõe seu Código</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Modo de Ação',
                value: ACTION_MODE_LABELS[prediction.disc.primary] || 'Modo Natural',
                sub: ACTION_MODE_LABELS[prediction.disc.secondary] || '',
                confidence: prediction.disc.confidence,
              },
              {
                label: 'Energia Base',
                value: ENERGY_LABELS[prediction.temperament.primary] || 'Energia Natural',
                sub: ENERGY_LABELS[prediction.temperament.secondary] || '',
                confidence: prediction.temperament.confidence,
              },
              {
                label: 'Arquitetura Cognitiva',
                value: 'Padrão Identificado',
                sub: `Clareza: ${prediction.nello16.confidence}%`,
                confidence: prediction.nello16.confidence,
              },
              {
                label: 'Força Interior',
                value: DRIVE_LABELS[prediction.enneagram.primary] || 'Motivação Central',
                sub: DRIVE_LABELS[prediction.enneagram.secondary] || '',
                confidence: prediction.enneagram.confidence,
              },
            ].map((item) => (
              <Card key={item.label} className="h-full">
                <CardContent className="p-3 space-y-1">
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-bold text-foreground leading-tight">{item.value}</p>
                  {item.sub && <p className="text-[11px] text-muted-foreground">{item.sub}</p>}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/50 transition-all duration-1000"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.confidence}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Transition Block + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="space-y-3"
        >
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-5 text-center space-y-4">
              <div className="space-y-2">
                <p className="text-base text-foreground font-semibold">
                  Este é o seu Código Inicial.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O Código da Essência revela camadas mais profundas que ainda não apareceram aqui.
                  São 7 dimensões de análise, cruzamentos e um relatório personalizado com IA.
                </p>
              </div>
              <Button onClick={onDeepen} className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Descobrir meu Código da Essência
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              Confiança geral: {prediction.overallConfidence}%
            </Badge>
          </div>

          <p className="text-[11px] text-center text-muted-foreground">
            Este resultado é uma leitura inicial baseada em modelo preditivo.
            Não constitui diagnóstico clínico ou avaliação terapêutica.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
