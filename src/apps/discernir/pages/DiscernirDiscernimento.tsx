import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDiscernimentoEspiritual } from '../hooks/useDiscernimentoEspiritual';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Loader2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  Cross,
  Flame,
  Shield,
  Star,
  HelpCircle,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Section({
  title,
  icon: Icon,
  color,
  items,
  defaultOpen = true,
}: {
  title: string;
  icon: any;
  color: string;
  items: string[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="border-amber-200/50 bg-white/80">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <CardTitle className={`text-sm flex items-center justify-between font-serif ${color}`}>
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="pt-0 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-amber-900">
              <span className="text-amber-400 mt-0.5">•</span>
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

function NumberedSection({
  title,
  icon: Icon,
  color,
  items,
}: {
  title: string;
  icon: any;
  color: string;
  items: string[];
}) {
  const [open, setOpen] = useState(true);
  return (
    <Card className="border-amber-200/50 bg-white/80">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <CardTitle className={`text-sm flex items-center justify-between font-serif ${color}`}>
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="pt-0 space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-amber-900">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{item}</span>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

export function DiscernirDiscernimento() {
  const { user } = useAuth();
  const { discernimento, hasCodigoEssencia, isLoading, refresh } = useDiscernimentoEspiritual();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('discernir-generate-discernimento', {
        body: {},
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await refresh();
      toast.success('Perfil de Discernimento Espiritual gerado com sucesso');
    } catch (error: any) {
      console.error('Generate error:', error);
      toast.error(error.message || 'Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!discernimento) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxW = pageW - margin * 2;
    let y = 20;

    const addLine = (text: string, fontSize = 11, bold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxW);
      lines.forEach((line: string) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += fontSize * 0.5;
      });
      y += 3;
    };

    const addSection = (title: string, items: string[]) => {
      y += 4;
      addLine(title, 12, true);
      items.forEach((item, i) => addLine(`${i + 1 < 10 ? ' ' : ''}• ${item}`, 10));
    };

    // Título
    addLine('PERFIL DE DISCERNIMENTO ESPIRITUAL', 16, true);
    addLine(user?.user_metadata?.full_name || 'Peregrino', 13);
    addLine(format(new Date(discernimento.generated_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }), 10);
    y += 4;

    // Aviso
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    const aviso = doc.splitTextToSize('Este documento é um instrumento de reflexão espiritual. Não substitui acompanhamento pastoral ou direção espiritual.', maxW);
    aviso.forEach((l: string) => { doc.text(l, margin, y); y += 5; });
    y += 4;

    // Apresentação
    addLine('Apresentação', 12, true);
    addLine(discernimento.apresentacao || '', 10);

    // Seções
    addSection('Tendências da Personalidade', discernimento.tendencias_personalidade);
    addSection('Tensões Interiores Prováveis', discernimento.tensoes_interiores);
    addSection('Riscos Espirituais', discernimento.riscos_espirituais);
    addSection('Potenciais de Vocação', discernimento.potenciais_vocacao);
    addSection('Perguntas para Direção Espiritual', discernimento.perguntas_direcao);

    doc.save(`Discernimento_Espiritual_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF baixado');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/40">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 p-3">
              <Cross className="h-6 w-6 text-amber-700" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Discernimento Espiritual
          </h1>
          <p className="text-sm text-muted-foreground">
            Guia pessoal para conversa com diretor espiritual
          </p>
        </div>

        {/* Sem Código da Essência */}
        {!hasCodigoEssencia && (
          <Card className="border-amber-200/50 bg-amber-50/80">
            <CardContent className="pt-6 text-center space-y-3">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
              <p className="text-sm text-amber-800 font-medium">
                Código da Essência necessário
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Para gerar seu Perfil de Discernimento Espiritual, você precisa ter completado
                sua jornada e gerado o Código da Essência no{' '}
                <a href="https://identity.nello.one" className="underline" target="_blank" rel="noopener noreferrer">
                  Identity
                </a>.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sem discernimento gerado */}
        {hasCodigoEssencia && !discernimento && (
          <Card className="border-amber-200/50 bg-white/80">
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-3 text-sm text-amber-900 leading-relaxed">
                <p>
                  Gere um resumo espiritual baseado no seu Código da Essência para ajudar
                  no discernimento da sua vocação, tensões interiores e caminhos de crescimento.
                </p>
                <div className="rounded-lg bg-amber-50 border border-amber-200/50 p-3 text-xs text-amber-700 italic">
                  Este relatório traduz seu perfil humano em pontos de reflexão para direção espiritual.
                </div>
              </div>
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 gap-2"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generating ? 'Gerando...' : 'Gerar Discernimento Espiritual'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Relatório gerado */}
        {discernimento && (
          <>
            {/* Cabeçalho do relatório */}
            <Card className="border-amber-300/50 bg-gradient-to-br from-amber-50/80 to-orange-50/40">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Versão {discernimento.version}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(discernimento.generated_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-amber-900 leading-relaxed">
                  <p className="font-serif text-base font-medium">Apresentação</p>
                  <p>{discernimento.apresentacao}</p>
                  <Separator className="bg-amber-200/50" />
                  <p className="text-xs text-amber-700 italic">
                    Este documento não define sua identidade. Ele traduz tendências humanas
                    observadas no seu Código da Essência em pontos de reflexão espiritual.
                    Seu objetivo é ajudar conversas de discernimento com diretor espiritual.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Seções */}
            <Section
              title="Tendências da Personalidade"
              icon={User}
              color="text-amber-800"
              items={discernimento.tendencias_personalidade}
            />
            <Section
              title="Tensões Interiores Prováveis"
              icon={Flame}
              color="text-orange-800"
              items={discernimento.tensoes_interiores}
            />
            <Section
              title="Riscos Espirituais"
              icon={Shield}
              color="text-red-700"
              items={discernimento.riscos_espirituais}
            />
            <Section
              title="Potenciais de Vocação"
              icon={Star}
              color="text-emerald-700"
              items={discernimento.potenciais_vocacao}
            />
            <NumberedSection
              title="Perguntas para Direção Espiritual"
              icon={HelpCircle}
              color="text-violet-700"
              items={discernimento.perguntas_direcao}
            />

            {/* Aviso obrigatório */}
            <Card className="border-amber-200/30 bg-muted/30">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground italic text-center leading-relaxed">
                  Este documento é um instrumento de reflexão espiritual. Ele não substitui
                  acompanhamento pastoral, direção espiritual ou discernimento pessoal diante de Deus.
                </p>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4" />
                Baixar
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 gap-2"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Regenerar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
