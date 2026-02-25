import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  onDeepen: () => void;
}

export default function EssenceUpsell({ onDeepen }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto space-y-4"
    >
      {/* Confirmation */}
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Seu Código está salvo.</p>
            <p className="text-xs text-muted-foreground">Agora você pode descobrir sua leitura completa.</p>
          </div>
        </CardContent>
      </Card>

      {/* Upsell Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div className="text-center space-y-3">
            <Badge variant="secondary" className="text-xs">
              Próximo passo da sua jornada
            </Badge>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Descubra seu Código da Essência
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Uma leitura profunda integrando padrões emocionais, comportamentais e internos que não aparecem em uma análise rápida.
            </p>
          </div>

          <div className="space-y-2">
            {[
              '7 dimensões completas da sua identidade',
              'Relatório personalizado com suas conexões internas',
              'Caminhos práticos de autodesenvolvimento',
              'Mapa completo do seu funcionamento natural',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>

          <div className="text-center space-y-1">
            <p className="text-3xl font-bold text-foreground">R$ 99,00</p>
            <p className="text-xs text-muted-foreground">pagamento único</p>
          </div>

          <Button
            onClick={onDeepen}
            className="w-full h-12 text-base rounded-xl"
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Aprofundar minha leitura
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
