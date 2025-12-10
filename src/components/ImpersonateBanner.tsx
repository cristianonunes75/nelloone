import { useImpersonate } from "@/contexts/ImpersonateContext";
import { UserCog, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ImpersonateBanner = () => {
  const { impersonatedUserId, impersonatedUserName, clearImpersonation } = useImpersonate();

  if (!impersonatedUserId) return null;

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-200/50 rounded-full">
            <UserCog className="w-4 h-4 text-amber-700" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-semibold text-amber-900 text-sm">
              Modo Impersonate ativo
            </span>
            <span className="text-amber-800 text-sm">
              Você está acessando a conta de <span className="font-medium">{impersonatedUserName}</span>
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearImpersonation}
          className="border-amber-300 text-amber-900 bg-transparent hover:bg-amber-100 text-xs font-medium gap-2"
        >
          <X className="w-3 h-3" />
          <span className="hidden sm:inline">Voltar para Admin</span>
          <span className="sm:hidden">Sair</span>
        </Button>
      </div>
    </div>
  );
};
