import { useState } from 'react';
import { UserPlus, Send, Loader2, X, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';
import { SubscriptionStatusBanner } from '../components/SubscriptionStatusBanner';
import { CollaboratorLimitWarning } from '../components/CollaboratorLimitWarning';
import { BlockedAccessOverlay } from '../components/BlockedAccessOverlay';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function BusinessInvite() {
  const { company } = useBusinessAuth();
  const { user } = useAuth();
  const enforcement = useBusinessEnforcement();
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentEmails, setSentEmails] = useState<string[]>([]);

  const addEmail = () => {
    const email = currentEmail.trim().toLowerCase();
    if (!email) return;
    
    // Check if can add more collaborators
    if (!enforcement.canInviteCollaborators) {
      toast.error(`Limite de ${enforcement.maxCollaborators} colaboradores atingido`);
      return;
    }
    
    // Check remaining slots vs emails to be invited
    if (emails.length >= enforcement.remainingSlots) {
      toast.error(`Você só pode convidar mais ${enforcement.remainingSlots} colaborador(es)`);
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email inválido');
      return;
    }
    
    if (emails.includes(email)) {
      toast.error('Email já adicionado');
      return;
    }
    
    setEmails([...emails, email]);
    setCurrentEmail('');
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSendInvites = async () => {
    if (!company || !user || emails.length === 0) return;
    
    // Final enforcement check
    if (!enforcement.canInviteCollaborators) {
      toast.error('Não é possível enviar convites no momento');
      return;
    }
    
    if (emails.length > enforcement.remainingSlots) {
      toast.error(`Você só pode convidar mais ${enforcement.remainingSlots} colaborador(es)`);
      return;
    }
    
    setIsSending(true);
    const successfulEmails: string[] = [];
    
    try {
      for (const email of emails) {
        // Generate unique token
        const token = crypto.randomUUID();
        
        // Create invite record
        const { error } = await supabase
          .from('company_invites')
          .insert({
            company_id: company.id,
            email,
            role: 'collaborator',
            invite_token: token,
            invited_by: user.id,
            sent_at: new Date().toISOString(),
          });
        
        if (error) {
          console.error(`Error inviting ${email}:`, error);
          toast.error(`Erro ao convidar ${email}`);
        } else {
          successfulEmails.push(email);
          
          // TODO: Send email via edge function
          // For now, just log the invite link
          console.log(`Invite link for ${email}: ${window.location.origin}/invite/${token}`);
        }
      }
      
      if (successfulEmails.length > 0) {
        setSentEmails([...sentEmails, ...successfulEmails]);
        setEmails([]);
        toast.success(`${successfulEmails.length} convite(s) enviado(s) com sucesso!`);
      }
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Erro ao enviar convites');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <BusinessLayout>
      {/* Blocked overlay when trial expired or suspended */}
      <BlockedAccessOverlay />
      
      <div className="space-y-6 max-w-2xl">
        {/* Subscription Status Banner */}
        <SubscriptionStatusBanner />
        
        <div>
          <h1 className="text-2xl font-bold">Convidar colaboradores</h1>
          <p className="text-muted-foreground">
            Envie convites por email para sua equipe começar a jornada de autoconhecimento
          </p>
        </div>

        {/* Limit Warning */}
        <CollaboratorLimitWarning action="invite" />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Novos convites
            </CardTitle>
            <CardDescription>
              Adicione os emails dos colaboradores que deseja convidar
              {enforcement.remainingSlots > 0 && (
                <span className="ml-1">
                  ({enforcement.remainingSlots} vagas disponíveis)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email do colaborador</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="colaborador@empresa.com"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!enforcement.canInviteCollaborators}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addEmail}
                  disabled={!enforcement.canInviteCollaborators}
                >
                  Adicionar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Pressione Enter ou vírgula para adicionar múltiplos emails
              </p>
            </div>

            {emails.length > 0 && (
              <div className="space-y-2">
                <Label>Emails para convidar ({emails.length})</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                  {emails.map((email) => (
                    <Badge key={email} variant="secondary" className="gap-1 pr-1">
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem personalizada (opcional)</Label>
              <Textarea
                id="message"
                placeholder="Adicione uma mensagem pessoal ao convite..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                disabled={!enforcement.canInviteCollaborators}
              />
            </div>

            <Button
              onClick={handleSendInvites}
              disabled={emails.length === 0 || isSending || !enforcement.canInviteCollaborators}
              className="w-full gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar {emails.length} convite{emails.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {sentEmails.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Convites enviados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sentEmails.map((email) => (
                  <div key={email} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {email}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">O que acontece depois?</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>O colaborador recebe um email com o link de convite</li>
              <li>Ele cria sua conta e lê os termos de consentimento</li>
              <li>Após aceitar, tem acesso à sua jornada de autoconhecimento</li>
              <li>Você pode acompanhar o progresso no dashboard</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
}
