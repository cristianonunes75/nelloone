import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";
import { PurchaseTestDialog } from "./PurchaseTestDialog";

interface LockedTestCardProps {
  id: string;
  name: string;
  description: string;
  questionsCount: number;
  estimatedMinutes: number;
  icon?: string;
  price: number;
}

export const LockedTestCard = ({
  id,
  name,
  description,
  questionsCount,
  estimatedMinutes,
  icon = "Circle",
  price,
}: LockedTestCardProps) => {
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const IconComponent = (Icons as any)[icon] || Icons.Circle;

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden opacity-75 hover:opacity-100 transition-all duration-300">
        {/* Locked overlay */}
        <div className="absolute top-4 right-4 bg-primary/10 rounded-full p-2">
          <Lock className="w-5 h-5 text-primary" />
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-gold opacity-50" />
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Bloqueado
          </Badge>
        </div>

        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedMinutes} min</span>
          </div>
          <div>
            <span>{questionsCount} questões</span>
          </div>
        </div>

        <div className="bg-accent/10 border border-border rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Desbloqueie este teste</p>
              <p className="text-xs text-muted-foreground">Pagamento único</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                R$ {price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowPurchaseDialog(true)}
          className="w-full"
          variant="default"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Desbloquear Teste
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-2">
          ou escolha um combo com desconto
        </p>
      </div>

      <PurchaseTestDialog
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        testId={id}
        testName={name}
        price={price}
      />
    </>
  );
};
