import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BusinessLayout } from '../components/BusinessLayout';
import { TeamInsightsTab } from '../components/TeamInsightsTab';

/**
 * BusinessReports - Team Insights page.
 * Access controlled by useBusinessEnforcement.canViewInsights (subscription check).
 */
export default function BusinessReports() {
  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>
        
        <TeamInsightsTab />
      </div>
    </BusinessLayout>
  );
}
