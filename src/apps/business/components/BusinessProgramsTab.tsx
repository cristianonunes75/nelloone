/**
 * Business Programs Tab - for company_admin to see programs running in their company.
 * Shows aggregated data only (no individual identity data).
 */

import { useState } from 'react';
import { 
  Plus, BookOpen, Users, Calendar, MoreVertical, Building2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useCompanyPrograms, useProgramMembers, CompanyProgram } from '../hooks/usePraxisBridge';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function BusinessProgramsTab() {
  const { company } = useBusinessAuth();
  const { programs, operators, isLoading } = useCompanyPrograms(company?.id || null);
  const [selectedProgram, setSelectedProgram] = useState<CompanyProgram | null>(null);

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      draft: 'Rascunho', active: 'Ativo', paused: 'Pausado', completed: 'Concluído',
    };
    return map[status] || status;
  };

  const getStatusVariant = (status: string) => {
    if (status === 'active') return 'default' as const;
    if (status === 'completed') return 'secondary' as const;
    return 'outline' as const;
  };

  if (isLoading) {
    return <div className="space-y-4">{[1, 2].map(i => <Skeleton key={i} className="h-24" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Programas</p>
                <p className="text-2xl font-bold">{programs.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Operadores vinculados</p>
                <p className="text-2xl font-bold">{operators.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs list */}
      <Card>
        <CardHeader>
          <CardTitle>Programas de Desenvolvimento</CardTitle>
          <CardDescription>
            Programas conduzidos por operadores Praxis na sua empresa.
            Apenas dados agregados são exibidos aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Nenhum programa ativo</p>
              <p className="text-sm text-muted-foreground">
                Quando um operador Praxis for vinculado à sua empresa, os programas aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map(prog => (
                <div
                  key={prog.id}
                  className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedProgram(prog)}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{prog.program_name}</p>
                      <Badge variant={getStatusVariant(prog.status)}>
                        {getStatusLabel(prog.status)}
                      </Badge>
                    </div>
                    <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                      {prog.methodology_name && <span>{prog.methodology_name}</span>}
                      {prog.start_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(prog.start_date), "MMM yyyy", { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Program Detail Dialog (aggregated view only) */}
      <ProgramDetailDialog
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
      />
    </div>
  );
}

function ProgramDetailDialog({ program, onClose }: { program: CompanyProgram | null; onClose: () => void }) {
  const { members, isLoading } = useProgramMembers(program?.id || null);

  if (!program) return null;

  const consentedCount = members.filter(m => m.consent_status === 'granted').length;
  const pendingCount = members.filter(m => m.consent_status === 'pending').length;

  return (
    <Dialog open={!!program} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{program.program_name}</DialogTitle>
          <DialogDescription>
            Visão agregada do programa. Dados individuais não são exibidos para a empresa.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {program.description && (
            <p className="text-sm text-muted-foreground">{program.description}</p>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-xl font-bold">{members.length}</p>
              <p className="text-xs text-muted-foreground">Participantes</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-xl font-bold text-green-600">{consentedCount}</p>
              <p className="text-xs text-muted-foreground">Com consentimento</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-xl font-bold text-amber-600">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-dashed">
            <Building2 className="w-4 h-4 inline mr-1" />
            A empresa vê apenas dados agregados. Dados individuais de identidade e sessões
            são visíveis somente pelo operador, com consentimento do participante.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
