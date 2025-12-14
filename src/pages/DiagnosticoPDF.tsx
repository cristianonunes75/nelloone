import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, ArrowLeft } from "lucide-react";
import { generateDiagnosticoPDF } from "@/lib/pdfDiagnostico";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";

export default function DiagnosticoPDF() {
  const navigate = useNavigate();

  const handleDownload = () => {
    try {
      generateDiagnosticoPDF({
        generatedAt: new Date().toLocaleDateString("pt-BR"),
        projectName: "NELLO ONE",
      });
      toast.success("PDF do diagnostico baixado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <LogoText className="text-2xl" variant="solid" />
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Admin
          </Button>
        </div>
      </header>

      <main className="container px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Diagnostico Completo NELLO ONE</CardTitle>
              <CardDescription>
                Analise tecnica, estrategica e de produto com 8 secoes detalhadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">O que esta incluido:</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Visao Geral do Produto</li>
                  <li>• Inventario Funcional Completo (Frontend, Backend, Edge Functions)</li>
                  <li>• Jornada Real do Usuario</li>
                  <li>• Nivel de Maturidade</li>
                  <li>• Gap Analysis (Lacunas e Excessos)</li>
                  <li>• Preparacao para Hotmart</li>
                  <li>• Riscos Tecnicos, de Produto e Posicionamento</li>
                  <li>• Conclusao Executiva e Proximos Passos</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <strong>Dados em tempo real:</strong> Este diagnostico reflete o estado atual do
                  banco de dados (5 usuarios, 3 fundadores, 1 teste completado, 0 jornadas
                  completas).
                </p>
              </div>

              <Button onClick={handleDownload} className="w-full h-12 text-base" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Baixar PDF do Diagnostico
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
