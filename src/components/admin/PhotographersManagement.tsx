import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const PhotographersManagement = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Gerenciamento de Fotógrafos</h2>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Módulo de fotógrafos em desenvolvimento. Em breve você poderá aprovar, remover e gerenciar fotógrafos.
        </AlertDescription>
      </Alert>
    </div>
  );
};
