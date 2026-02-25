import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, TrendingUp, Brain, Heart, Shield, Zap } from "lucide-react";
import type { ExpressPrediction, ExpressDimension } from "@/lib/codigoExpress";

interface Props {
  prediction: ExpressPrediction;
  onDeepen: () => void;
}

const DIMENSION_META: Record<ExpressDimension, { label: string; icon: React.ReactNode; color: string }> = {
  decision_mode: { label: 'Modo de Decisão', icon: <Brain className="h-4 w-4" />, color: 'text-blue-500' },
  social_reaction: { label: 'Reação Social', icon: <Heart className="h-4 w-4" />, color: 'text-rose-500' },
  pressure_response: { label: 'Resposta sob Pressão', icon: <Shield className="h-4 w-4" />, color: 'text-amber-500' },
  mental_processing: { label: 'Processamento Mental', icon: <TrendingUp className="h-4 w-4" />, color: 'text-emerald-500' },
  inner_tension: { label: 'Tensão Interna', icon: <Zap className="h-4 w-4" />, color: 'text-purple-500' },
};

const DISC_LABELS: Record<string, string> = { D: 'Dominância', I: 'Influência', S: 'Estabilidade', C: 'Conformidade' };
const TEMP_LABELS: Record<string, string> = { sanguineo: 'Sanguíneo', colerico: 'Colérico', melancolico: 'Melancólico', fleumatico: 'Fleumático' };
const ENNEA_LABELS: Record<string, string> = {
  '1': 'Reformador', '2': 'Ajudante', '3': 'Realizador', '4': 'Romântico', '5': 'Investigador',
  '6': 'Leal', '7': 'Entusiasta', '8': 'Desafiador', '9': 'Pacificador',
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
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10"
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Seu Código Express</h1>
          <Badge variant="secondary" className="text-xs">
            Confiança: {prediction.overallConfidence}%
          </Badge>
        </div>

        {/* Essence Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <p className="text-base text-foreground leading-relaxed italic">
                "{prediction.essenceSummary}"
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Predictions Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: 'Perfil DISC',
              value: DISC_LABELS[prediction.disc.primary] || prediction.disc.primary,
              sub: `+ ${DISC_LABELS[prediction.disc.secondary] || prediction.disc.secondary}`,
              confidence: prediction.disc.confidence,
              delay: 0.6,
            },
            {
              label: 'Temperamento',
              value: TEMP_LABELS[prediction.temperament.primary] || prediction.temperament.primary,
              sub: `+ ${TEMP_LABELS[prediction.temperament.secondary] || prediction.temperament.secondary}`,
              confidence: prediction.temperament.confidence,
              delay: 0.7,
            },
            {
              label: 'Personalidade',
              value: prediction.nello16.type,
              sub: 'Nello16',
              confidence: prediction.nello16.confidence,
              delay: 0.8,
            },
            {
              label: 'Eneagrama',
              value: `Tipo ${prediction.enneagram.primary}`,
              sub: ENNEA_LABELS[prediction.enneagram.primary] || '',
              confidence: prediction.enneagram.confidence,
              delay: 0.9,
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay }}
            >
              <Card className="h-full">
                <CardContent className="p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-1000"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.confidence}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Dimension Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Perfil Dimensional</h3>
              {(Object.entries(prediction.dimensionProfile) as [ExpressDimension, number][]).map(([dim, value]) => {
                const meta = DIMENSION_META[dim];
                return (
                  <div key={dim} className="flex items-center gap-3">
                    <span className={`${meta.color}`}>{meta.icon}</span>
                    <span className="text-xs text-muted-foreground w-36 flex-shrink-0">{meta.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, value)}%` }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="h-full rounded-full bg-primary/70"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{value}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="space-y-3"
        >
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-5 text-center space-y-3">
              <p className="text-sm text-foreground font-medium">
                Isso é uma estimativa. O Código completo revela muito mais.
              </p>
              <p className="text-xs text-muted-foreground">
                7 testes × análise profunda × relatório personalizado com IA
              </p>
              <Button onClick={onDeepen} className="w-full" size="lg">
                Descobrir meu Código completo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <p className="text-[11px] text-center text-muted-foreground">
            Este resultado é uma estimativa baseada em modelo preditivo comprimido.
            Não constitui diagnóstico clínico ou avaliação terapêutica.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
