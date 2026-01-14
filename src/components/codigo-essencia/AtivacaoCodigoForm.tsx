import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface AtivacaoCodigoFormProps {
  onSubmit: (historia: HistoriaUsuario) => void;
  isLoading?: boolean;
  language?: string;
}

export interface HistoriaUsuario {
  historia_profissional: string;
  sabotagem_atual: string;
  dificuldade_venda: string;
  desejo_mudanca: string;
}

const labels = {
  pt: {
    title: "Ativação do Código da Essência",
    subtitle: "Responda com sinceridade. Quanto mais real, mais poderosa a ativação.",
    profissional: {
      label: "Sua história profissional e financeira",
      placeholder: "Conte sua trajetória: como começou, onde chegou, os altos e baixos com dinheiro e trabalho..."
    },
    sabotagem: {
      label: "Onde você sente que se sabota hoje?",
      placeholder: "Descreva os padrões que você percebe se repetindo, as escolhas que você faz mesmo sabendo que não deveria..."
    },
    venda: {
      label: "Qual sua dificuldade em se vender ou se posicionar?",
      placeholder: "Como você se apresenta? O que sente quando precisa falar de si, do seu trabalho, do seu valor..."
    },
    mudanca: {
      label: "O que você deseja mudar agora?",
      placeholder: "O que não aguenta mais? O que precisa mudar para você se sentir alinhado(a)..."
    },
    submit: "Gerar Ativação",
    generating: "Gerando sua ativação..."
  },
  "pt-pt": {
    title: "Ativação do Código da Essência",
    subtitle: "Responda com sinceridade. Quanto mais real, mais poderosa a ativação.",
    profissional: {
      label: "A sua história profissional e financeira",
      placeholder: "Conte a sua trajetória: como começou, onde chegou, os altos e baixos com dinheiro e trabalho..."
    },
    sabotagem: {
      label: "Onde sente que se sabota hoje?",
      placeholder: "Descreva os padrões que percebe a repetirem-se, as escolhas que faz mesmo sabendo que não deveria..."
    },
    venda: {
      label: "Qual a sua dificuldade em se vender ou posicionar?",
      placeholder: "Como se apresenta? O que sente quando precisa falar de si, do seu trabalho, do seu valor..."
    },
    mudanca: {
      label: "O que deseja mudar agora?",
      placeholder: "O que não aguenta mais? O que precisa mudar para se sentir alinhado(a)..."
    },
    submit: "Gerar Ativação",
    generating: "A gerar a sua ativação..."
  },
  en: {
    title: "Essence Code Activation",
    subtitle: "Answer honestly. The more real, the more powerful the activation.",
    profissional: {
      label: "Your professional and financial history",
      placeholder: "Tell your journey: how you started, where you are now, the ups and downs with money and work..."
    },
    sabotagem: {
      label: "Where do you feel you sabotage yourself today?",
      placeholder: "Describe the patterns you see repeating, the choices you make even knowing you shouldn't..."
    },
    venda: {
      label: "What's your difficulty in selling or positioning yourself?",
      placeholder: "How do you present yourself? What do you feel when you need to talk about yourself, your work, your value..."
    },
    mudanca: {
      label: "What do you want to change now?",
      placeholder: "What can't you take anymore? What needs to change for you to feel aligned..."
    },
    submit: "Generate Activation",
    generating: "Generating your activation..."
  }
};

export function AtivacaoCodigoForm({ onSubmit, isLoading = false, language = "pt" }: AtivacaoCodigoFormProps) {
  const t = labels[language as keyof typeof labels] || labels.pt;
  
  const [historia, setHistoria] = useState<HistoriaUsuario>({
    historia_profissional: "",
    sabotagem_atual: "",
    dificuldade_venda: "",
    desejo_mudanca: ""
  });

  const isComplete = Object.values(historia).every(v => v.trim().length >= 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onSubmit(historia);
    }
  };

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* História Profissional */}
          <div className="space-y-2">
            <Label htmlFor="historia_profissional" className="text-base font-medium">
              {t.profissional.label}
            </Label>
            <Textarea
              id="historia_profissional"
              placeholder={t.profissional.placeholder}
              value={historia.historia_profissional}
              onChange={(e) => setHistoria(prev => ({ ...prev, historia_profissional: e.target.value }))}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Sabotagem Atual */}
          <div className="space-y-2">
            <Label htmlFor="sabotagem_atual" className="text-base font-medium">
              {t.sabotagem.label}
            </Label>
            <Textarea
              id="sabotagem_atual"
              placeholder={t.sabotagem.placeholder}
              value={historia.sabotagem_atual}
              onChange={(e) => setHistoria(prev => ({ ...prev, sabotagem_atual: e.target.value }))}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Dificuldade em se Vender */}
          <div className="space-y-2">
            <Label htmlFor="dificuldade_venda" className="text-base font-medium">
              {t.venda.label}
            </Label>
            <Textarea
              id="dificuldade_venda"
              placeholder={t.venda.placeholder}
              value={historia.dificuldade_venda}
              onChange={(e) => setHistoria(prev => ({ ...prev, dificuldade_venda: e.target.value }))}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Desejo de Mudança */}
          <div className="space-y-2">
            <Label htmlFor="desejo_mudanca" className="text-base font-medium">
              {t.mudanca.label}
            </Label>
            <Textarea
              id="desejo_mudanca"
              placeholder={t.mudanca.placeholder}
              value={historia.desejo_mudanca}
              onChange={(e) => setHistoria(prev => ({ ...prev, desejo_mudanca: e.target.value }))}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            disabled={!isComplete || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t.generating}
              </>
            ) : (
              <>
                {t.submit}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
