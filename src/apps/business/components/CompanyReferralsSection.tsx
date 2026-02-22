/**
 * Company Referrals Section - allows company admins to refer other companies.
 * Part of the Identity Corporate growth system.
 */

import { useState, useEffect, useCallback } from 'react';
import { Share2, Send, Loader2, CheckCircle, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';

interface Referral {
  id: string;
  referred_company_name: string;
  contact_email: string;
  contact_name: string | null;
  status: string;
  created_at: string;
}

export function CompanyReferralsSection() {
  const { company, isCompanyAdmin } = useBusinessAuth();
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    notes: '',
  });

  const fetchReferrals = useCallback(async () => {
    if (!company?.id) return;
    const { data } = await supabase
      .from('company_referrals')
      .select('id, referred_company_name, contact_email, contact_name, status, created_at')
      .eq('referring_company_id', company.id)
      .order('created_at', { ascending: false });
    setReferrals(data || []);
    setIsLoading(false);
  }, [company?.id]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const handleSubmit = async () => {
    if (!company?.id || !user?.id || !form.companyName || !form.contactEmail) return;
    setIsSending(true);

    try {
      // Get operator linked to company if any
      const { data: operatorData } = await supabase
        .from('company_operators')
        .select('operator_workspace_id')
        .eq('company_id', company.id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();

      const { error } = await supabase
        .from('company_referrals')
        .insert({
          referring_company_id: company.id,
          referred_company_name: form.companyName,
          contact_email: form.contactEmail,
          contact_name: form.contactName || null,
          notes: form.notes || null,
          referred_by: user.id,
          operator_id: operatorData?.operator_workspace_id || null,
        });

      if (error) throw error;

      // Notify operator via edge function
      if (operatorData?.operator_workspace_id) {
        await supabase.functions.invoke('notify-operator-referral', {
          body: {
            operator_id: operatorData.operator_workspace_id,
            referring_company_name: company.name,
            referred_company_name: form.companyName,
            contact_email: form.contactEmail,
            contact_name: form.contactName,
          },
        }).catch(err => console.error('Operator notification failed:', err));
      }

      toast.success('Indicação enviada com sucesso!');
      setShowDialog(false);
      setForm({ companyName: '', contactName: '', contactEmail: '', notes: '' });
      fetchReferrals();
    } catch (err) {
      console.error('Error creating referral:', err);
      toast.error('Erro ao enviar indicação');
    } finally {
      setIsSending(false);
    }
  };

  if (!isCompanyAdmin) return null;

  const statusLabel: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    pending: { label: 'Pendente', variant: 'outline' },
    contacted: { label: 'Contatado', variant: 'secondary' },
    converted: { label: 'Convertido', variant: 'default' },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Indicações
            </CardTitle>
            <CardDescription>
              Indique empresas e fortaleça a rede Identity Corporate
            </CardDescription>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Send className="w-4 h-4" />
                Nova indicação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Indicar empresa</DialogTitle>
                <DialogDescription>
                  Indique uma empresa para conhecer o Identity Corporate. O operador responsável
                  será notificado automaticamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome da empresa *</Label>
                  <Input
                    value={form.companyName}
                    onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                    placeholder="Empresa XYZ"
                  />
                </div>
                <div>
                  <Label>Nome do contato</Label>
                  <Input
                    value={form.contactName}
                    onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <Label>E-mail do contato *</Label>
                  <Input
                    type="email"
                    value={form.contactEmail}
                    onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Contexto sobre a indicação..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSending || !form.companyName || !form.contactEmail}
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Enviar indicação
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma indicação enviada ainda.</p>
            <p className="text-xs mt-1">Indique empresas que podem se beneficiar do Identity Corporate.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map(ref => {
              const status = statusLabel[ref.status] || statusLabel.pending;
              return (
                <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="text-sm font-medium">{ref.referred_company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ref.contact_name && `${ref.contact_name} · `}
                      {ref.contact_email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(ref.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
