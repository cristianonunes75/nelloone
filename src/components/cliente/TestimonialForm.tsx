import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquareHeart, Send, Check, AlertTriangle } from 'lucide-react';
import { checkTestimonialCompliance, TESTIMONIAL_FORM_GUIDANCE, TESTIMONIAL_CONSENT_TEXT } from '@/lib/compliance/testimonialCompliance';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface TestimonialFormProps {
  testId?: string;
  testSlug?: string;
  testName?: string;
}

export function TestimonialForm({ testId, testSlug, testName }: TestimonialFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [displayName, setDisplayName] = useState('');
  const [content, setContent] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [clinicalConsentGiven, setClinicalConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complianceWarning, setComplianceWarning] = useState<string | null>(null);

  const MAX_TESTIMONIAL_LENGTH = 2000;
  const isEn = language === 'en';

  const handleContentChange = (value: string) => {
    setContent(value);
    const result = checkTestimonialCompliance(value);
    if (result.riskLevel === 'critical') {
      setComplianceWarning(
        isEn 
          ? `Please avoid clinical terms: ${result.detectedTerms.join(', ')}. Focus on clarity and self-knowledge.`
          : `Evite termos clínicos: ${result.detectedTerms.join(', ')}. Foque em clareza e autoconhecimento.`
      );
    } else if (result.riskLevel === 'moderate') {
      setComplianceWarning(
        isEn
          ? 'Your testimonial contains terms that may require review.'
          : 'Seu depoimento contém termos que podem precisar de revisão.'
      );
    } else {
      setComplianceWarning(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar um depoimento.",
        variant: "destructive"
      });
      return;
    }

    if (!displayName.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e depoimento.",
        variant: "destructive"
      });
      return;
    }

    if (!consentGiven || !clinicalConsentGiven) {
      toast({
        title: isEn ? "Consent required" : "Consentimento necessário",
        description: isEn 
          ? "Please confirm both consent checkboxes."
          : "Por favor, confirme ambas as caixas de consentimento.",
        variant: "destructive"
      });
      return;
    }

    // Final compliance check before submission
    const complianceResult = checkTestimonialCompliance(content);
    if (complianceResult.riskLevel === 'critical') {
      toast({
        title: isEn ? "Content review needed" : "Revisão de conteúdo necessária",
        description: isEn 
          ? "Please remove clinical terms before submitting."
          : "Por favor, remova termos clínicos antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          test_id: testId || null,
          test_slug: testSlug || null,
          display_name: displayName.trim(),
          content: content.trim(),
          consent_given: consentGiven
        });

      if (error) throw error;

      // Send email notification to admin
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'new_testimonial',
            to: 'admin@nello.one',
            data: {
              displayName: displayName.trim(),
              testimonialContent: content.trim(),
              testName: testName || 'NELLO ONE',
              userEmail: user.email
            }
          }
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
        // Don't fail the submission if email fails
      }

      setIsSubmitted(true);
      toast({
        title: "Obrigado pelo seu depoimento!",
        description: "Seu feedback é muito valioso para nós."
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu depoimento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isEn ? 'Thank you for your testimonial!' : 'Obrigado pelo seu depoimento!'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {isEn 
                ? 'Your feedback is very important for improving the NELLO ONE experience.'
                : 'Seu feedback é muito importante para melhorarmos a experiência do NELLO ONE.'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquareHeart className="w-5 h-5 text-primary" />
          {isEn ? 'We want to hear from you!' : 'Queremos ouvir você!'}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {isEn 
            ? `If you can, briefly share how your experience was${testName ? ` with the ${testName} map` : ''}. Your testimonial is valuable to us!`
            : `Se puder, compartilhe brevemente como foi sua experiência${testName ? ` com o mapa ${testName}` : ''}. Seu depoimento é valioso para nós!`}
          <span className="text-muted-foreground/70"> ({isEn ? 'Optional' : 'Opcional'})</span>
        </p>
        {/* Guidance text for compliance */}
        <p className="text-xs text-muted-foreground/80 mt-2 p-2 bg-muted/30 rounded-md">
          {isEn ? TESTIMONIAL_FORM_GUIDANCE.en : TESTIMONIAL_FORM_GUIDANCE.pt}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">{isEn ? 'Name/Nickname' : 'Nome/Apelido'}</Label>
            <Input
              id="displayName"
              placeholder={isEn ? 'How would you like to be called?' : 'Como você gostaria de ser chamado(a)?'}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial">{isEn ? 'Your testimonial' : 'Seu depoimento'}</Label>
            <Textarea
              id="testimonial"
              placeholder={isEn ? 'Tell us about your experience...' : 'Conte-nos sobre sua experiência...'}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              maxLength={MAX_TESTIMONIAL_LENGTH}
              rows={6}
              className="bg-background resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/{MAX_TESTIMONIAL_LENGTH} {isEn ? 'characters' : 'caracteres'}
            </p>
            
            {/* Compliance warning */}
            {complianceWarning && (
              <div className="flex items-start gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs text-destructive">{complianceWarning}</p>
              </div>
            )}
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
            />
            <Label 
              htmlFor="consent" 
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              {isEn 
                ? 'By submitting your testimonial, you agree that it may be used with your authorization in our materials.'
                : 'Ao enviar seu depoimento, você concorda que ele poderá ser utilizado com sua autorização em nossos materiais.'}
            </Label>
          </div>

          {/* Clinical consent checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="clinicalConsent"
              checked={clinicalConsentGiven}
              onCheckedChange={(checked) => setClinicalConsentGiven(checked === true)}
            />
            <Label 
              htmlFor="clinicalConsent" 
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              {isEn ? TESTIMONIAL_CONSENT_TEXT.en : TESTIMONIAL_CONSENT_TEXT.pt}
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !displayName.trim() || !content.trim() || !consentGiven || !clinicalConsentGiven}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                {isEn ? 'Sending...' : 'Enviando...'}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {isEn ? 'Send Testimonial' : 'Enviar Depoimento'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
