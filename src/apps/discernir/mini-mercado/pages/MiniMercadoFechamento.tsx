import { Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function MiniMercadoFechamento() {
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-lg font-semibold text-amber-900">Fechamento</h2>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <Receipt className="h-9 w-9 text-amber-700/70" />
          <p className="text-sm text-muted-foreground">
            O fechamento por trabalhador (total, PIX e recibo) chega na próxima etapa. Por enquanto,
            o balcão já registra todas as compras.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
