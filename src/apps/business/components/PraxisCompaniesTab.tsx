/**
 * Praxis Companies Tab - operator view of company assignments and programs.
 * Operators can see their company programs and members with granted consent.
 */

import { useState } from 'react';
import { 
  Building2, BookOpen, Users, Calendar, Plus, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useOperatorCompanies, useProgramMembers, CompanyOperator, CompanyProgram } from '../hooks/usePraxisBridge';
import { useOperatorWorkspace } from '../hooks/useOperatorWorkspace';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function PraxisCompaniesTab() {
  const { assignments, programs, isLoading, createProgram } = useOperatorCompanies();
  const { methodologies } = useOperatorWorkspace();
  const [showCreateProgram, setShowCreateProgram] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<CompanyProgram | null>(null);
  const [formData, setFormData] = useState({
    company_id: '',
    program_name: '',
    description: '',
    methodology_name: '',
    start_date: '',
    end_date: '',
  });

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      draft: 'Rascunho', active: 'Ativo', paused: 'Pausado', completed: 'Concluído',
    };
    return map[status] || status;
  };

  const handleCreateProgram = async () => {
    if (!formData.program_name || !formData.company_id) return;
    await createProgram({
      company_id: formData.company_id,
      program_name: formData.program_name,
      description: formData.description || null,
      methodology_name: formData.methodology_name || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      status: 'draft',
    });
    setFormData({ company_id: '', program_name: '', description: '', methodology_name: '', start_date: '', end_date: '' });
    setShowCreateProgram(false);
  };

  if (isLoading) {
    return <div className="space-y-4">{[1, 2].map(i => <Skeleton key={i} className="h-24" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Assignments Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Empresas</p>
                <p className="text-2xl font-bold">{assignments.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Programas</p>
                <p className="text-2xl font-bold">{programs.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Programas Corporativos</CardTitle>
            <CardDescription>Programas que você conduz dentro de empresas</CardDescription>
          </div>
          {assignments.length > 0 && (
            <Button size="sm" onClick={() => setShowCreateProgram(true)} className="bg-gradient-to-r from-amber-500 to-orange-600">
              <Plus className="w-4 h-4 mr-1" />Novo Programa
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Nenhuma empresa vinculada</p>
              <p className="text-sm text-muted-foreground">
                Quando uma empresa vincular você como operador, ela aparecerá aqui.
              </p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Nenhum programa criado</p>
              <p className="text-sm text-muted-foreground mb-4">
                Crie um programa para acompanhar colaboradores de uma empresa
              </p>
              <Button onClick={() => setShowCreateProgram(true)}>
                <Plus className="w-4 h-4 mr-2" />Criar Programa
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map(prog => (
                <div
                  key={prog.id}
                  className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedProgram(prog)}
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{prog.program_name}</p>
                      <Badge variant={prog.status === 'active' ? 'default' : 'outline'}>
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
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Program Dialog */}
      <Dialog open={showCreateProgram} onOpenChange={setShowCreateProgram}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Programa Corporativo</DialogTitle>
            <DialogDescription>Defina um programa de acompanhamento para uma empresa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Empresa *</Label>
              <Select value={formData.company_id} onValueChange={v => setFormData(p => ({ ...p, company_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {assignments.map(a => (
                    <SelectItem key={a.company_id} value={a.company_id}>
                      {a.company_id.slice(0, 8)}... ({a.role_in_company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nome do Programa *</Label>
              <Input
                placeholder="Ex: Programa de Liderança Q1"
                value={formData.program_name}
                onChange={e => setFormData(p => ({ ...p, program_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descreva o programa..."
                value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Metodologia</Label>
              <Select value={formData.methodology_name} onValueChange={v => setFormData(p => ({ ...p, methodology_name: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {methodologies.map(m => (
                    <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                  ))}
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Início</Label>
                <Input type="date" value={formData.start_date} onChange={e => setFormData(p => ({ ...p, start_date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Término</Label>
                <Input type="date" value={formData.end_date} onChange={e => setFormData(p => ({ ...p, end_date: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateProgram(false)}>Cancelar</Button>
            <Button
              onClick={handleCreateProgram}
              disabled={!formData.program_name || !formData.company_id}
              className="bg-gradient-to-r from-amber-500 to-orange-600"
            >
              Criar Programa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Program Members View */}
      <OperatorProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} />
    </div>
  );
}

function OperatorProgramDetail({ program, onClose }: { program: CompanyProgram | null; onClose: () => void }) {
  const { members, isLoading } = useProgramMembers(program?.id || null);

  if (!program) return null;

  // Operator only sees members with consent_status = 'granted' (enforced by RLS)
  return (
    <Dialog open={!!program} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{program.program_name}</DialogTitle>
          <DialogDescription>
            Participantes com consentimento ativo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isLoading ? (
            <Skeleton className="h-20" />
          ) : members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum participante com consentimento ativo.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.user_id.slice(0, 8)}...</p>
                      <p className="text-xs text-muted-foreground">
                        Desde {format(new Date(m.joined_at), "d MMM yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">Consentido</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
