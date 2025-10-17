import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const CommunicationManagement = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Comunicação</h2>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Módulo de comunicação em desenvolvimento. Em breve você poderá enviar mensagens e notificações aos usuários.
        </AlertDescription>
      </Alert>
    </div>
  );
};
