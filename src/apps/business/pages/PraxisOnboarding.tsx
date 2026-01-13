import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Sparkles, Loader2, ArrowRight, Heart, Target, MessageSquare, Users } from 'lucide-react';
import { usePraxisAuth } from '../hooks/usePraxisAuth';

const specialties = [
  { value: 'coaching', label: 'Coaching', icon: Target, description: 'Executivo, vida, carreira, performance' },
  { value: 'therapy', label: 'Terapia/Desenvolvimento', icon: Heart, description: 'Não clínico, foco em crescimento' },
  { value: 'mentoring', label: 'Mentoria', icon: MessageSquare, description: 'Facilitação, aconselhamento' },
  { value: 'consulting', label: 'Consultoria RH', icon: Users, description: 'Desenvolvimento organizacional' },
];

export default function PraxisOnboarding() {
  const navigate = useNavigate();
  const { createProfile, isProfessional } = usePraxisAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    business_name: '',
    specialty: '',
    bio: '',
    phone: '',
    website: '',
  });

  // If already has profile, redirect
  if (isProfessional) {
    navigate('/praxis/dashboard');
    return null;
  }

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const profile = await createProfile(formData);
      
      if (profile) {
        toast.success('Perfil criado com sucesso!');
        navigate('/praxis/dashboard');
      } else {
        throw new Error('Erro ao criar perfil');
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Erro ao criar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <div className="container mx-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold">Nello One Praxis</span>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-amber-500' : 'bg-muted'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-amber-500' : 'bg-muted'}`} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center p-4">
        <Card className="w-full max-w-md">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Qual é sua especialidade?</CardTitle>
                <CardDescription>
                  Isso nos ajuda a personalizar sua experiência.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  value={formData.specialty}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}
                >
                  {specialties.map((spec) => (
                    <Label
                      key={spec.value}
                      htmlFor={spec.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.specialty === spec.value 
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30' 
                          : 'border-border hover:border-amber-500/50'
                      }`}
                    >
                      <RadioGroupItem value={spec.value} id={spec.value} className="sr-only" />
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                        <spec.icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium">{spec.label}</div>
                        <div className="text-sm text-muted-foreground">{spec.description}</div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>

                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 mt-6"
                  onClick={() => setStep(2)}
                  disabled={!formData.specialty}
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Sobre sua prática</CardTitle>
                <CardDescription>
                  Informações para personalizar seu perfil profissional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Nome da sua prática</Label>
                  <Input
                    id="business_name"
                    placeholder="Ex: João Silva Coaching"
                    value={formData.business_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Breve descrição (opcional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Conte um pouco sobre você e seu trabalho..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp (opcional)</Label>
                  <Input
                    id="phone"
                    placeholder="+55 11 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (opcional)</Label>
                  <Input
                    id="website"
                    placeholder="https://seusite.com"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Começar agora'}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
