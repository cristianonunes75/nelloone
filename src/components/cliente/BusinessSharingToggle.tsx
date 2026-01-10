import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Building2, Shield, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompanyUserData {
  id: string;
  company_id: string;
  share_report_with_company: boolean;
  company: {
    name: string;
  };
}

/**
 * Toggle for collaborators to control if their aggregated data
 * can be included in company team insights.
 * 
 * LGPD Compliant: Only anonymous, aggregated data is shared.
 * Individual reports are NEVER visible to the company.
 */
export function BusinessSharingToggle() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  
  const [companyUser, setCompanyUser] = useState<CompanyUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCompanyUser();
    }
  }, [user]);

  const fetchCompanyUser = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          id,
          company_id,
          share_report_with_company,
          company:companies(name)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .eq('role', 'collaborator')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setCompanyUser({
          id: data.id,
          company_id: data.company_id,
          share_report_with_company: data.share_report_with_company ?? false,
          company: { name: (data.company as any)?.name || 'Empresa' }
        });
      }
    } catch (error) {
      console.error('Error fetching company user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    if (!companyUser) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('company_users')
        .update({ 
          share_report_with_company: checked,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyUser.id);

      if (error) throw error;

      setCompanyUser(prev => prev ? { ...prev, share_report_with_company: checked } : null);
      
      toast({
        title: checked 
          ? (isEn ? 'Sharing enabled' : 'Compartilhamento ativado')
          : (isEn ? 'Sharing disabled' : 'Compartilhamento desativado'),
        description: checked
          ? (isEn 
              ? 'Your anonymous data will be included in team insights.' 
              : 'Seus dados anônimos serão incluídos nos insights da equipe.')
          : (isEn 
              ? 'Your data will not be included in team reports.' 
              : 'Seus dados não serão incluídos nos relatórios da equipe.'),
      });
    } catch (error: any) {
      toast({
        title: isEn ? 'Error saving' : 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Don't render if user is not a company collaborator
  if (isLoading || !companyUser) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">
            {isEn ? 'Team Insights' : 'Insights da Equipe'}
          </CardTitle>
        </div>
        <CardDescription>
          {isEn 
            ? `You are part of ${companyUser.company.name}`
            : `Você faz parte de ${companyUser.company.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Label htmlFor="share-toggle" className="font-medium cursor-pointer">
              {isEn 
                ? 'Include my data in team statistics' 
                : 'Incluir meus dados nas estatísticas da equipe'}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {isEn 
                ? 'Help your company understand the team better'
                : 'Ajude sua empresa a entender melhor a equipe'}
            </p>
          </div>
          <Switch
            id="share-toggle"
            checked={companyUser.share_report_with_company}
            onCheckedChange={handleToggle}
            disabled={isSaving}
          />
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-2 p-3 bg-background rounded-lg border">
          <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">
              {isEn ? 'Your privacy is protected' : 'Sua privacidade está protegida'}
            </p>
            <ul className="space-y-1">
              <li className="flex items-center gap-1">
                <span>•</span>
                {isEn 
                  ? 'Your individual results are NEVER visible to the company'
                  : 'Seus resultados individuais NUNCA são visíveis para a empresa'}
              </li>
              <li className="flex items-center gap-1">
                <span>•</span>
                {isEn 
                  ? 'Only anonymous, aggregated statistics are shared'
                  : 'Apenas estatísticas anônimas e agregadas são compartilhadas'}
              </li>
              <li className="flex items-center gap-1">
                <span>•</span>
                {isEn 
                  ? 'Minimum 3 participants required for reports'
                  : 'Mínimo de 3 participantes necessários para relatórios'}
              </li>
            </ul>
          </div>
        </div>

        {companyUser.share_report_with_company && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Users className="w-4 h-4" />
            {isEn 
              ? 'Contributing to team insights'
              : 'Contribuindo para os insights da equipe'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
