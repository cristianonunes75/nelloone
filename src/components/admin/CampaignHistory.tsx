import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, Users, Gift, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Campaign {
  id: string;
  objective: string;
  coupon_code: string | null;
  subject: string;
  recipients_count: number;
  sent_count: number;
  failed_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
  completed_at: string | null;
}

const objectiveLabels: Record<string, string> = {
  welcome: "Boas-vindas",
  reactivation: "Reativação",
  discount: "Oferta Especial",
  urgency: "Urgência",
  testimonial: "Depoimento",
  custom: "Personalizado",
};

export function CampaignHistory() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["engagement-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagement_campaigns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Campaign[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Mail className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg font-medium">Nenhuma campanha enviada</p>
          <p className="text-sm">O histórico de campanhas aparecerá aqui</p>
        </CardContent>
      </Card>
    );
  }

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent_count, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened_count, 0);
  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{campaigns.length}</p>
              <p className="text-xs text-muted-foreground">Campanhas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalSent}</p>
              <p className="text-xs text-muted-foreground">Emails Enviados</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Clock className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgOpenRate}%</p>
              <p className="text-xs text-muted-foreground">Taxa de Abertura</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Gift className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {campaigns.filter(c => c.coupon_code).length}
              </p>
              <p className="text-xs text-muted-foreground">Com Cupom</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Campanhas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Cupom</TableHead>
                <TableHead className="text-center">Enviados</TableHead>
                <TableHead className="text-center">Abertos</TableHead>
                <TableHead className="text-center">Cliques</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(campaign.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {objectiveLabels[campaign.objective] || campaign.objective}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {campaign.subject}
                  </TableCell>
                  <TableCell>
                    {campaign.coupon_code ? (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                        {campaign.coupon_code}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{campaign.sent_count}</span>
                    {campaign.failed_count > 0 && (
                      <span className="text-red-500 text-xs ml-1">
                        ({campaign.failed_count} falhas)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {campaign.opened_count > 0 ? (
                      <span className="text-emerald-600 font-medium">
                        {campaign.opened_count}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {campaign.clicked_count > 0 ? (
                      <span className="text-blue-600 font-medium">
                        {campaign.clicked_count}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
