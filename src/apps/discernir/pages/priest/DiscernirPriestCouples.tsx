import { useState, useEffect } from 'react';
import { useDiscernirAuth } from '../../contexts/DiscernirAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Loader2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Couple {
  id: string;
  couple_name: string | null;
  status: string;
  spouse_a_user_id: string | null;
  spouse_b_user_id: string | null;
  spouse_a_profile?: { full_name: string } | null;
  spouse_b_profile?: { full_name: string } | null;
  spouse_a_consent?: boolean;
  spouse_b_consent?: boolean;
}

export function DiscernirPriestCouples() {
  const { priest } = useDiscernirAuth();
  const [couples, setCouples] = useState<Couple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCouple, setSelectedCouple] = useState<Couple | null>(null);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    fetchCouples();
  }, [priest]);

  const fetchCouples = async () => {
    if (!priest) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('discernir_couples')
        .select(`
          *,
          spouse_a_profile:profiles!discernir_couples_spouse_a_user_id_fkey(full_name),
          spouse_b_profile:profiles!discernir_couples_spouse_b_user_id_fkey(full_name)
        `)
        .eq('parish_id', priest.parish_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check consents for each couple
      const couplesWithConsents = await Promise.all(
        (data || []).map(async (couple) => {
          const consents = await supabase
            .from('discernir_consents')
            .select('user_id, consent_type')
            .in('user_id', [couple.spouse_a_user_id, couple.spouse_b_user_id].filter(Boolean))
            .eq('consent_type', 'priest_access')
            .eq('is_active', true)
            .is('revoked_at', null);

          return {
            ...couple,
            spouse_a_consent: consents.data?.some(c => c.user_id === couple.spouse_a_user_id),
            spouse_b_consent: consents.data?.some(c => c.user_id === couple.spouse_b_user_id),
          };
        })
      );

      setCouples(couplesWithConsents);
    } catch (error: any) {
      console.error('Error fetching couples:', error);
      toast.error('Erro ao carregar casais');
    } finally {
      setIsLoading(false);
    }
  };

  const viewApoioEscuta = async (couple: Couple) => {
    setSelectedCouple(couple);
    setIsViewing(true);

    // Log access
    try {
      await supabase.from('discernir_access_logs').insert({
        priest_id: priest!.id,
        couple_id: couple.id,
        action: 'view_couple',
        consent_verified: couple.spouse_a_consent && couple.spouse_b_consent,
      });
    } catch (error) {
      console.error('Error logging access:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-amber-900">
            Casais
          </h1>
          <p className="text-amber-800/70 mt-1">
            {couples.length} casais vinculados
          </p>
        </div>
      </div>

      {/* Reminder */}
      <Card className="border-amber-300 bg-amber-100/50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Você só pode acessar o Apoio de Escuta de fiéis que deram consentimento explícito.
              Cada acesso é registrado e o fiel será notificado.
            </p>
          </div>
        </CardContent>
      </Card>

      {couples.length === 0 ? (
        <Card className="border-amber-200/50">
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-amber-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Nenhum casal vinculado
            </h2>
            <p className="text-amber-800/70">
              Envie convites para os casais participarem da experiência DISCERNIR.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {couples.map((couple) => (
            <Card key={couple.id} className="border-amber-200/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <Users className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-900">
                        {couple.couple_name || 
                          `${couple.spouse_a_profile?.full_name || 'Cônjuge A'} & ${couple.spouse_b_profile?.full_name || 'Cônjuge B'}`
                        }
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs">
                          {couple.spouse_a_consent ? (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-gray-400" />
                          )}
                          <span className="text-muted-foreground">Cônjuge A</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {couple.spouse_b_consent ? (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-gray-400" />
                          )}
                          <span className="text-muted-foreground">Cônjuge B</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={couple.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                      }
                    >
                      {couple.status === 'active' ? 'Ativo' : couple.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewApoioEscuta(couple)}
                      disabled={!couple.spouse_a_consent && !couple.spouse_b_consent}
                      className="text-amber-700 border-amber-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Apoio
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewing} onOpenChange={setIsViewing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-700" />
              Apoio de Escuta
            </DialogTitle>
            <DialogDescription>
              {selectedCouple?.couple_name || 'Casal selecionado'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border-amber-300 bg-amber-100/50">
              <CardContent className="py-3">
                <p className="text-sm text-amber-800 text-center">
                  ⚠️ Este conteúdo é apenas um apoio para a conversa pastoral.
                </p>
              </CardContent>
            </Card>
            
            <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/30">
              <p className="text-amber-800/70 text-center italic">
                Funcionalidade em desenvolvimento.
                <br />
                O Apoio de Escuta será gerado com base nos dados do Identity.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
