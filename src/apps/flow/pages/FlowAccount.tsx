import { User, CreditCard, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { FlowLayout } from '../components/FlowLayout';
import { useAuth } from '@/hooks/useAuth';
import { useFlowProfile } from '../hooks/useFlowProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function FlowAccount() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading } = useFlowProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Você saiu da sua conta');
    navigate('/');
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('flow-customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast.error('Erro ao abrir portal de assinatura');
    }
  };

  if (loading) {
    return (
      <FlowLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </FlowLayout>
    );
  }

  return (
    <>
      <SEOHead title="Minha Conta | Nello Flow" description="Gerencie sua conta no Nello Flow" />
      
      <FlowLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <User className="w-7 h-7 text-violet-400" />
              Minha Conta
            </h1>
          </div>

          {/* Profile Info */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Informações</h2>
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 text-sm">Email</span>
                <p className="text-white">{user?.email}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Nome</span>
                <p className="text-white">{user?.user_metadata?.full_name || 'Não informado'}</p>
              </div>
              {profile?.monthly_goal && (
                <div>
                  <span className="text-slate-400 text-sm">Meta mensal</span>
                  <p className="text-white">R$ {profile.monthly_goal.toLocaleString('pt-BR')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Subscription */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-violet-400" />
              Assinatura
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Plano Nello Flow</p>
                    <p className="text-slate-400 text-sm">R$ 49/mês</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                    Ativo
                  </div>
                </div>
              </div>
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="w-full border-slate-700 text-slate-300"
              >
                Gerenciar Assinatura
              </Button>
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </div>
      </FlowLayout>
    </>
  );
}
