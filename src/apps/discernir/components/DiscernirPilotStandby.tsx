import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Church, ArrowRight } from 'lucide-react';

export function DiscernirPilotStandby() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-amber-200/50 bg-card">
        <CardContent className="p-8 text-center space-y-6">
          <Church className="h-12 w-12 text-amber-700 mx-auto" />
          <div className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Em breve
            </h2>
            <p className="text-sm text-muted-foreground">
              Este módulo está em preparação e será disponibilizado em breve.
              Por enquanto, explore o Perfil de Serviço.
            </p>
          </div>
          <Link to="/perfil-servico">
            <Button className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Ir para Perfil de Serviço
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
