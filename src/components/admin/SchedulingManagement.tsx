import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const SchedulingManagement = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Agendamentos</h2>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Módulo de agendamentos em desenvolvimento. Em breve você poderá visualizar e gerenciar todas as sessões.
        </AlertDescription>
      </Alert>
    </div>
  );
};
