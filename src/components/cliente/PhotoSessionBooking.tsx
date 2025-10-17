import { useState } from "react";
import { usePhotoSessions } from "@/hooks/usePhotoSessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function PhotoSessionBooking() {
  const { sessions, isLoading, createSession } = usePhotoSessions();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    scheduled_date: "",
    duration_minutes: 60,
    location: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSession(formData);
    setShowForm(false);
    setFormData({
      scheduled_date: "",
      duration_minutes: 60,
      location: "",
      notes: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      confirmed: "default",
      completed: "default",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Pendente",
      confirmed: "Confirmada",
      completed: "Concluída",
      cancelled: "Cancelada",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando sessões...</p>;
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          Agendar Nova Sessão
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Sessão Fotográfica</CardTitle>
            <CardDescription>
              Preencha os detalhes para agendar sua sessão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="scheduled_date">Data e Hora</Label>
                <Input
                  id="scheduled_date"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduled_date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration_minutes">Duração (minutos)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  min="30"
                  step="30"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_minutes: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Local (opcional)</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Endereço ou descrição do local"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione qualquer informação relevante..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Confirmar Agendamento
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {sessions && sessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Suas Sessões Agendadas</h3>
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {new Date(session.scheduled_date).toLocaleDateString(
                          "pt-BR",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.scheduled_date).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(session.status)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration_minutes} minutos</span>
                  </div>

                  {session.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{session.location}</span>
                    </div>
                  )}

                  {session.notes && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <p className="text-sm">{session.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
