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
import { MessageSquareHeart, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestimonialFormProps {
  testId?: string;
  testSlug?: string;
  testName?: string;
}

export function TestimonialForm({ testId, testSlug, testName }: TestimonialFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [content, setContent] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const MAX_TESTIMONIAL_LENGTH = 2000;

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

    if (!consentGiven) {
      toast({
        title: "Consentimento necessário",
        description: "Por favor, confirme que concorda com o uso do depoimento.",
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
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Obrigado pelo seu depoimento!
            </h3>
            <p className="text-green-600 text-sm">
              Seu feedback é muito importante para melhorarmos a experiência do NELLO ONE.
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
          Queremos ouvir você!
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Se puder, compartilhe brevemente como foi sua experiência
          {testName && ` com o teste ${testName}`}. Seu depoimento é valioso para nós! 
          <span className="text-muted-foreground/70"> (Opcional)</span>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nome/Apelido</Label>
            <Input
              id="displayName"
              placeholder="Como você gostaria de ser chamado(a)?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial">Seu depoimento</Label>
            <Textarea
              id="testimonial"
              placeholder="Conte-nos sobre sua experiência..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={MAX_TESTIMONIAL_LENGTH}
              rows={6}
              className="bg-background resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/{MAX_TESTIMONIAL_LENGTH} caracteres
            </p>
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
              Ao enviar seu depoimento, você concorda que ele poderá ser utilizado 
              com sua autorização em nossos materiais.
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !displayName.trim() || !content.trim() || !consentGiven}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Depoimento
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
