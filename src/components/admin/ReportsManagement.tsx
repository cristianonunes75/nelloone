import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const ReportsManagement = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Relatórios</h2>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Módulo de relatórios em desenvolvimento. Em breve você terá acesso a analytics e métricas detalhadas do sistema.
        </AlertDescription>
      </Alert>
    </div>
  );
};
