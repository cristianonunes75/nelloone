import { useState, useEffect } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BusinessRole = 'super_admin' | 'company_admin' | 'collaborator';

interface UserCompany {
  id: string;
  company_id: string;
  role: BusinessRole;
  company: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

interface CompanySwitcherProps {
  currentCompanyId: string | null;
  onCompanyChange: (companyId: string) => void;
}

export function CompanySwitcher({ currentCompanyId, onCompanyChange }: CompanySwitcherProps) {
  const { user } = useAuth();
  const [userCompanies, setUserCompanies] = useState<UserCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCompanies = async () => {
      if (!user) {
        setUserCompanies([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('company_users')
          .select(`
            id,
            company_id,
            role,
            company:companies (
              id,
              name,
              logo_url
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching user companies:', error);
          return;
        }

        // Filter out any null companies and type cast properly
        const validCompanies = (data || []).filter(
          (item): item is UserCompany => item.company !== null
        );

        setUserCompanies(validCompanies);
      } catch (error) {
        console.error('Error in fetchUserCompanies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCompanies();
  }, [user]);

  // Don't show switcher if user has only one company
  if (isLoading || userCompanies.length <= 1) {
    return null;
  }

  const currentCompany = userCompanies.find(uc => uc.company_id === currentCompanyId);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'company_admin':
      case 'super_admin':
        return 'Admin';
      case 'collaborator':
        return 'Colaborador';
      default:
        return role;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 max-w-[200px]"
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {currentCompany?.company.name || 'Selecionar empresa'}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px]">
        <DropdownMenuLabel>Suas empresas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userCompanies.map((uc) => (
          <DropdownMenuItem
            key={uc.company_id}
            onClick={() => onCompanyChange(uc.company_id)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              currentCompanyId === uc.company_id && "bg-primary/10"
            )}
          >
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              {uc.company.logo_url ? (
                <img 
                  src={uc.company.logo_url} 
                  alt={uc.company.name}
                  className="w-6 h-6 rounded object-cover"
                />
              ) : (
                <Building2 className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{uc.company.name}</p>
              <p className="text-xs text-muted-foreground">{getRoleBadge(uc.role)}</p>
            </div>
            {currentCompanyId === uc.company_id && (
              <Check className="h-4 w-4 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
