import { useState, useEffect } from 'react';
import { UserPlus, Send, Loader2, X, CheckCircle, Crown, Users, Sparkles, AlertCircle, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { useBusinessEnforcement } from '../hooks/useBusinessEnforcement';
import { useExistingUserCheck } from '../hooks/useExistingUserCheck';
import { SubscriptionStatusBanner } from '../components/SubscriptionStatusBanner';
import { CollaboratorLimitWarning } from '../components/CollaboratorLimitWarning';
import { BlockedAccessOverlay } from '../components/BlockedAccessOverlay';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

type InviteRole = 'collaborator' | 'company_admin';

interface EmailWithInfo {
  email: string;
  requestImport: boolean;
}

export default function BusinessInvite() {
  const { company } = useBusinessAuth();
  const { user } = useAuth();
  const enforcement = useBusinessEnforcement();
  const { checkEmail, getResultForEmail, isChecking } = useExistingUserCheck(company?.id);
  
  const [emails, setEmails] = useState<EmailWithInfo[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentEmails, setSentEmails] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<InviteRole>('collaborator');
  const [emailPreview, setEmailPreview] = useState<{
    email: string;
    exists: boolean;
    firstName: string | null;
    testsCount: number;
    hasEssenceCode: boolean;
    alreadyInCompany: boolean;
    alreadyInvited: boolean;
  } | null>(null);
  const [isCheckingPreview, setIsCheckingPreview] = useState(false);

  // Debounce email check
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!currentEmail.trim() || !emailRegex.test(currentEmail.trim())) {
      setEmailPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingPreview(true);
      const result = await checkEmail(currentEmail.trim());
      
      if (result) {
        setEmailPreview({
          email: currentEmail.trim().toLowerCase(),
          exists: result.exists,
          firstName: result.first_name,
          testsCount: result.completed_tests_count,
          hasEssenceCode: result.has_essence_code,
          alreadyInCompany: result.already_in_company,
          alreadyInvited: result.already_invited,
        });
      } else {
        setEmailPreview(null);
      }
      setIsCheckingPreview(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentEmail, checkEmail]);

  const addEmail = () => {
    const email = currentEmail.trim().toLowerCase();
    if (!email) return;
    
    // Only check collaborator limits for collaborator invites
    if (selectedRole === 'collaborator') {
      if (!enforcement.canInviteCollaborators) {
        toast.error(`Limite de ${enforcement.maxCollaborators} colaboradores atingido`);
        return;
      }
      
      // Check remaining slots vs emails to be invited
      if (emails.length >= enforcement.remainingSlots) {
        toast.error(`Você só pode convidar mais ${enforcement.remainingSlots} colaborador(es)`);
        return;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email inválido');
      return;
    }
    
    if (emails.some(e => e.email === email)) {
      toast.error('Email já adicionado');
      return;
    }

    // Check if already in company
    if (emailPreview?.alreadyInCompany) {
      toast.error('Este usuário já faz parte da empresa');
      return;
    }

    // Check if already invited
    if (emailPreview?.alreadyInvited) {
      toast.error('Já existe um convite pendente para este email');
      return;
    }
    
    // Add email with import preference based on preview
    const shouldRequestImport = emailPreview?.exists && emailPreview.testsCount > 0;
    
    setEmails([...emails, { 
      email, 
      requestImport: shouldRequestImport || false 
    }]);
    setCurrentEmail('');
    setEmailPreview(null);
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e.email !== emailToRemove));
  };

  const toggleImportRequest = (email: string) => {
    setEmails(emails.map(e => 
      e.email === email ? { ...e, requestImport: !e.requestImport } : e
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSendInvites = async () => {
    if (!company || !user || emails.length === 0) return;
    
    // Final enforcement check - only for collaborators, admins don't count towards limit
    if (selectedRole === 'collaborator' && !enforcement.canInviteCollaborators) {
      toast.error('Não é possível enviar convites no momento');
      return;
    }
    
    if (selectedRole === 'collaborator' && emails.length > enforcement.remainingSlots) {
      toast.error(`Você só pode convidar mais ${enforcement.remainingSlots} colaborador(es)`);
      return;
    }
    
    setIsSending(true);
    const successfulEmails: string[] = [];
    const failedEmails: EmailWithInfo[] = [];
    
    try {
      for (const emailInfo of emails) {
        // Call edge function to create invite and send email
        const { data, error } = await supabase.functions.invoke('business-invite', {
          body: {
            email: emailInfo.email,
            role: selectedRole,
            company_id: company.id,
            import_requested: emailInfo.requestImport,
          },
        });
        
        if (error || data?.error) {
          console.error(`Error inviting ${emailInfo.email}:`, error || data?.error);
          failedEmails.push(emailInfo);
          toast.error(`Erro ao convidar ${emailInfo.email}: ${data?.error || error?.message}`);
        } else {
          successfulEmails.push(emailInfo.email);
        }
      }
      
      if (successfulEmails.length > 0) {
        setSentEmails([...sentEmails, ...successfulEmails]);
        setEmails([]);
        toast.success(`${successfulEmails.length} convite(s) enviado(s) com sucesso!`);
      }
      
      // Keep failed emails in the list so user can retry
      if (failedEmails.length > 0) {
        setEmails(failedEmails);
      }
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Erro ao enviar convites');
    } finally {
      setIsSending(false);
    }
  };

  const existingUsersCount = emails.filter(e => {
    const result = getResultForEmail(e.email);
    return result?.info?.exists;
  }).length;

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

        {/* Limit Warning - only for collaborators */}
        {selectedRole === 'collaborator' && (
          <CollaboratorLimitWarning action="invite" />
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Novos convites
            </CardTitle>
            <CardDescription>
              Convide colaboradores ou sócios/administradores para sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Tipo de acesso</Label>
              <RadioGroup
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as InviteRole)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div className={`relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedRole === 'collaborator' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="collaborator" id="collaborator" className="mt-0.5" />
                  <label htmlFor="collaborator" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Colaborador</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Faz os testes e vê apenas seus próprios resultados
                    </p>
                  </label>
                </div>
                
                <div className={`relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedRole === 'company_admin' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="company_admin" id="company_admin" className="mt-0.5" />
                  <label htmlFor="company_admin" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Sócio / Admin</span>
                      <Badge variant="outline" className="text-xs">Acesso total</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Gerencia equipe, vê relatórios e convida membros
                    </p>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {selectedRole === 'collaborator' && enforcement.remainingSlots > 0 && (
              <p className="text-sm text-muted-foreground">
                {enforcement.remainingSlots} vagas de colaborador disponíveis
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedRole === 'company_admin' ? (
                <>
                  <Crown className="w-5 h-5 text-amber-500" />
                  Convidar Sócio/Admin
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Convidar Colaboradores
                </>
              )}
            </CardTitle>
            <CardDescription>
              {selectedRole === 'company_admin' 
                ? 'Adicione sócios ou administradores com acesso total à gestão'
                : 'Adicione colaboradores para a jornada de autoconhecimento'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {selectedRole === 'company_admin' ? 'Email do sócio/admin' : 'Email do colaborador'}
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder={selectedRole === 'company_admin' ? 'socio@empresa.com' : 'colaborador@empresa.com'}
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={selectedRole === 'collaborator' && !enforcement.canInviteCollaborators}
                    className={emailPreview?.exists ? 'pr-10 border-emerald-500' : ''}
                  />
                  {isCheckingPreview && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {emailPreview?.exists && !isCheckingPreview && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addEmail}
                  disabled={(selectedRole === 'collaborator' && !enforcement.canInviteCollaborators) || emailPreview?.alreadyInCompany || emailPreview?.alreadyInvited}
                >
                  Adicionar
                </Button>
              </div>
              
              {/* Email Preview Card */}
              {emailPreview && (
                <div className={`mt-2 p-3 rounded-lg border ${
                  emailPreview.alreadyInCompany || emailPreview.alreadyInvited 
                    ? 'bg-destructive/10 border-destructive/30' 
                    : emailPreview.exists 
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-muted/50'
                }`}>
                  {emailPreview.alreadyInCompany ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Este usuário já faz parte da empresa</span>
                    </div>
                  ) : emailPreview.alreadyInvited ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Já existe um convite pendente para este email</span>
                    </div>
                  ) : emailPreview.exists ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          {emailPreview.firstName ? `${emailPreview.firstName} já` : 'Usuário já'} usa o Nello One!
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                          {emailPreview.testsCount} teste{emailPreview.testsCount !== 1 ? 's' : ''} completo{emailPreview.testsCount !== 1 ? 's' : ''}
                        </Badge>
                        {emailPreview.hasEssenceCode && (
                          <Badge variant="secondary" className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                            ✨ Código da Essência
                          </Badge>
                        )}
                      </div>
                      {emailPreview.testsCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ao aceitar o convite, {emailPreview.firstName || 'o colaborador'} pode optar por compartilhar seus resultados existentes com a empresa.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm">Novo usuário - será criada uma conta</span>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Pressione Enter ou vírgula para adicionar múltiplos emails
              </p>
            </div>

            {emails.length > 0 && (
              <div className="space-y-2">
                <Label>Emails para convidar ({emails.length})</Label>
                <div className="space-y-2 p-3 bg-muted rounded-lg">
                  {emails.map(({ email, requestImport }) => {
                    const result = getResultForEmail(email);
                    const isExisting = result?.info?.exists;
                    const testsCount = result?.info?.completed_tests_count || 0;
                    
                    return (
                      <div key={email} className="flex items-center justify-between gap-2 p-2 bg-background rounded border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isExisting ? (
                            <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <UserPlus className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          <span className="text-sm truncate">{email}</span>
                          {isExisting && testsCount > 0 && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              {testsCount} teste{testsCount !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isExisting && testsCount > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Checkbox 
                                id={`import-${email}`}
                                checked={requestImport}
                                onCheckedChange={() => toggleImportRequest(email)}
                                className="h-4 w-4"
                              />
                              <label htmlFor={`import-${email}`} className="text-xs text-muted-foreground cursor-pointer">
                                Solicitar dados
                              </label>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="hover:bg-muted-foreground/20 rounded p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {existingUsersCount > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    ✓ {existingUsersCount} usuário{existingUsersCount !== 1 ? 's' : ''} já possui{existingUsersCount === 1 ? '' : 'em'} conta no Nello One
                  </p>
                )}
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
                disabled={selectedRole === 'collaborator' && !enforcement.canInviteCollaborators}
              />
            </div>

            <Button
              onClick={handleSendInvites}
              disabled={emails.length === 0 || isSending || (selectedRole === 'collaborator' && !enforcement.canInviteCollaborators)}
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
              <li>Ele cria sua conta (ou acessa com conta existente) e lê os termos de consentimento</li>
              <li>Se já tiver resultados no Nello One, pode optar por compartilhá-los com a empresa</li>
              <li>Após aceitar, tem acesso à sua jornada de autoconhecimento</li>
              <li>Você pode acompanhar o progresso no dashboard</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
}
