import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const CouponsManagement = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Cupons e Promoções</h2>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Módulo de cupons em desenvolvimento. Em breve você poderá criar e gerenciar cupons de desconto.
        </AlertDescription>
      </Alert>
    </div>
  );
};
