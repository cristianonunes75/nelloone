import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Shield, Crown, Heart, Sparkles, Package, Map } from "lucide-react";

interface UserData {
  id: string;
  full_name: string;
  roles: string[];
}

interface ProductAccess {
  has_activation_individual: boolean;
  has_nello_couple: boolean;
  has_activation_couple: boolean;
  has_identity_couple_premium: boolean;
  ativacao_codigo_unlocked: boolean;
}

interface AdminUserManagementDialogProps {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const PRODUCT_LABELS: Record<keyof ProductAccess, { label: string; icon: React.ReactNode; description: string }> = {
  has_identity_couple_premium: {
    label: "Identity Couple Premium",
    icon: <Crown className="w-4 h-4 text-amber-500" />,
    description: "Pacote completo de casal com Nello Couple + Ativação Couple",
  },
  has_nello_couple: {
    label: "Nello Couple",
    icon: <Heart className="w-4 h-4 text-rose-500" />,
    description: "Cruzamento de perfis para casais",
  },
  has_activation_couple: {
    label: "Ativação Couple",
    icon: <Sparkles className="w-4 h-4 text-violet-500" />,
    description: "Ativação profunda para casais",
  },
  has_activation_individual: {
    label: "Ativação Individual",
    icon: <Sparkles className="w-4 h-4 text-blue-500" />,
    description: "Ativação profunda individual",
  },
  ativacao_codigo_unlocked: {
    label: "Ativação do Código",
    icon: <Package className="w-4 h-4 text-emerald-500" />,
    description: "Módulo de ativação do código da essência",
  },
};

export const AdminUserManagementDialog = ({
  user,
  open,
  onOpenChange,
  onUpdate,
}: AdminUserManagementDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmAdminAction, setConfirmAdminAction] = useState<"add" | "remove" | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasJornadaCompleta, setHasJornadaCompleta] = useState(false);
  const [savingJornada, setSavingJornada] = useState(false);
  const [productAccess, setProductAccess] = useState<ProductAccess>({
    has_activation_individual: false,
    has_nello_couple: false,
    has_activation_couple: false,
    has_identity_couple_premium: false,
    ativacao_codigo_unlocked: false,
  });
  const [originalProductAccess, setOriginalProductAccess] = useState<ProductAccess | null>(null);

  useEffect(() => {
    if (user && open) {
      fetchUserData();
    }
  }, [user, open]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      setIsAdmin(!!roleData);

      // Check Jornada Completa access
      const { data: jornada } = await supabase
        .from("test_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("purchase_category", "jornada_completa")
        .eq("payment_status", "completed")
        .limit(1)
        .maybeSingle();

      setHasJornadaCompleta(!!jornada);

      // Fetch product access
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(`
          has_activation_individual,
          has_nello_couple,
          has_activation_couple,
          has_identity_couple_premium,
          ativacao_codigo_unlocked
        `)
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const access: ProductAccess = {
        has_activation_individual: profile?.has_activation_individual ?? false,
        has_nello_couple: profile?.has_nello_couple ?? false,
        has_activation_couple: profile?.has_activation_couple ?? false,
        has_identity_couple_premium: profile?.has_identity_couple_premium ?? false,
        ativacao_codigo_unlocked: profile?.ativacao_codigo_unlocked ?? false,
      };
      
      setProductAccess(access);
      setOriginalProductAccess(access);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminToggle = async () => {
    if (!user) return;
    
    if (isAdmin) {
      setConfirmAdminAction("remove");
    } else {
      setConfirmAdminAction("add");
    }
  };

  const confirmAdminChange = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      if (confirmAdminAction === "add") {
        // Add admin role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: "admin" });
        
        if (error) {
          if (error.code === "23505") {
            toast.info("Usuário já é administrador");
          } else {
            throw error;
          }
        } else {
          toast.success("Usuário promovido a administrador");
          setIsAdmin(true);
        }
      } else {
        // Remove admin role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", user.id)
          .eq("role", "admin");
        
        if (error) throw error;
        
        toast.success("Permissão de administrador removida");
        setIsAdmin(false);
      }
      
      // Log audit
      await supabase.rpc("log_audit", {
        p_action: confirmAdminAction === "add" ? "promote_to_admin" : "remove_admin",
        p_table_name: "user_roles",
        p_record_id: user.id,
        p_new_data: { action: confirmAdminAction, user_id: user.id },
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error changing admin status:", error);
      toast.error("Erro ao alterar permissão de administrador");
    } finally {
      setSaving(false);
      setConfirmAdminAction(null);
    }
  };

  const handleJornadaCompletaToggle = async (value: boolean) => {
    if (!user) return;
    setSavingJornada(true);
    try {
      if (value) {
        const { data: tests } = await supabase
          .from("tests")
          .select("id, type")
          .eq("active", true);

        if (!tests || tests.length === 0) throw new Error("Nenhum teste ativo encontrado");

        const inserts = tests.map((t) => ({
          user_id: user.id,
          test_id: t.id,
          price_paid: 0,
          payment_status: "completed" as const,
          payment_method: "manual",
          purchase_category: "jornada_completa",
          test_slug: t.type,
          metadata: { granted_manually: true, granted_by: "admin" },
        }));

        const { error } = await supabase.from("test_purchases").insert(inserts);
        if (error && error.code !== "23505") throw error;

        toast.success("Jornada Completa liberada com sucesso");
        setHasJornadaCompleta(true);
      } else {
        const { error } = await supabase
          .from("test_purchases")
          .delete()
          .eq("user_id", user.id)
          .eq("purchase_category", "jornada_completa");

        if (error) throw error;
        toast.success("Acesso à Jornada Completa removido");
        setHasJornadaCompleta(false);
      }
      onUpdate();
    } catch (error) {
      console.error("Error toggling jornada completa:", error);
      toast.error("Erro ao alterar acesso à Jornada Completa");
    } finally {
      setSavingJornada(false);
    }
  };

  const handleProductAccessChange = (key: keyof ProductAccess, value: boolean) => {
    setProductAccess((prev) => {
      const updated = { ...prev, [key]: value };
      
      // If enabling Identity Premium, also enable Nello Couple and Activation Couple
      if (key === "has_identity_couple_premium" && value) {
        updated.has_nello_couple = true;
        updated.has_activation_couple = true;
      }
      
      return updated;
    });
  };

  const saveProductAccess = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          has_activation_individual: productAccess.has_activation_individual,
          has_nello_couple: productAccess.has_nello_couple,
          has_activation_couple: productAccess.has_activation_couple,
          has_identity_couple_premium: productAccess.has_identity_couple_premium,
          ativacao_codigo_unlocked: productAccess.ativacao_codigo_unlocked,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Log audit
      await supabase.rpc("log_audit", {
        p_action: "update_product_access",
        p_table_name: "profiles",
        p_record_id: user.id,
        p_old_data: JSON.parse(JSON.stringify(originalProductAccess)),
        p_new_data: JSON.parse(JSON.stringify(productAccess)),
      });

      toast.success("Acessos atualizados com sucesso");
      setOriginalProductAccess(productAccess);
      onUpdate();
    } catch (error) {
      console.error("Error updating product access:", error);
      toast.error("Erro ao atualizar acessos");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = originalProductAccess && 
    JSON.stringify(productAccess) !== JSON.stringify(originalProductAccess);

  if (!user) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Gerenciar Usuário
              {isAdmin && (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {user.full_name}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Admin Role Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Permissões de Administrador
                </h4>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Acesso Admin</Label>
                    <p className="text-xs text-muted-foreground">
                      Permite acesso ao painel administrativo
                    </p>
                  </div>
                  <Switch
                    checked={isAdmin}
                    onCheckedChange={handleAdminToggle}
                    disabled={saving}
                  />
                </div>
              </div>

              <Separator />

              {/* Jornada Completa Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Jornada Completa
                </h4>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    hasJornadaCompleta ? "bg-primary/5 border-primary/20" : "bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Map className="w-4 h-4 text-primary mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Acesso à Jornada Completa</Label>
                        {hasJornadaCompleta && (
                          <Badge variant="outline" className="text-xs text-primary border-primary/30">
                            Liberado
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Libera todos os 7 testes da jornada
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={hasJornadaCompleta}
                    onCheckedChange={handleJornadaCompletaToggle}
                    disabled={savingJornada}
                  />
                </div>
              </div>

              <Separator />

              {/* Product Access Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Acessos a Produtos (Identity)
                </h4>
                <div className="space-y-2">
                  {(Object.keys(PRODUCT_LABELS) as Array<keyof ProductAccess>).map((key) => {
                    const product = PRODUCT_LABELS[key];
                    const isIncludedInPremium = 
                      (key === "has_nello_couple" || key === "has_activation_couple") &&
                      productAccess.has_identity_couple_premium;
                    
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          productAccess[key] ? "bg-primary/5 border-primary/20" : "bg-card"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {product.icon}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium">{product.label}</Label>
                              {isIncludedInPremium && (
                                <Badge variant="outline" className="text-xs">
                                  Incluso no Premium
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {product.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={productAccess[key]}
                          onCheckedChange={(checked) => handleProductAccessChange(key, checked)}
                          disabled={saving || isIncludedInPremium}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={saveProductAccess}
              disabled={saving || !hasChanges}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Admin Change Dialog */}
      <AlertDialog open={!!confirmAdminAction} onOpenChange={() => setConfirmAdminAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAdminAction === "add"
                ? "Promover a Administrador?"
                : "Remover Administrador?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAdminAction === "add"
                ? `${user.full_name} terá acesso completo ao painel administrativo, incluindo gerenciamento de usuários, pagamentos e configurações.`
                : `${user.full_name} perderá acesso ao painel administrativo.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAdminChange}
              disabled={saving}
              className={confirmAdminAction === "remove" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {confirmAdminAction === "add" ? "Promover" : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
