import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, DollarSign, Users, TrendingUp, Wallet, ExternalLink } from "lucide-react";

interface AffiliateData {
  id: string;
  affiliate_code: string;
  commission_percent: number;
  total_earnings: number;
  total_sales: number;
  is_active: boolean;
  payment_method: string | null;
  payment_info: {
    pix_key?: string;
    bank_name?: string;
    bank_account?: string;
    bank_agency?: string;
    paypal_email?: string;
  };
}

export const AffiliatePanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [pixKey, setPixKey] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankAgency, setBankAgency] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchAffiliateData();
    }
  }, [user?.id]);

  const fetchAffiliateData = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAffiliate(data as AffiliateData);
        setPaymentMethod(data.payment_method || "");
        const info = (data.payment_info as AffiliateData["payment_info"]) || {};
        setPixKey(info.pix_key || "");
        setBankName(info.bank_name || "");
        setBankAccount(info.bank_account || "");
        setBankAgency(info.bank_agency || "");
        setPaypalEmail(info.paypal_email || "");
      } else {
        // Create affiliate record if user is a founder with completed journey
        await createAffiliateRecord();
      }
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAffiliateRecord = async () => {
    if (!user?.id) return;

    try {
      const code = `NELLO${user.id.substring(0, 6).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from("affiliates")
        .insert({
          user_id: user.id,
          affiliate_code: code,
          commission_percent: 10,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setAffiliate(data as AffiliateData);
    } catch (error) {
      console.error("Error creating affiliate:", error);
    }
  };

  const savePaymentInfo = async () => {
    if (!affiliate?.id) return;

    setSaving(true);
    try {
      const paymentInfo: AffiliateData["payment_info"] = {};
      
      if (paymentMethod === "pix") {
        paymentInfo.pix_key = pixKey;
      } else if (paymentMethod === "bank_transfer") {
        paymentInfo.bank_name = bankName;
        paymentInfo.bank_account = bankAccount;
        paymentInfo.bank_agency = bankAgency;
      } else if (paymentMethod === "paypal") {
        paymentInfo.paypal_email = paypalEmail;
      }

      const { error } = await supabase
        .from("affiliates")
        .update({
          payment_method: paymentMethod,
          payment_info: paymentInfo,
        })
        .eq("id", affiliate.id);

      if (error) throw error;

      toast({
        title: "Dados salvos!",
        description: "Suas informações de pagamento foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência.",
    });
  };

  const affiliateLink = affiliate?.affiliate_code 
    ? `${window.location.origin}/?ref=${affiliate.affiliate_code}`
    : "";

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!affiliate) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Programa de Afiliados</CardTitle>
            <CardDescription className="text-xs">
              Ganhe {affiliate.commission_percent}% em cada venda indicada
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold">{affiliate.total_sales}</p>
            <p className="text-xs text-muted-foreground">Vendas</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <DollarSign className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold">
              R$ {affiliate.total_earnings.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Ganhos</p>
          </div>
        </div>

        {/* Affiliate Link */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Seu link de divulgação</Label>
          <div className="flex gap-2">
            <Input 
              value={affiliateLink} 
              readOnly 
              className="bg-background/50 text-xs"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(affiliateLink)}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Código: <span className="font-mono font-bold">{affiliate.affiliate_code}</span>
          </p>
        </div>

        {/* Payment Info */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Dados para recebimento</Label>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs">Método de pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "pix" && (
              <div>
                <Label className="text-xs">Chave PIX</Label>
                <Input
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  className="bg-background/50"
                />
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <>
                <div>
                  <Label className="text-xs">Banco</Label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Nome do banco"
                    className="bg-background/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Agência</Label>
                    <Input
                      value={bankAgency}
                      onChange={(e) => setBankAgency(e.target.value)}
                      placeholder="0000"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Conta</Label>
                    <Input
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="00000-0"
                      className="bg-background/50"
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === "paypal" && (
              <div>
                <Label className="text-xs">E-mail PayPal</Label>
                <Input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-background/50"
                />
              </div>
            )}

            {paymentMethod && (
              <Button 
                onClick={savePaymentInfo} 
                disabled={saving}
                className="w-full"
                size="sm"
              >
                {saving ? "Salvando..." : "Salvar dados de pagamento"}
              </Button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-accent/30 rounded-lg p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">💡 Como funciona:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Seu link leva para a página principal do NELLO ONE</li>
            <li>Você ganha {affiliate.commission_percent}% sobre qualquer compra feita por quem acessar via seu link</li>
            <li>Compartilhe nas redes sociais, grupos e comunidades</li>
            <li>Envie para amigos que buscam autoconhecimento</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
