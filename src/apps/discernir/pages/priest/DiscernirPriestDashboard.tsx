import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDiscernirAuth } from '../../contexts/DiscernirAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Send, 
  FileHeart,
  ArrowRight,
  Loader2,
  Church,
  AlertTriangle
} from 'lucide-react';

interface ParishStats {
  totalCouples: number;
  pendingInvites: number;
  activeConsents: number;
}

export function DiscernirPriestDashboard() {
  const { priest } = useDiscernirAuth();
  const [parish, setParish] = useState<any>(null);
  const [stats, setStats] = useState<ParishStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!priest) return;

      try {
        // Fetch parish info
        const { data: parishData } = await supabase
          .from('discernir_parishes')
          .select('*')
          .eq('id', priest.parish_id)
          .single();

        setParish(parishData);

        // Fetch stats
        const [couplesRes, invitesRes] = await Promise.all([
          supabase
            .from('discernir_couples')
            .select('id', { count: 'exact' })
            .eq('parish_id', priest.parish_id)
            .eq('status', 'active'),
          supabase
            .from('discernir_couple_invites')
            .select('id', { count: 'exact' })
            .eq('parish_id', priest.parish_id)
            .eq('status', 'pending'),
        ]);

        setStats({
          totalCouples: couplesRes.count || 0,
          pendingInvites: invitesRes.count || 0,
          activeConsents: 0, // Would need more complex query
        });
      } catch (error) {
        console.error('Error fetching priest dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [priest]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Parish Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-700">
          <Church className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-amber-900">
          {parish?.name || 'Paróquia'}
        </h1>
        {parish?.city && (
          <p className="text-amber-800/70">{parish.city}</p>
        )}
      </div>

      {/* Ethical Reminder */}
      <Card className="border-amber-300 bg-amber-100/50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Use apenas como apoio à conversa</p>
              <p className="text-amber-700/80 mt-1">
                O DISCERNIR não substitui o discernimento humano. 
                Cada acesso é registrado e o fiel será notificado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-700" />
              Casais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-amber-900">
              {stats?.totalCouples || 0}
            </div>
            <CardDescription>casais ativos</CardDescription>
            <Link to="/padre/casais">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="h-5 w-5 text-amber-700" />
              Convites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-amber-900">
              {stats?.pendingInvites || 0}
            </div>
            <CardDescription>pendentes</CardDescription>
            <Link to="/padre/convites">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Gerenciar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileHeart className="h-5 w-5 text-amber-700" />
              Apoios de Escuta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Acesse os Apoios de Escuta dos fiéis que deram consentimento
            </CardDescription>
            <Link to="/padre/casais">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Acessar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Pilot Info */}
      <Card className="border-amber-200/50 bg-amber-50/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Versão Piloto 0.1
            </Badge>
            <p className="text-sm text-amber-800/70">
              Esta é uma experiência pastoral assistida em pequena escala, com supervisão direta.
            </p>
            <p className="text-xs text-amber-700/60 mt-4">
              Máximo recomendado: 10 casais por paróquia
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
