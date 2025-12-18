import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquareHeart, 
  Check, 
  X, 
  Clock, 
  User,
  Calendar,
  FileText,
  RefreshCw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Testimonial {
  id: string;
  user_id: string;
  test_slug: string | null;
  display_name: string;
  content: string;
  consent_given: boolean;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export function TestimonialsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data: testimonials, isLoading, refetch } = useQuery({
    queryKey: ['admin-testimonials', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Testimonial[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('testimonials')
        .update({ 
          status, 
          admin_notes: notes || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({
        title: "Status atualizado",
        description: "O depoimento foi atualizado com sucesso."
      });
      setSelectedTestimonial(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o depoimento.",
        variant: "destructive"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTestName = (slug: string | null) => {
    const testNames: Record<string, string> = {
      'arquetipos': 'Arquétipos',
      'disc': 'DISC',
      'temperamentos': 'Temperamentos',
      'estilos-conexao-afetiva': 'Estilos de Conexão',
      'inteligencias': 'Inteligências Múltiplas',
      'eneagrama': 'Eneagrama',
      'nello-16': 'Nello 16'
    };
    return slug ? testNames[slug] || slug : 'Geral';
  };

  const pendingCount = testimonials?.filter(t => t.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquareHeart className="w-6 h-6 text-primary" />
            Depoimentos
          </h2>
          <p className="text-muted-foreground">
            Gerencie os depoimentos dos usuários
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <Badge className="bg-yellow-500">
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="rejected">Rejeitados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground mt-2">Carregando depoimentos...</p>
        </div>
      ) : testimonials?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquareHeart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum depoimento encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{testimonial.display_name}</span>
                      </div>
                      <Badge variant="secondary">
                        <FileText className="w-3 h-3 mr-1" />
                        {getTestName(testimonial.test_slug)}
                      </Badge>
                      {getStatusBadge(testimonial.status)}
                    </div>
                    
                    <p className="text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(testimonial.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {testimonial.consent_given && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Check className="w-3 h-3" />
                          Consentimento dado
                        </span>
                      )}
                    </div>

                    {testimonial.admin_notes && (
                      <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                        Nota admin: {testimonial.admin_notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {testimonial.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => updateStatusMutation.mutate({ id: testimonial.id, status: 'approved' })}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedTestimonial(testimonial);
                            setAdminNotes('');
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {testimonial.status !== 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateStatusMutation.mutate({ id: testimonial.id, status: 'pending' })}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Depoimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Adicione uma nota explicando o motivo da rejeição (opcional):
            </p>
            <Textarea
              placeholder="Motivo da rejeição..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTestimonial(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedTestimonial) {
                  updateStatusMutation.mutate({
                    id: selectedTestimonial.id,
                    status: 'rejected',
                    notes: adminNotes
                  });
                }
              }}
            >
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
