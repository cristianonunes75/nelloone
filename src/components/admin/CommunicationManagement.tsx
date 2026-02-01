import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Inbox,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Mail,
  User,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNewTicketSound } from "@/hooks/useNewTicketSound";

interface Ticket {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Reply {
  id: string;
  ticket_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  novo: { label: "Novo", color: "bg-blue-100 text-blue-800", icon: <AlertCircle className="w-3 h-3" /> },
  em_andamento: { label: "Em andamento", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3" /> },
  resolvido: { label: "Resolvido", color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
};

const categoryLabels: Record<string, string> = {
  suporte: "Suporte Geral",
  privacidade: "Privacidade",
  pagamento: "Pagamento",
  outro: "Outro",
};

export const CommunicationManagement = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  
  // Hook for new ticket sound notifications
  useNewTicketSound();

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedTicket) {
      fetchReplies(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar tickets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from("support_replies")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error: any) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setSending(true);
    try {
      // Save reply to database
      const { error: replyError } = await supabase
        .from("support_replies")
        .insert({
          ticket_id: selectedTicket.id,
          message: replyMessage,
          is_admin: true,
        });

      if (replyError) throw replyError;

      // Update ticket status to em_andamento if it's novo
      if (selectedTicket.status === "novo") {
        await supabase
          .from("support_tickets")
          .update({ status: "em_andamento" })
          .eq("id", selectedTicket.id);
      }

      // Send email to user
      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          type: "support_reply",
          to: selectedTicket.email,
          data: {
            name: selectedTicket.name,
            subject: selectedTicket.subject || "Sua mensagem de suporte",
            message: replyMessage,
          },
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
        toast({
          title: "Resposta salva",
          description: "A resposta foi salva, mas houve um erro ao enviar o email.",
          variant: "default",
        });
      } else {
        toast({
          title: "Resposta enviada!",
          description: `Email enviado para ${selectedTicket.email}`,
        });
      }

      setReplyMessage("");
      fetchReplies(selectedTicket.id);
      fetchTickets();
      
      // Update local state
      setSelectedTicket(prev => prev ? { ...prev, status: "em_andamento" } : null);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar resposta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;

    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status })
        .eq("id", selectedTicket.id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Ticket marcado como ${statusConfig[status]?.label || status}`,
      });

      setSelectedTicket(prev => prev ? { ...prev, status } : null);
      fetchTickets();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const newTicketsCount = tickets.filter(t => t.status === "novo").length;

  if (selectedTicket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {selectedTicket.subject || "Sem assunto"}
            </h2>
            <p className="text-sm text-muted-foreground">
              De: {selectedTicket.name} ({selectedTicket.email})
            </p>
          </div>
          <Select value={selectedTicket.status} onValueChange={handleUpdateStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{categoryLabels[selectedTicket.category] || selectedTicket.category}</Badge>
                <Badge className={statusConfig[selectedTicket.status]?.color || "bg-gray-100"}>
                  {statusConfig[selectedTicket.status]?.icon}
                  <span className="ml-1">{statusConfig[selectedTicket.status]?.label || selectedTicket.status}</span>
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(selectedTicket.created_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Original message */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{selectedTicket.name}</span>
              </div>
              <p className="whitespace-pre-wrap text-foreground">{selectedTicket.message}</p>
            </div>

            {/* Replies */}
            {replies.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Histórico de respostas</h4>
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`rounded-lg p-4 ${
                      reply.is_admin ? "bg-primary/10 ml-8" : "bg-muted/50 mr-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {reply.is_admin ? (
                        <Badge variant="secondary" className="text-xs">Admin</Badge>
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(reply.created_at), "dd/MM/yyyy HH:mm")}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply form */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Responder</h4>
              <Textarea
                placeholder="Digite sua resposta..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus("resolvido")}
                  disabled={selectedTicket.status === "resolvido"}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Resolvido
                </Button>
                <Button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() || sending}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Enviar Resposta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Comunicação
            {newTicketsCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {newTicketsCount} {newTicketsCount === 1 ? "novo" : "novos"}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Gerencie mensagens de suporte dos usuários</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="novo">Novos</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="resolvidos">Resolvidos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">Nenhuma mensagem</h3>
            <p className="text-sm text-muted-foreground/70">
              {statusFilter === "all" 
                ? "Não há tickets de suporte ainda." 
                : `Não há tickets com status "${statusConfig[statusFilter]?.label || statusFilter}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Remetente</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedTicket(ticket)}>
                  <TableCell>
                    <Badge className={statusConfig[ticket.status]?.color || "bg-gray-100"}>
                      {statusConfig[ticket.status]?.icon}
                      <span className="ml-1">{statusConfig[ticket.status]?.label || ticket.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.name}</p>
                      <p className="text-sm text-muted-foreground">{ticket.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryLabels[ticket.category] || ticket.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {ticket.subject || ticket.message.substring(0, 50) + "..."}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(ticket.created_at), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}>
                      <Mail className="w-4 h-4 mr-1" />
                      Abrir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
