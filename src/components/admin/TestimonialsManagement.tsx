import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageSquareHeart, 
  Check, 
  X, 
  Clock, 
  User,
  Calendar,
  FileText,
  RefreshCw,
  Star,
  Mail,
  Send,
  Pencil,
  Plus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
  is_featured: boolean;
  response_sent_at: string | null;
}

// Component protected by AdminGuard at route level - can_manage_settings
export function TestimonialsManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [replyDialog, setReplyDialog] = useState<Testimonial | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [editDialog, setEditDialog] = useState<Testimonial | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');

  // External testimonial creation state
  const [addExternalDialog, setAddExternalDialog] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [externalContent, setExternalContent] = useState('');
  const [externalSource, setExternalSource] = useState('');

  const { data: testimonials, isLoading, refetch } = useQuery({
    queryKey: ['admin-testimonials', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('is_featured', { ascending: false })
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

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['approved-testimonials-landing'] });
      toast({
        title: variables.is_featured ? "Depoimento destacado" : "Destaque removido",
        description: variables.is_featured 
          ? "O depoimento agora aparece em destaque na landing page."
          : "O depoimento não está mais em destaque."
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o destaque.",
        variant: "destructive"
      });
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, content, display_name }: { id: string; content: string; display_name: string }) => {
      const { error } = await supabase
        .from('testimonials')
        .update({ content, display_name, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['approved-testimonials-landing'] });
      toast({
        title: "Depoimento atualizado",
        description: "O conteúdo foi salvo com sucesso."
      });
      setEditDialog(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o depoimento.",
        variant: "destructive"
      });
    }
  });

  const createExternalMutation = useMutation({
    mutationFn: async ({ displayName, content, source }: { displayName: string; content: string; source?: string }) => {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user!.id,
          display_name: displayName,
          content,
          consent_given: true,
          status: 'approved',
          test_slug: 'externo',
          admin_notes: source ? `Origem: ${source}` : 'Depoimento externo adicionado manualmente',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user!.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['approved-testimonials-landing'] });
      toast({
        title: "Depoimento adicionado",
        description: "O depoimento externo foi criado e já está aprovado."
      });
      setAddExternalDialog(false);
      setExternalName('');
      setExternalContent('');
      setExternalSource('');
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o depoimento.",
        variant: "destructive"
      });
    }
  });

  const handleOpenReplyDialog = async (testimonial: Testimonial) => {
    setReplyDialog(testimonial);
    setReplySubject(`Agradecemos seu depoimento sobre o NELLO ONE`);
    setReplyMessage(`Olá ${testimonial.display_name},\n\nMuito obrigado por compartilhar sua experiência conosco! Seu feedback é muito valioso para melhorarmos continuamente o NELLO ONE.\n\nAtenciosamente,\nEquipe NELLO ONE`);
    
    // Fetch user email
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', testimonial.user_id)
      .single();
    
    if (data) {
      const { data: authData } = await supabase.auth.admin.getUserById(testimonial.user_id);
      if (authData?.user?.email) {
        setUserEmail(authData.user.email);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyDialog || !userEmail || !replyMessage) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingReply(true);

    try {
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'testimonial_response',
          to: userEmail,
          data: {
            name: replyDialog.display_name,
            subject: replySubject,
            message: replyMessage
          }
        }
      });

      if (emailError) throw emailError;

      // Update testimonial with response tracking
      await supabase
        .from('testimonials')
        .update({
          response_sent_at: new Date().toISOString(),
          response_sent_by: user?.id
        })
        .eq('id', replyDialog.id);

      toast({
        title: "Resposta enviada!",
        description: `Email enviado para ${userEmail}`
      });

      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setReplyDialog(null);
      setReplySubject('');
      setReplyMessage('');
      setUserEmail('');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a resposta. Verifique o email.",
        variant: "destructive"
      });
    } finally {
      setIsSendingReply(false);
    }
  };

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
      'nello-16': 'Nello 16',
      'externo': 'Externo'
    };
    return slug ? testNames[slug] || slug : 'Geral';
  };

  const pendingCount = testimonials?.filter(t => t.status === 'pending').length || 0;
  const featuredCount = testimonials?.filter(t => t.is_featured).length || 0;

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
          {featuredCount > 0 && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Star className="w-3 h-3 mr-1 fill-amber-500" />
              {featuredCount} em destaque
            </Badge>
          )}
          {pendingCount > 0 && (
            <Badge className="bg-yellow-500">
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm" onClick={() => setAddExternalDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Externo
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
            <Card 
              key={testimonial.id} 
              className={`hover:shadow-md transition-shadow ${testimonial.is_featured ? 'ring-2 ring-amber-300 bg-amber-50/30' : ''}`}
            >
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
                      {testimonial.is_featured && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                          <Star className="w-3 h-3 mr-1 fill-amber-500" />
                          Destaque
                        </Badge>
                      )}
                      {testimonial.response_sent_at && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Mail className="w-3 h-3 mr-1" />
                          Respondido
                        </Badge>
                      )}
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

                  <div className="flex flex-col gap-2">
                    {/* Featured toggle for approved testimonials */}
                    {testimonial.status === 'approved' && (
                      <Button
                        size="sm"
                        variant={testimonial.is_featured ? "default" : "outline"}
                        className={testimonial.is_featured ? "bg-amber-500 hover:bg-amber-600" : "text-amber-600 hover:bg-amber-50"}
                        onClick={() => toggleFeaturedMutation.mutate({ 
                          id: testimonial.id, 
                          is_featured: !testimonial.is_featured 
                        })}
                      >
                        <Star className={`w-4 h-4 ${testimonial.is_featured ? 'fill-white' : ''}`} />
                      </Button>
                    )}

                    {/* Edit button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-primary hover:bg-primary/10"
                      onClick={() => {
                        setEditDialog(testimonial);
                        setEditContent(testimonial.content);
                        setEditDisplayName(testimonial.display_name);
                      }}
                      title="Editar conteúdo"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {/* Reply button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => handleOpenReplyDialog(testimonial)}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>

                    {/* Approve/Reject buttons */}
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

      {/* Reject Dialog */}
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

      {/* Reply Dialog */}
      <Dialog open={!!replyDialog} onOpenChange={() => setReplyDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Responder Depoimento
            </DialogTitle>
            <DialogDescription>
              Enviar email de agradecimento para {replyDialog?.display_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email do Usuário</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="email@exemplo.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replySubject">Assunto</Label>
              <Input
                id="replySubject"
                placeholder="Assunto do email"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replyMessage">Mensagem</Label>
              <Textarea
                id="replyMessage"
                placeholder="Sua mensagem..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSendReply} disabled={isSendingReply || !userEmail}>
              {isSendingReply ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Resposta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Editar Depoimento
            </DialogTitle>
            <DialogDescription>
              Editar o conteúdo do depoimento de {editDialog?.display_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editDisplayName">Nome de exibição</Label>
              <Input
                id="editDisplayName"
                placeholder="Nome completo..."
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editContent">Conteúdo</Label>
              <Textarea
                id="editContent"
                placeholder="Depoimento..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {editContent.length} caracteres
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (editDialog) {
                  updateContentMutation.mutate({
                    id: editDialog.id,
                    content: editContent.trim(),
                    display_name: editDisplayName.trim()
                  });
                }
              }}
              disabled={updateContentMutation.isPending || !editContent.trim()}
            >
              {updateContentMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add External Testimonial Dialog */}
      <Dialog open={addExternalDialog} onOpenChange={setAddExternalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Depoimento Externo</DialogTitle>
            <DialogDescription>
              Cole um depoimento feito fora da plataforma. Ele será salvo como aprovado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ext-name">Nome da pessoa</Label>
              <Input
                id="ext-name"
                value={externalName}
                onChange={(e) => setExternalName(e.target.value)}
                placeholder="Ex: Maria Silva"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="ext-content">Depoimento</Label>
              <Textarea
                id="ext-content"
                value={externalContent}
                onChange={(e) => setExternalContent(e.target.value)}
                placeholder="Cole o depoimento aqui..."
                rows={5}
                maxLength={2000}
              />
            </div>
            <div>
              <Label htmlFor="ext-source">Origem (opcional)</Label>
              <Input
                id="ext-source"
                value={externalSource}
                onChange={(e) => setExternalSource(e.target.value)}
                placeholder="Ex: WhatsApp, Instagram, Email..."
                maxLength={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExternalDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                createExternalMutation.mutate({
                  displayName: externalName.trim(),
                  content: externalContent.trim(),
                  source: externalSource.trim() || undefined,
                });
              }}
              disabled={createExternalMutation.isPending || !externalName.trim() || !externalContent.trim()}
            >
              {createExternalMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
