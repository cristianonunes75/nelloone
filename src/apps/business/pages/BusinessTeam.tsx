import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, UserPlus, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessLayout } from '../components/BusinessLayout';
import { TeamMembersTab } from '../components/TeamMembersTab';
import { TeamInviteTab } from '../components/TeamInviteTab';
import { InviteHistory } from '../components/InviteHistory';
import { useBusinessAuth } from '../hooks/useBusinessAuth';

export default function BusinessTeam() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'members';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { company } = useBusinessAuth();

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe, envie convites e acompanhe o progresso dos colaboradores
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="members" className="gap-1.5">
              <Users className="w-4 h-4" /> Membros
            </TabsTrigger>
            <TabsTrigger value="invite" className="gap-1.5">
              <UserPlus className="w-4 h-4" /> Convidar
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5">
              <History className="w-4 h-4" /> Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-6">
            <TeamMembersTab />
          </TabsContent>

          <TabsContent value="invite" className="mt-6">
            <TeamInviteTab />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {company && <InviteHistory companyId={company.id} />}
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}
