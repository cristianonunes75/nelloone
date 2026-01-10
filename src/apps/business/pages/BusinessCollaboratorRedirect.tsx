import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { Loader2 } from 'lucide-react';

/**
 * Redirect component for Business Collaborators
 * 
 * ARCHITECTURAL DECISION:
 * Collaborators execute their journey in the CORE (/cliente), NOT in Business.
 * This ensures:
 * 1. Single source of truth for test execution (user_tests, mapa_essencia)
 * 2. No duplicate journey logic
 * 3. Consistent experience across B2C and B2B users
 * 
 * The Business module only handles:
 * - Company association (company_users)
 * - Aggregated insights (company_team_insights)
 * - Team management (for company_admin only)
 */
export default function BusinessCollaboratorRedirect() {
  const navigate = useNavigate();
  const { company } = useBusinessAuth();

  useEffect(() => {
    // Redirect to the Core client area
    // The Core will detect company_users association and show contextual company header
    const params = new URLSearchParams();
    if (company?.id) {
      params.set('company', company.id);
    }
    
    const redirectUrl = `/cliente${params.toString() ? `?${params.toString()}` : ''}`;
    
    // Use replace to avoid back button returning to this redirect
    navigate(redirectUrl, { replace: true });
  }, [navigate, company]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecionando para sua jornada...</p>
      </div>
    </div>
  );
}
