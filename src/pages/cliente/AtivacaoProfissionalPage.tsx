import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductAccess } from "@/hooks/useProductAccess";
import { useAuth } from "@/hooks/useAuth";
import { ProfessionalActivationWizard } from "@/components/ativacao-profissional";
import { PurchaseProfessionalActivationDialog } from "@/components/cliente/PurchaseProfessionalActivationDialog";
import { Loader2 } from "lucide-react";

export default function AtivacaoProfissionalPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasAccess, isLoading: accessLoading } = useProductAccess("activation_individual");
  const [showPurchase, setShowPurchase] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!accessLoading && !hasAccess) {
      setShowPurchase(true);
    }
  }, [hasAccess, accessLoading]);

  if (authLoading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <PurchaseProfessionalActivationDialog
          open={showPurchase}
          onOpenChange={(open) => {
            setShowPurchase(open);
            if (!open) navigate("/cliente");
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfessionalActivationWizard />
    </div>
  );
}
