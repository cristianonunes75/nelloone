import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Target, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { toast } from 'sonner';

const steps = [
  { id: 1, title: 'Sobre sua empresa', icon: Building2 },
  { id: 2, title: 'Sua equipe', icon: Users },
  { id: 3, title: 'Seus objetivos', icon: Target },
];

export default function BusinessOnboarding() {
  const navigate = useNavigate();
  const { company, companyUser, refetch } = useBusinessAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Company info
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  
  // Step 2: Team info
  const [employeeRange, setEmployeeRange] = useState('');
  
  // Step 3: Goals
  const [goals, setGoals] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleComplete = async () => {
    if (!company || !companyUser) return;
    
    setIsLoading(true);
    try {
      // Update company info
      await supabase
        .from('companies')
        .update({
          industry,
          website,
          employee_count_range: employeeRange,
          settings: { onboarding_goals: goals },
        })
        .eq('id', company.id);
      
      // Mark onboarding as complete
      await supabase
        .from('company_users')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', companyUser.id);
      
      await refetch();
      toast.success('Onboarding concluído! Bem-vindo ao Nello Business.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Erro ao salvar informações');
    } finally {
      setIsLoading(false);
    }
  };

  const goalOptions = [
    { id: 'communication', label: 'Melhorar comunicação da equipe' },
    { id: 'leadership', label: 'Desenvolver lideranças' },
    { id: 'culture', label: 'Fortalecer cultura organizacional' },
    { id: 'conflicts', label: 'Reduzir conflitos' },
    { id: 'hiring', label: 'Melhorar contratações' },
    { id: 'retention', label: 'Aumentar retenção de talentos' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 rounded ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Passo {currentStep} de 3: {steps[currentStep - 1].title}
          </p>
        </div>

        <Card>
          {/* Step 1: Company Info */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Conte-nos sobre sua empresa</CardTitle>
                <CardDescription>
                  Essas informações nos ajudam a personalizar sua experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Setor de atuação</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Tecnologia</SelectItem>
                      <SelectItem value="finance">Finanças</SelectItem>
                      <SelectItem value="healthcare">Saúde</SelectItem>
                      <SelectItem value="education">Educação</SelectItem>
                      <SelectItem value="retail">Varejo</SelectItem>
                      <SelectItem value="services">Serviços</SelectItem>
                      <SelectItem value="manufacturing">Indústria</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (opcional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://suaempresa.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Team Size */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Tamanho da sua equipe</CardTitle>
                <CardDescription>
                  Isso nos ajuda a sugerir o plano ideal para você
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '1-10', label: '1-10 pessoas' },
                    { value: '11-30', label: '11-30 pessoas' },
                    { value: '31-100', label: '31-100 pessoas' },
                    { value: '100+', label: 'Mais de 100' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEmployeeRange(option.value)}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        employeeRange === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Goals */}
          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle>Seus objetivos</CardTitle>
                <CardDescription>
                  O que você espera alcançar com o Nello Business? (selecione quantos quiser)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {goalOptions.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors flex items-center gap-3 ${
                        goals.includes(goal.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        goals.includes(goal.id) ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {goals.includes(goal.id) && (
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{goal.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="p-6 pt-0 flex justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
            ) : (
              <div />
            )}
            
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="gap-2">
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Concluir
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
