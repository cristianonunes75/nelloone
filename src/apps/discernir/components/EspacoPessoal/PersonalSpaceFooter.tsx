import { Shield } from 'lucide-react';

export function PersonalSpaceFooter() {
  return (
    <footer className="mt-8 pt-6 border-t border-amber-200/40">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600/60 mt-0.5 flex-shrink-0" />
        <div className="space-y-3">
          <p className="text-xs text-amber-700/70 leading-relaxed">
            Seus dados pessoais são utilizados exclusivamente para fins de acompanhamento pastoral, 
            conforme a Lei Geral de Proteção de Dados (LGPD).
          </p>
          <p className="text-xs text-amber-700/70 leading-relaxed">
            Nenhuma informação é compartilhada sem seu consentimento explícito e revogável.
          </p>
          <p className="text-xs text-amber-700/70 leading-relaxed">
            Você pode acessar, corrigir ou solicitar a exclusão de seus dados a qualquer momento.
          </p>
        </div>
      </div>
    </footer>
  );
}
