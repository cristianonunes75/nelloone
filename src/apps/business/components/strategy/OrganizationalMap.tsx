import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Users } from 'lucide-react';

interface OrganizationalMapProps {
  discDistribution: Record<string, number>;
  temperamentDistribution: Record<string, number>;
  totalMembers: number;
  completedAssessments: number;
}

const DISC_COLORS: Record<string, string> = {
  D: 'bg-red-500',
  I: 'bg-amber-500',
  S: 'bg-green-500',
  C: 'bg-blue-500',
};

const DISC_LABELS: Record<string, string> = {
  D: 'Dominância',
  I: 'Influência',
  S: 'Estabilidade',
  C: 'Conformidade',
};

const TEMP_LABELS: Record<string, string> = {
  colerico: 'Colérico',
  sanguineo: 'Sanguíneo',
  melancolico: 'Melancólico',
  fleumatico: 'Fleumático',
};

const TEMP_COLORS: Record<string, string> = {
  colerico: 'bg-red-400',
  sanguineo: 'bg-amber-400',
  melancolico: 'bg-blue-400',
  fleumatico: 'bg-green-400',
};

export function OrganizationalMap({ discDistribution, temperamentDistribution, totalMembers, completedAssessments }: OrganizationalMapProps) {
  const discTotal = Object.values(discDistribution).reduce((a, b) => a + b, 0);
  const tempTotal = Object.values(temperamentDistribution).reduce((a, b) => a + b, 0);

  // Concentration risk
  const maxDiscPct = discTotal > 0 ? Math.max(...Object.values(discDistribution)) / discTotal : 0;
  const dominantDisc = discTotal > 0 
    ? Object.entries(discDistribution).sort((a, b) => b[1] - a[1])[0] 
    : null;

  const concentrationRisk = maxDiscPct > 0.6 ? 'high' : maxDiscPct > 0.4 ? 'medium' : 'low';

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Mapa Organizacional</CardTitle>
        </div>
        <CardDescription>Distribuição comportamental consolidada da equipe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm"><strong>{totalMembers}</strong> membros</span>
          </div>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm"><strong>{completedAssessments}</strong> com perfil mapeado</span>
          <span className="text-sm text-muted-foreground">·</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            concentrationRisk === 'high' ? 'bg-red-500/10 text-red-600' :
            concentrationRisk === 'medium' ? 'bg-amber-500/10 text-amber-600' :
            'bg-green-500/10 text-green-600'
          }`}>
            {concentrationRisk === 'high' ? 'Concentração Alta' : concentrationRisk === 'medium' ? 'Concentração Média' : 'Diversidade Saudável'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DISC Distribution */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Perfil DISC</h4>
            {discTotal > 0 ? (
              <>
                {/* Visual bar */}
                <div className="h-4 rounded-full overflow-hidden flex mb-3">
                  {Object.entries(discDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([profile, count]) => {
                      const pct = (count / discTotal) * 100;
                      return (
                        <div
                          key={profile}
                          className={`${DISC_COLORS[profile] || 'bg-muted'} transition-all`}
                          style={{ width: `${pct}%` }}
                          title={`${DISC_LABELS[profile] || profile}: ${Math.round(pct)}%`}
                        />
                      );
                    })}
                </div>
                {/* Labels */}
                <div className="space-y-1.5">
                  {Object.entries(discDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([profile, count]) => {
                      const pct = Math.round((count / discTotal) * 100);
                      return (
                        <div key={profile} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${DISC_COLORS[profile] || 'bg-muted'}`} />
                            <span>{DISC_LABELS[profile] || profile}</span>
                          </div>
                          <span className="text-muted-foreground font-mono">{pct}%</span>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados DISC disponíveis</p>
            )}
          </div>

          {/* Temperament Distribution */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Temperamentos</h4>
            {tempTotal > 0 ? (
              <>
                <div className="h-4 rounded-full overflow-hidden flex mb-3">
                  {Object.entries(temperamentDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([temp, count]) => {
                      const pct = (count / tempTotal) * 100;
                      return (
                        <div
                          key={temp}
                          className={`${TEMP_COLORS[temp] || 'bg-muted'} transition-all`}
                          style={{ width: `${pct}%` }}
                          title={`${TEMP_LABELS[temp] || temp}: ${Math.round(pct)}%`}
                        />
                      );
                    })}
                </div>
                <div className="space-y-1.5">
                  {Object.entries(temperamentDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([temp, count]) => {
                      const pct = Math.round((count / tempTotal) * 100);
                      return (
                        <div key={temp} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${TEMP_COLORS[temp] || 'bg-muted'}`} />
                            <span>{TEMP_LABELS[temp] || temp}</span>
                          </div>
                          <span className="text-muted-foreground font-mono">{pct}%</span>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados de temperamento disponíveis</p>
            )}
          </div>
        </div>

        {/* Risk Heatmap */}
        {dominantDisc && maxDiscPct > 0.4 && (
          <div className={`p-3 rounded-lg border ${
            maxDiscPct > 0.6 ? 'bg-red-500/5 border-red-200' : 'bg-amber-500/5 border-amber-200'
          }`}>
            <p className={`text-sm ${maxDiscPct > 0.6 ? 'text-red-700' : 'text-amber-700'}`}>
              <strong>Alerta de concentração:</strong> {DISC_LABELS[dominantDisc[0]] || dominantDisc[0]} representa{' '}
              {Math.round(maxDiscPct * 100)}% dos perfis. 
              {maxDiscPct > 0.6 
                ? ' Considere diversificar nas próximas contratações.'
                : ' Monitore para evitar vieses de grupo.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
