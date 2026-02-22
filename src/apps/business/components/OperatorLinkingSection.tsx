/**
 * Operator Linking Section - allows company admins to link/unlink Praxis operators.
 * Uses the manage-company-operators edge function for secure lookups.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, Users, Unlink, Loader2, Search, Shield, Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LinkedOperator {
  id: string;
  operator_workspace_id: string;
  role_in_company: string;
  status: string;
  started_at: string;
  display_name: string;
  email: string | null;
}

export function OperatorLinkingSection() {
  const { company, isCompanyAdmin } = useBusinessAuth();
  const [operators, setOperators] = useState<LinkedOperator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [unlinkTarget, setUnlinkTarget] = useState<LinkedOperator | null>(null);

  const fetchOperators = useCallback(async () => {
    if (!company?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-company-operators', {
        body: { action: 'list_operators', company_id: company.id },
      });
      if (error) throw error;
      setOperators(data?.operators || []);
    } catch (err) {
      console.error('Error fetching operators:', err);
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

  useEffect(() => { fetchOperators(); }, [fetchOperators]);

  const handleUnlink = async () => {
    if (!unlinkTarget || !company?.id) return;
    try {
      const { data, error } = await supabase.functions.invoke('manage-company-operators', {
        body: {
          action: 'unlink_operator',
          company_id: company.id,
          operator_workspace_id: unlinkTarget.operator_workspace_id,
        },
      });
      if (error) throw error;
      toast.success('Operador desvinculado');
      setUnlinkTarget(null);
      fetchOperators();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao desvincular');
    }
  };

  if (!isCompanyAdmin) return null;

  const activeOperators = operators.filter(o => o.status === 'active');

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Operadores Praxis
            </CardTitle>
            <CardDescription>
              Profissionais (coaches, mentores) vinculados à sua empresa
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowLinkDialog(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Vincular operador
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : activeOperators.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">Nenhum operador vinculado</p>
              <p className="text-sm text-muted-foreground">
                Vincule um profissional Praxis para conduzir programas na sua empresa.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOperators.map(op => (
                <div key={op.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{op.display_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {op.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {op.email}
                          </span>
                        )}
                        <span>
                          Desde {format(new Date(op.started_at), "dd MMM yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={op.role_in_company === 'lead_operator' ? 'default' : 'outline'}>
                      {op.role_in_company === 'lead_operator' ? 'Líder' : 'Operador'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUnlinkTarget(op)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Unlink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link Operator Dialog */}
      <LinkOperatorDialog
        open={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        companyId={company?.id || ''}
        onSuccess={fetchOperators}
      />

      {/* Unlink Confirmation */}
      <AlertDialog open={!!unlinkTarget} onOpenChange={() => setUnlinkTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desvincular operador?</AlertDialogTitle>
            <AlertDialogDescription>
              {unlinkTarget?.display_name} será desvinculado da empresa. 
              Programas existentes serão mantidos, mas o operador não poderá criar novos.
              Esta ação é registrada em log de auditoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlink} className="bg-destructive text-destructive-foreground">
              Desvincular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function LinkOperatorDialog({ open, onClose, companyId, onSuccess }: {
  open: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('operator');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !companyId) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('manage-company-operators', {
        body: {
          action: 'link_operator',
          company_id: companyId,
          operator_email: email.trim().toLowerCase(),
          role_in_company: role,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Operador ${data?.operator?.display_name || ''} vinculado com sucesso`);
      setEmail('');
      setRole('operator');
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao vincular operador';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular Operador Praxis</DialogTitle>
          <DialogDescription>
            Insira o email de um profissional com conta Praxis ativa para vinculá-lo à sua empresa.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Email do operador *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="operador@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Papel na empresa</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead_operator">Operador Líder</SelectItem>
                <SelectItem value="operator">Operador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-dashed">
            <Shield className="w-4 h-4 inline mr-1" />
            O operador terá acesso apenas aos dados de colaboradores com consentimento ativo.
            Toda ação é registrada em log de auditoria (LGPD).
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!email || isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Vincular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
