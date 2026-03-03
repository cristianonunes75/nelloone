import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  link?: string;
  check: boolean;
}

interface JourneyChecklistProps {
  hasJobs: boolean;
  hasTeamMembers: boolean;
  hasAssessments: boolean;
  hasEssenceCodes: boolean;
  hasIdealProfiles: boolean;
  hasENPSCycle: boolean;
  hasClimateCycle: boolean;
}

export function JourneyChecklist({
  hasJobs,
  hasTeamMembers,
  hasAssessments,
  hasEssenceCodes,
  hasIdealProfiles,
  hasENPSCycle,
  hasClimateCycle,
}: JourneyChecklistProps) {
  const [expanded, setExpanded] = useState(true);

  const steps: JourneyStep[] = [
    { id: 'jobs', title: 'Criar cargos e definir Perfil Ideal', description: 'Configure as posições e o perfil comportamental ideal para cada função.', link: '/jobs', check: hasJobs && hasIdealProfiles },
    { id: 'team', title: 'Convidar equipe', description: 'Adicione os colaboradores à plataforma.', link: '/team?tab=invite', check: hasTeamMembers },
    { id: 'assessments', title: 'Realizar avaliações', description: 'Garanta que os colaboradores completem os mapas comportamentais.', link: '/team', check: hasAssessments },
    { id: 'essence', title: 'Gerar Códigos da Essência', description: 'Colaboradores concluem a jornada Identity completa.', check: hasEssenceCodes },
    { id: 'match', title: 'Analisar Match Perfil x Cargo', description: 'Visualize aderência de cada colaborador à função.', link: '/team', check: hasIdealProfiles && hasAssessments },
    { id: 'enps', title: 'Rodar eNPS e Clima', description: 'Crie ciclos de pesquisa para medir engajamento e saúde interna.', link: '/people-strategy', check: hasENPSCycle && hasClimateCycle },
    { id: 'dashboard', title: 'Acessar Painel Executivo', description: 'Visualize o índice de saúde organizacional e insights da IA.', link: '/people-strategy', check: hasENPSCycle || hasClimateCycle },
  ];

  const completedCount = steps.filter(s => s.check).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  // Don't show if everything is done
  if (completedCount === steps.length) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Comece por aqui</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{completedCount}/{steps.length}</span>
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
        <Progress value={progressPct} className="h-1.5 mt-2" />
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-3 py-2">
                {step.check ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.check ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {i + 1}. {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
                {!step.check && step.link && (
                  <Link to={step.link}>
                    <Button size="sm" variant="ghost" className="text-xs shrink-0">Ir</Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
