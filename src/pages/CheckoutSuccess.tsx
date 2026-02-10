import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";
import { clearAffiliateCode } from "@/hooks/useAffiliateTracking";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type VerifyStatus = "verifying" | "success" | "already_processed" | "error" | "pending";

const MESSAGES = {
  pt: {
    verifying: "Verificando seu pagamento...",
    success: "Pagamento confirmado!",
    already_processed: "Compra já processada!",
    pending: "Pagamento pendente",
    error: "Erro na verificação",
    successDesc: "Seu acesso foi liberado com sucesso. Você será redirecionado em instantes.",
    successDescContinue: "Seu acesso foi liberado! Vamos continuar de onde você parou.",
    successDescAtivacao: "Sua Ativação do Código foi liberada! Você será redirecionado para começar.",
    alreadyDesc: "Esta compra já foi processada anteriormente.",
    pendingDesc: "Seu pagamento ainda está sendo processado. Tente novamente em alguns segundos.",
    errorDesc: "Não foi possível verificar seu pagamento. Entre em contato com o suporte.",
    goToDashboard: "Ir para Minha Jornada",
    goToAtivacao: "Ir para Ativação",
    continueTest: "Continuar Teste",
    tryAgain: "Tentar novamente",
  },
  en: {
    verifying: "Verifying your payment...",
    success: "Payment confirmed!",
    already_processed: "Purchase already processed!",
    pending: "Payment pending",
    error: "Verification error",
    successDesc: "Your access has been granted. You will be redirected shortly.",
    successDescContinue: "Your access has been granted! Let's continue where you left off.",
    successDescAtivacao: "Your Code Activation has been unlocked! You will be redirected to begin.",
    alreadyDesc: "This purchase was already processed.",
    pendingDesc: "Your payment is still being processed. Please try again in a few seconds.",
    errorDesc: "Could not verify your payment. Please contact support.",
    goToDashboard: "Go to My Journey",
    goToAtivacao: "Go to Activation",
    continueTest: "Continue Test",
    tryAgain: "Try again",
  },
  "pt-pt": {
    verifying: "A verificar o seu pagamento...",
    success: "Pagamento confirmado!",
    already_processed: "Compra já processada!",
    pending: "Pagamento pendente",
    error: "Erro na verificação",
    successDesc: "O seu acesso foi libertado com sucesso. Será redirecionado em instantes.",
    successDescContinue: "O seu acesso foi libertado! Vamos continuar de onde parou.",
    successDescAtivacao: "A sua Ativação do Código foi libertada! Será redirecionado para começar.",
    alreadyDesc: "Esta compra já foi processada anteriormente.",
    pendingDesc: "O seu pagamento ainda está a ser processado. Tente novamente em alguns segundos.",
    errorDesc: "Não foi possível verificar o seu pagamento. Entre em contacto com o suporte.",
    goToDashboard: "Ir para A Minha Jornada",
    goToAtivacao: "Ir para Ativação",
    continueTest: "Continuar Teste",
    tryAgain: "Tentar novamente",
  },
};

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<VerifyStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  const t = MESSAGES[language as keyof typeof MESSAGES] || MESSAGES.pt;
  const sessionId = searchParams.get("session_id");

  // Check for pending test redirect
  const pendingTestId = sessionStorage.getItem("pendingTestId");
  const pendingUserTestId = sessionStorage.getItem("pendingUserTestId");
  const hasPendingTest = pendingTestId && pendingUserTestId;

  // Check for pending Ativação redirect
  const pendingAtivacaoRedirect = sessionStorage.getItem("pendingAtivacaoRedirect");

  const getBasePath = () => {
    return language === "en" ? "/en" : language === "pt-pt" ? "/pt-pt" : "";
  };

  const getDashboardPath = () => {
    return `${getBasePath()}/cliente`;
  };

  const getTestPath = () => {
    if (hasPendingTest) {
      return `${getBasePath()}/cliente/test-execution/${pendingTestId}/${pendingUserTestId}`;
    }
    return getDashboardPath();
  };

  const clearPendingTest = () => {
    sessionStorage.removeItem("pendingTestId");
    sessionStorage.removeItem("pendingUserTestId");
  };

  const clearPendingAtivacao = () => {
    sessionStorage.removeItem("pendingAtivacaoRedirect");
  };

  const getAtivacaoPath = () => {
    return `${getBasePath()}/cliente/ativacao`;
  };

  const handleRedirect = () => {
    if (pendingAtivacaoRedirect) {
      clearPendingAtivacao();
      navigate(getAtivacaoPath());
    } else if (hasPendingTest) {
      clearPendingTest();
      navigate(getTestPath());
    } else {
      navigate(getDashboardPath());
    }
  };

  const verifyCheckout = async () => {
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("No session ID provided");
      return;
    }

    setStatus("verifying");

    try {
      const { data, error } = await supabase.functions.invoke("verify-checkout", {
        body: { session_id: sessionId },
      });

      if (error) {
        console.error("Verify checkout error:", error);
        setStatus("error");
        setErrorMessage(error.message);
        return;
      }

      if (data.success) {
        // Clear affiliate code after successful purchase to prevent duplicate commissions
        clearAffiliateCode();
        
        // Invalidate ALL queries to force refresh - using predicate to catch userId-specific queries
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "test-purchases" });
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "user-tests" });
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "user-profile-journey" });
        queryClient.invalidateQueries({ queryKey: ["ativacao-codigo-purchase"] });
        queryClient.invalidateQueries({ queryKey: ["profile-ativacao-unlocked"] });
        
        if (data.already_processed) {
          setStatus("already_processed");
        } else {
          setStatus("success");
        }
        // Auto-redirect after 2 seconds (faster for better UX)
        setTimeout(() => {
          handleRedirect();
        }, 2000);
      } else if (data.status === "open" || data.payment_status === "unpaid") {
        setStatus("pending");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Verify checkout exception:", err);
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    verifyCheckout();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          {status === "verifying" && (
            <>
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
              <div>
                <h1 className="text-xl font-semibold">{t.verifying}</h1>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500" />
              <div className="space-y-2">
                <h1 className="text-xl font-semibold text-emerald-600">{t.success}</h1>
                <p className="text-muted-foreground text-sm">
                  {pendingAtivacaoRedirect 
                    ? t.successDescAtivacao 
                    : hasPendingTest 
                      ? t.successDescContinue 
                      : t.successDesc}
                </p>
              </div>
              <Button onClick={handleRedirect} className="w-full">
                {pendingAtivacaoRedirect 
                  ? t.goToAtivacao 
                  : hasPendingTest 
                    ? t.continueTest 
                    : t.goToDashboard}
              </Button>
            </>
          )}

          {status === "already_processed" && (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto text-blue-500" />
              <div className="space-y-2">
                <h1 className="text-xl font-semibold text-blue-600">{t.already_processed}</h1>
                <p className="text-muted-foreground text-sm">{t.alreadyDesc}</p>
              </div>
              <Button onClick={handleRedirect} className="w-full">
                {pendingAtivacaoRedirect 
                  ? t.goToAtivacao 
                  : hasPendingTest 
                    ? t.continueTest 
                    : t.goToDashboard}
              </Button>
            </>
          )}

          {status === "pending" && (
            <>
              <AlertCircle className="w-16 h-16 mx-auto text-amber-500" />
              <div className="space-y-2">
                <h1 className="text-xl font-semibold text-amber-600">{t.pending}</h1>
                <p className="text-muted-foreground text-sm">{t.pendingDesc}</p>
              </div>
              <Button onClick={verifyCheckout} variant="outline" className="w-full">
                {t.tryAgain}
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <div className="space-y-2">
                <h1 className="text-xl font-semibold text-red-600">{t.error}</h1>
                <p className="text-muted-foreground text-sm">{t.errorDesc}</p>
                {errorMessage && (
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    {errorMessage}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={verifyCheckout} variant="outline" className="flex-1">
                  {t.tryAgain}
                </Button>
                <Button onClick={() => navigate(getDashboardPath())} className="flex-1">
                  {t.goToDashboard}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
