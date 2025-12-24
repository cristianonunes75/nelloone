import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, LogOut, Plus, Target, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { SEOHead } from '@/components/SEOHead';

/**
 * Nello Flow Dashboard
 * Área principal do app para usuários autenticados
 */
export default function FlowDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Até logo!');
    navigate('/');
  };
  
  return (
    <>
      <SEOHead
        title="Dashboard | Nello Flow"
        description="Seu painel de produtividade e foco."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Nav */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">Nello Flow</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm hidden sm:block">
                {user?.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          {/* Welcome */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">
              Olá! 👋
            </h1>
            <p className="text-slate-400">
              Pronto para transformar ideias em ação?
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <button className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-colors text-left group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
                <Plus className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Nova Ideia</h3>
              <p className="text-slate-400 text-sm">Capture uma ideia para processar</p>
            </button>
            
            <button className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors text-left group">
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                <Target className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Foco do Dia</h3>
              <p className="text-slate-400 text-sm">Defina sua prioridade</p>
            </button>
            
            <button className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors text-left group">
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Timer Flow</h3>
              <p className="text-slate-400 text-sm">Sessão de foco profundo</p>
            </button>
            
            <button className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors text-left group">
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Mentor IA</h3>
              <p className="text-slate-400 text-sm">Converse com seu mentor</p>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Ideias capturadas</h3>
                <Target className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-4xl font-bold text-white">0</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Tarefas concluídas</h3>
                <CheckCircle2 className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-4xl font-bold text-white">0</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Tempo em Flow</h3>
                <Clock className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-4xl font-bold text-white">0h</p>
            </div>
          </div>
          
          {/* Empty State */}
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Comece sua jornada FLOW
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Capture sua primeira ideia ou defina o foco do dia para começar a transformar pensamentos em ação.
            </p>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Capturar primeira ideia
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
