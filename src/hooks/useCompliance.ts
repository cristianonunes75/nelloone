import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  checkCompliance, 
  autoCorrectText, 
  generateComplianceReport,
  type ComplianceResult 
} from '@/lib/compliance';
import { useToast } from './use-toast';

interface UseComplianceOptions {
  autoCorrect?: boolean;
  logViolations?: boolean;
  showToasts?: boolean;
}

export function useCompliance(options: UseComplianceOptions = {}) {
  const { 
    autoCorrect = false, 
    logViolations = true,
    showToasts = true 
  } = options;
  const { toast } = useToast();

  /**
   * Verifica texto e retorna resultado de compliance
   */
  const verify = useCallback(async (
    text: string, 
    pageOrComponent: string,
    language: 'pt' | 'en' = 'pt'
  ): Promise<{ result: ComplianceResult; correctedText?: string }> => {
    const result = checkCompliance(text, language);

    // Log violations se configurado
    if (logViolations && !result.isCompliant) {
      for (const violation of result.violations) {
        try {
          await supabase.from('compliance_audits').insert({
            page_or_component: pageOrComponent,
            detected_term: violation.term,
            original_text: violation.context,
            risk_level: violation.riskLevel,
            suggested_fix: violation.suggestedFix,
            status: 'blocked',
          });
        } catch (error) {
          console.error('Failed to log compliance violation:', error);
        }
      }

      // Mostrar toast se configurado
      if (showToasts) {
        toast({
          title: '⚠️ Alerta de Compliance',
          description: `${result.violations.length} termo(s) de risco detectado(s). Ajuste para linguagem reflexiva.`,
          variant: 'destructive',
        });
      }
    }

    // Auto-corrigir se configurado
    const correctedText = autoCorrect ? autoCorrectText(text) : undefined;

    return { result, correctedText };
  }, [autoCorrect, logViolations, showToasts, toast]);

  /**
   * Aplica correções automáticas ao texto
   */
  const correct = useCallback((text: string): string => {
    return autoCorrectText(text);
  }, []);

  /**
   * Gera relatório de compliance
   */
  const report = useCallback((result: ComplianceResult): string => {
    return generateComplianceReport(result);
  }, []);

  /**
   * Resolve uma violação no banco de dados
   */
  const resolveViolation = useCallback(async (
    auditId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('compliance_audits')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: userId,
        })
        .eq('id', auditId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to resolve violation:', error);
      return false;
    }
  }, []);

  return {
    verify,
    correct,
    report,
    resolveViolation,
    checkCompliance,
    autoCorrectText,
  };
}
