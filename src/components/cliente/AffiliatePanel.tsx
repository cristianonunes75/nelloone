import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, DollarSign, Users, TrendingUp, Wallet, History, Calendar, Package } from "lucide-react";
import { AffiliateMarketingKit } from "./AffiliateMarketingKit";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface ReferralData {
  id: string;
  created_at: string;
  commission_amount: number;
  sale_amount: number;
  currency: string;
  status: string;
  purchase_id: string | null;
}

export const AffiliatePanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
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
        
        // Fetch referrals for this affiliate
        await fetchReferrals(data.id);
      }
      // If not an affiliate, do nothing - admin must create affiliate records
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrals = async (affiliateId: string) => {
    try {
      const { data, error } = await supabase
        .from("affiliate_referrals")
        .select("*")
        .eq("affiliate_id", affiliateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  // Removed: createAffiliateRecord - affiliates must be created by admin only

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

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      default: return "R$";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">Pago</span>;
      case "pending":
        return <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded-full">Pendente</span>;
      default:
        return <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{status}</span>;
    }
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

        {/* Sales History Toggle */}
        {referrals.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4 mr-2" />
            {showHistory ? "Ocultar histórico" : `Ver histórico (${referrals.length} vendas)`}
          </Button>
        )}

        {/* Sales History */}
        {showHistory && referrals.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <Label className="text-sm font-medium flex items-center gap-2">
              <History className="w-4 h-4" />
              Histórico de Vendas
            </Label>
            <div className="space-y-2">
              {referrals.map((referral) => (
                <div 
                  key={referral.id} 
                  className="bg-background/50 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(referral.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                    {getStatusBadge(referral.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <Package className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Venda:</span>
                      <span className="font-medium">
                        {getCurrencySymbol(referral.currency)} {referral.sale_amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-primary">
                      +{getCurrencySymbol(referral.currency)} {referral.commission_amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for history */}
        {showHistory && referrals.length === 0 && (
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhuma venda registrada ainda
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Compartilhe seu link para começar a ganhar comissões!
            </p>
          </div>
        )}

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

        {/* Marketing Kit */}
        <AffiliateMarketingKit affiliateLink={affiliateLink} />

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