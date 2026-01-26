import { useTestAccess } from "@/hooks/useTestAccessV2";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, CheckCircle, XCircle, Bug } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * TEMPORARY DEBUG PANEL
 * Shows real-time access values to diagnose the blocking issue.
 * Remove after fixing.
 */
export function DebugAccessPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { user, userRole } = useAuth();
  const { 
    hasFullJourneyAccess, 
    purchases, 
    isLoading,
    userProfile
  } = useTestAccess();

  // Calculate individual flags for display
  const hasBundlePurchase = purchases?.some(p => 
    (p as any).purchase_category === 'jornada_completa'
  ) || false;
  const hasAtivacaoUnlocked = userProfile?.ativacao_codigo_unlocked === true;
  const hasCompletedArquetipos = (userProfile?.journey_completed_tests ?? 0) >= 5;

  // These sub-components are defined inside the main component to avoid hooks order issues
  const getStatusIcon = (value: boolean | undefined) => {
    if (value === true) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (value === false) return <XCircle className="w-4 h-4 text-destructive" />;
    return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors"
      >
        <Bug className="w-4 h-4" />
      </button>

      {isExpanded && (
        <div className="bg-black/95 text-white text-xs rounded-lg p-4 shadow-2xl border border-yellow-500/50 min-w-[320px] max-w-[400px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-500/30">
            <Bug className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-yellow-500">DEBUG: Access Panel</span>
            {isLoading && <span className="text-yellow-400 animate-pulse">Loading...</span>}
          </div>

          <div className="space-y-2">
            {/* User Info */}
            <div className="pb-2 border-b border-white/10">
              <div className="text-muted-foreground">User ID:</div>
              <div className="font-mono text-[10px] break-all">{user?.id || "N/A"}</div>
              <div className="text-muted-foreground mt-1">Email:</div>
              <div className="font-mono text-[10px]">{user?.email || "N/A"}</div>
              <div className="text-muted-foreground mt-1">Role:</div>
              <div className="font-mono">{userRole || "N/A"}</div>
            </div>

            {/* Main Access Flag */}
            <div className={cn(
              "p-2 rounded-lg",
              hasFullJourneyAccess ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-destructive/20 border border-destructive/50"
            )}>
              <div className="flex items-center gap-2">
                {getStatusIcon(hasFullJourneyAccess)}
                <span className="font-bold">hasFullJourneyAccess:</span>
                <span className={hasFullJourneyAccess ? "text-emerald-400" : "text-destructive"}>
                  {String(hasFullJourneyAccess)}
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-1 pl-2 border-l-2 border-amber-500/30">
              <div className="flex items-center gap-2">
                {getStatusIcon(hasBundlePurchase)}
                <span>hasBundlePurchase:</span>
                <span className={hasBundlePurchase ? "text-emerald-400" : "text-muted-foreground"}>
                  {String(hasBundlePurchase)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusIcon(hasAtivacaoUnlocked)}
                <span>hasAtivacaoUnlocked:</span>
                <span className={hasAtivacaoUnlocked ? "text-emerald-400" : "text-muted-foreground"}>
                  {String(hasAtivacaoUnlocked)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusIcon(hasCompletedArquetipos)}
                <span>hasCompletedArquetipos (≥5):</span>
                <span className={hasCompletedArquetipos ? "text-emerald-400" : "text-muted-foreground"}>
                  {String(hasCompletedArquetipos)}
                </span>
              </div>
            </div>

            {/* Raw Profile Data */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-muted-foreground mb-1">Profile Data (from DB):</div>
              <div className="bg-white/5 rounded p-2 font-mono text-[10px] overflow-auto max-h-[100px]">
                {userProfile ? (
                  <pre>{JSON.stringify(userProfile, null, 2)}</pre>
                ) : (
                  <span className="text-yellow-400">Profile not loaded</span>
                )}
              </div>
            </div>

            {/* Purchases */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-muted-foreground mb-1">
                Purchases ({purchases?.length || 0}):
              </div>
              <div className="bg-white/5 rounded p-2 font-mono text-[10px] overflow-auto max-h-[80px]">
                {purchases && purchases.length > 0 ? (
                  <pre>{JSON.stringify(purchases, null, 2)}</pre>
                ) : (
                  <span className="text-muted-foreground">No purchases</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-muted-foreground">
            🔧 Painel temporário para diagnóstico. Remover após correção.
          </div>
        </div>
      )}
    </div>
  );
}
