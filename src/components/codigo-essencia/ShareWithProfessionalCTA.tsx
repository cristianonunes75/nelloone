import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Share2, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareWithProfessionalCTAProps {
  userId: string;
  language: "pt" | "pt-pt" | "en";
}

interface LinkedProfessional {
  operatorName: string;
  professionalClientId: string;
}

const TRANSLATIONS = {
  pt: {
    title: "Compartilhe com seu profissional",
    description: "Permita que seu coach, mentor ou terapeuta acesse seu Código da Essência diretamente na plataforma.",
    share: "Compartilhar com",
    shared: "Compartilhado com",
    sharing: "Compartilhando...",
    success: "Código compartilhado com sucesso!",
    error: "Erro ao compartilhar.",
    alreadyShared: "Seu profissional já tem acesso ao seu Código da Essência.",
    noProfessional: "Você ainda não tem um profissional vinculado.",
  },
  "pt-pt": {
    title: "Partilhe com o seu profissional",
    description: "Permita que o seu coach, mentor ou terapeuta aceda ao seu Código da Essência diretamente na plataforma.",
    share: "Partilhar com",
    shared: "Partilhado com",
    sharing: "A partilhar...",
    success: "Código partilhado com sucesso!",
    error: "Erro ao partilhar.",
    alreadyShared: "O seu profissional já tem acesso ao seu Código da Essência.",
    noProfessional: "Ainda não tem um profissional vinculado.",
  },
  en: {
    title: "Share with your professional",
    description: "Allow your coach, mentor or therapist to access your Essence Code directly on the platform.",
    share: "Share with",
    shared: "Shared with",
    sharing: "Sharing...",
    success: "Code shared successfully!",
    error: "Error sharing.",
    alreadyShared: "Your professional already has access to your Essence Code.",
    noProfessional: "You don't have a linked professional yet.",
  },
};

export function ShareWithProfessionalCTA({ userId, language }: ShareWithProfessionalCTAProps) {
  const [professional, setProfessional] = useState<LinkedProfessional | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const fetchProfessionalAndStatus = async () => {
      try {
        // Check if user has a linked professional
        const { data: pcData } = await supabase
          .from("professional_clients")
          .select("id, professional_id, share_reports_with_professional")
          .eq("client_user_id", userId)
          .eq("status", "active")
          .limit(1)
          .maybeSingle();

        if (!pcData) {
          setIsLoading(false);
          return;
        }

        // Get operator name
        const { data: owData } = await supabase
          .from("operator_workspaces")
          .select("display_name")
          .eq("id", pcData.professional_id)
          .maybeSingle();

        setProfessional({
          operatorName: owData?.display_name || (language === "en" ? "Your Professional" : "Seu Profissional"),
          professionalClientId: pcData.id,
        });

        // Check if mapa is already shared
        const { data: mapaData } = await supabase
          .from("mapa_essencia")
          .select("is_shared_with_professionals")
          .eq("user_id", userId)
          .maybeSingle();

        setIsShared(mapaData?.is_shared_with_professionals || false);
      } catch (err) {
        console.error("Error fetching professional data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionalAndStatus();
  }, [userId, language]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const { error } = await supabase
        .from("mapa_essencia")
        .update({
          is_shared_with_professionals: true,
          shared_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;

      // Also update professional_clients share flag
      if (professional) {
        await supabase
          .from("professional_clients")
          .update({ share_reports_with_professional: true })
          .eq("id", professional.professionalClientId);
      }

      setIsShared(true);
      toast.success(t.success);
    } catch (err) {
      console.error("Error sharing:", err);
      toast.error(t.error);
    } finally {
      setIsSharing(false);
    }
  };

  if (isLoading || !professional) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background overflow-hidden">
      <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isShared ? "bg-accent" : "bg-primary/10"
        )}>
          {isShared ? (
            <CheckCircle2 className="w-5 h-5 text-primary" />
          ) : (
            <Share2 className="w-5 h-5 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">
            {isShared ? t.alreadyShared : t.title}
          </p>
          {!isShared && (
            <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
          )}
        </div>

        {!isShared && (
          <Button
            size="sm"
            onClick={handleShare}
            disabled={isSharing}
            className="flex-shrink-0 gap-1.5"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t.sharing}
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                {t.share} {professional.operatorName}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
