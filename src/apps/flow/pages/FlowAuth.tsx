import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';

export default function FlowAuth() {
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get('signup') === 'true';
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<'login' | 'signup'>(isSignup ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          toast.error('As senhas não coincidem');
          setIsLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName,
            }
          }
        });
        
        if (error) throw error;
        toast.success('Conta criada! Verifique seu email.');
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        toast.success('Login realizado!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <SEOHead
        title={mode === 'signup' ? 'Criar Conta | Nello Flow' : 'Entrar | Nello Flow'}
        description="Acesse sua conta Nello Flow e transforme ideias em ação."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />
        
        <div className="w-full max-w-md relative z-10">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-white">Nello Flow</span>
          </div>
          
          {/* Card */}
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-white mb-2">
              {mode === 'signup' ? 'Crie sua conta' : 'Bem-vindo de volta'}
            </h1>
            <p className="text-slate-400 mb-6">
              {mode === 'signup' 
                ? 'Comece sua jornada de produtividade' 
                : 'Entre para continuar sua jornada'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                    placeholder="Seu nome"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === 'signup' && <PasswordStrengthIndicator password={password} />}
              </div>
              
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white py-6"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === 'signup' ? 'Criar conta' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              {mode === 'signup' ? (
                <p className="text-slate-400">
                  Já tem conta?{' '}
                  <button 
                    onClick={() => setMode('login')}
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Entrar
                  </button>
                </p>
              ) : (
                <p className="text-slate-400">
                  Não tem conta?{' '}
                  <button 
                    onClick={() => setMode('signup')}
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Criar conta
                  </button>
                </p>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-8">
            Parte da família{' '}
            <a href="https://nello.one" className="text-violet-400 hover:text-violet-300">Nello</a>
          </p>
        </div>
      </div>
    </>
  );
}
