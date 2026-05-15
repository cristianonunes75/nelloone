import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getLeadershipRank } from '../lib/gentleVocabulary';

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
  job_title: string | null;
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

interface UserCompanyRecord {
  id: string;
  company_id: string;
  role: BusinessRole;
  is_active: boolean;
  consent_given: boolean;
  consent_given_at: string | null;
  onboarding_completed: boolean;
  share_report_with_company: boolean;
  joined_at: string | null;
  user_id: string;
}

interface BusinessAuthContextType {
  companyUser: CompanyUser | null;
  company: Company | null;
  businessRole: BusinessRole | null;
  isCompanyAdmin: boolean;
  isCollaborator: boolean;
  isSuperAdmin: boolean;
  isNelloOneSuperAdmin: boolean;
  isLeadershipCollaborator: boolean;
  isLoading: boolean;
  hasCompany: boolean;
  needsOnboarding: boolean;
  needsConsent: boolean;
  // Multi-company support
  userCompanies: UserCompanyRecord[];
  hasMultipleCompanies: boolean;
  switchCompany: (companyId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

const SELECTED_COMPANY_KEY = 'nello_selected_company';

interface BusinessAuthProviderProps {
  children: ReactNode;
}

export function BusinessAuthProvider({ children }: BusinessAuthProviderProps) {
  const { user, userRoles, isLoading: authLoading } = useAuth();
  const [companyUser, setCompanyUser] = useState<CompanyUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [userCompanies, setUserCompanies] = useState<UserCompanyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isNelloOneSuperAdmin = userRoles.includes('admin');

  const fetchBusinessData = async (selectedCompanyId?: string) => {
    if (!user) {
      setCompanyUser(null);
      setCompany(null);
      setUserCompanies([]);
      setIsLoading(false);
      return;
    }

    try {
      // First get ALL company_user records for this user
      const { data: allCompanyUsers, error: cuError } = await supabase
        .from('company_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (cuError) {
        console.error('Error fetching company users:', cuError);
        setIsLoading(false);
        return;
      }

      if (!allCompanyUsers || allCompanyUsers.length === 0) {
        setCompanyUser(null);
        setCompany(null);
        setUserCompanies([]);
        setIsLoading(false);
        return;
      }

      setUserCompanies(allCompanyUsers as UserCompanyRecord[]);

      // Determine which company to use
      let targetCompanyId = selectedCompanyId;
      
      if (!targetCompanyId) {
        // Check localStorage for previously selected company
        const savedCompanyId = localStorage.getItem(SELECTED_COMPANY_KEY);
        if (savedCompanyId && allCompanyUsers.some(cu => cu.company_id === savedCompanyId)) {
          targetCompanyId = savedCompanyId;
        } else {
          // Default to first company
          targetCompanyId = allCompanyUsers[0].company_id;
        }
      }

      // Find the company_user record for the target company
      const targetCompanyUser = allCompanyUsers.find(cu => cu.company_id === targetCompanyId);
      
      if (!targetCompanyUser) {
        setCompanyUser(null);
        setCompany(null);
        setIsLoading(false);
        return;
      }

      setCompanyUser(targetCompanyUser as unknown as CompanyUser);
      localStorage.setItem(SELECTED_COMPANY_KEY, targetCompanyId);

      // Get the company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', targetCompanyId)
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

  const switchCompany = async (companyId: string) => {
    setIsLoading(true);
    await fetchBusinessData(companyId);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchBusinessData();
    }
  }, [user, authLoading]);

  const businessRole = companyUser?.role || null;
  const isCompanyAdmin = businessRole === 'company_admin' || businessRole === 'super_admin' || isNelloOneSuperAdmin;
  const isCollaborator = businessRole === 'collaborator';
  const isSuperAdmin = businessRole === 'super_admin' || isNelloOneSuperAdmin;
  // Supervisora / lider de equipe: collaborator com job_title de lideranca (rank >= 1) ve cruzamento filtrado.
  const isLeadershipCollaborator = isCollaborator && getLeadershipRank(companyUser?.job_title) >= 1;
  const hasCompany = !!company;
  const hasMultipleCompanies = userCompanies.length > 1;
  
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
    isLeadershipCollaborator,
    isLoading: authLoading || isLoading,
    hasCompany,
    needsOnboarding,
    needsConsent,
    userCompanies,
    hasMultipleCompanies,
    switchCompany,
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
