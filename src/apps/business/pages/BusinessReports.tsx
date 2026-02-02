import { 
  BarChart3, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BusinessLayout } from '../components/BusinessLayout';
import { isFeatureEnabled } from '../config/featureFlags';

/**
 * BusinessReports - DISABLED
 * 
 * Strategic Decision: Team Insights module is not ready for sale.
 * This page shows "In Development" message only.
 * 
 * The full reports functionality code is preserved but not rendered.
 */
export default function BusinessReports() {
  // Feature flag check - Team Insights is disabled
  const isEnabled = isFeatureEnabled('TEAM_INSIGHTS');

  // Always show "In Development" - feature is disabled
  if (!isEnabled) {
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
          
          <Card className="max-w-lg mx-auto">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Em desenvolvimento</h2>
              
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Os relatórios consolidados de equipe estão em desenvolvimento 
                e serão disponibilizados em breve.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Previsão: em breve</span>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Enquanto isso, utilize o módulo de <strong>Recrutamento</strong> para 
                  avaliar candidatos com DISC e Temperamentos.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/jobs">
                    <Button variant="outline">Ver Vagas</Button>
                  </Link>
                  <Link to="/hiring">
                    <Button>Ver Candidatos</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BusinessLayout>
    );
  }

  // This code is preserved but unreachable while feature is disabled
  return null;
}
