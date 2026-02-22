import { useState } from 'react';
import { Users, Plus, Minus, CreditCard, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCorporateLicense } from '../hooks/useCorporateLicense';
import { useBusinessAuth } from '../hooks/useBusinessAuth';

export function SeatManagementCard() {
  const { license, isLoading, isCheckingOut, isManagingSeats, startCorporateCheckout, updateSeats } = useCorporateLicense();
  const { isCompanyAdmin } = useBusinessAuth();
  const [newSeats, setNewSeats] = useState(10);
  const [checkoutSeats, setCheckoutSeats] = useState(10);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  if (isLoading || !license) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const usagePercent = license.seatsTotal > 0 ? (license.seatsUsed / license.seatsTotal) * 100 : 0;
  const isNearLimit = usagePercent >= 80;
  const isAtLimit = license.seatsUsed >= license.seatsTotal;
  const hasSubscription = !!license.stripeSubscriptionId;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Licenças Identity
            </CardTitle>
            <CardDescription>
              Gerencie os seats da sua licença corporativa
            </CardDescription>
          </div>
          {hasSubscription && (
            <Badge variant="default" className="bg-green-600">Ativa</Badge>
          )}
          {!hasSubscription && license.status === 'trial' && (
            <Badge variant="secondary">Trial</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seat Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Seats utilizados</span>
            <span className="font-semibold">
              {license.seatsUsed} / {license.seatsTotal}
            </span>
          </div>
          <Progress value={usagePercent} className={isNearLimit ? '[&>div]:bg-amber-500' : ''} />
          <p className="text-xs text-muted-foreground">
            {license.seatsAvailable} {license.seatsAvailable === 1 ? 'seat disponível' : 'seats disponíveis'}
          </p>
        </div>

        {/* Warning when near/at limit */}
        {isAtLimit && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Limite atingido</p>
              <p className="text-xs mt-0.5 opacity-80">
                Novos convites estão bloqueados. Faça upgrade para adicionar mais seats.
              </p>
            </div>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Você está próximo do limite de seats. Considere fazer upgrade.</p>
          </div>
        )}

        {/* Actions */}
        {isCompanyAdmin && (
          <div className="flex flex-col gap-2">
            {!hasSubscription ? (
              <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2">
                    <CreditCard className="w-4 h-4" />
                    Ativar Licença Corporativa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ativar Identity Corporate License</DialogTitle>
                    <DialogDescription>
                      Escolha a quantidade de seats para sua empresa. R$49/seat/mês.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-center gap-4 py-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCheckoutSeats(Math.max(1, checkoutSeats - 1))}
                      disabled={checkoutSeats <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="text-center min-w-[100px]">
                      <div className="text-4xl font-bold">{checkoutSeats}</div>
                      <p className="text-sm text-muted-foreground">seats</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCheckoutSeats(Math.min(500, checkoutSeats + 1))}
                      disabled={checkoutSeats >= 500}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-lg font-semibold">
                      R$ {(checkoutSeats * 49).toLocaleString('pt-BR')}/mês
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        startCorporateCheckout(checkoutSeats);
                        setShowCheckout(false);
                      }}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      Ir para checkout
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Users className="w-4 h-4" />
                    Alterar quantidade de seats
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar Seats</DialogTitle>
                    <DialogDescription>
                      Ajuste a quantidade de seats. A cobrança será proporcional.
                      Mínimo: {license.seatsUsed} (em uso).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-center gap-4 py-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNewSeats(Math.max(license.seatsUsed, newSeats - 1))}
                      disabled={newSeats <= license.seatsUsed}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="text-center min-w-[100px]">
                      <div className="text-4xl font-bold">{newSeats}</div>
                      <p className="text-sm text-muted-foreground">seats</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNewSeats(Math.min(500, newSeats + 1))}
                      disabled={newSeats >= 500}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-lg font-semibold">
                      R$ {(newSeats * 49).toLocaleString('pt-BR')}/mês
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {newSeats > license.seatsTotal ? 'Upgrade' : newSeats < license.seatsTotal ? 'Downgrade' : 'Sem alteração'}
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        updateSeats(newSeats);
                        setShowUpgrade(false);
                      }}
                      disabled={isManagingSeats || newSeats === license.seatsTotal}
                    >
                      {isManagingSeats ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Confirmar alteração
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        {/* Operator info */}
        {license.operatorId && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Operador responsável: vinculado
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
