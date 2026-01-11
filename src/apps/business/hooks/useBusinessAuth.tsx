import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type BusinessRole = 'super_admin' | 'company_admin' | 'collaborator';

interface CompanyUser {
  id: string;
  company_id: string;
  user_id: string;
  role: BusinessRole;
  is_active: boolean;
  consent_given: boolean;
  consent_given_at: string | null;
  onboarding_completed: boolean;
  share_report_with_company: boolean;
  joined_at: string | null;
}

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  industry: string | null;
  website: string | null;
  billing_email: string | null;
  employee_count_range: string | null;
  stripe_customer_id: string | null;
  settings: Record<string, unknown>;
}

interface BusinessAuthContextType {
  companyUser: CompanyUser | null;
  company: Company | null;
  businessRole: BusinessRole | null;
  isCompanyAdmin: boolean;
  isCollaborator: boolean;
  isSuperAdmin: boolean;
  isNelloOneSuperAdmin: boolean; // Super admin from Nello One (user_roles)
  isLoading: boolean;
  hasCompany: boolean;
  needsOnboarding: boolean;
  needsConsent: boolean;
  refetch: () => Promise<void>;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

interface BusinessAuthProviderProps {
  children: ReactNode;
}

export function BusinessAuthProvider({ children }: BusinessAuthProviderProps) {
  const { user, userRoles, isLoading: authLoading } = useAuth();
  const [companyUser, setCompanyUser] = useState<CompanyUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is a Nello One super admin (has 'admin' role in user_roles)
  const isNelloOneSuperAdmin = userRoles.includes('admin');

  const fetchBusinessData = async () => {
    if (!user) {
      setCompanyUser(null);
      setCompany(null);
      setIsLoading(false);
      return;
    }

    try {
      // First get the company_user record
      const { data: cuData, error: cuError } = await supabase
        .from('company_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (cuError) {
        console.error('Error fetching company user:', cuError);
        setIsLoading(false);
        return;
      }

      if (!cuData) {
        setCompanyUser(null);
        setCompany(null);
        setIsLoading(false);
        return;
      }

      setCompanyUser(cuData as unknown as CompanyUser);

      // Then get the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', cuData.company_id)
        .single();

      if (companyError) {
        console.error('Error fetching company:', companyError);
      } else {
        setCompany(companyData as unknown as Company);
      }
    } catch (error) {
      console.error('Error in fetchBusinessData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchBusinessData();
    }
  }, [user, authLoading]);

  // Business role from company_users table
  const businessRole = companyUser?.role || null;
  
  // isCompanyAdmin: either from company_users role OR if they're a Nello One super admin
  const isCompanyAdmin = businessRole === 'company_admin' || businessRole === 'super_admin' || isNelloOneSuperAdmin;
  const isCollaborator = businessRole === 'collaborator';
  const isSuperAdmin = businessRole === 'super_admin' || isNelloOneSuperAdmin;
  const hasCompany = !!company;
  
  // Nello One super admins don't need onboarding or consent
  const needsOnboarding = !isNelloOneSuperAdmin && isCompanyAdmin && hasCompany && !companyUser?.onboarding_completed;
  const needsConsent = !isNelloOneSuperAdmin && isCollaborator && !companyUser?.consent_given;

  const value: BusinessAuthContextType = {
    companyUser,
    company,
    businessRole,
    isCompanyAdmin,
    isCollaborator,
    isSuperAdmin,
    isNelloOneSuperAdmin,
    isLoading: authLoading || isLoading,
    hasCompany,
    needsOnboarding,
    needsConsent,
    refetch: fetchBusinessData,
  };

  return (
    <BusinessAuthContext.Provider value={value}>
      {children}
    </BusinessAuthContext.Provider>
  );
}

export function useBusinessAuth() {
  const context = useContext(BusinessAuthContext);
  if (context === undefined) {
    throw new Error('useBusinessAuth must be used within a BusinessAuthProvider');
  }
  return context;
}
