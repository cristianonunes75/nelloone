import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Briefcase, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessLayout } from '../components/BusinessLayout';
import { CandidatesByJobTab } from '../components/CandidatesByJobTab';
import { CandidatesDirectTab } from '../components/CandidatesDirectTab';

export default function BusinessCandidates() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'by-job';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidatos</h1>
          <p className="text-muted-foreground">
            Visão unificada de todos os candidatos e avaliações comportamentais
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="by-job" className="gap-1.5">
              <ClipboardList className="w-4 h-4" /> Por Vaga
            </TabsTrigger>
            <TabsTrigger value="direct" className="gap-1.5">
              <Briefcase className="w-4 h-4" /> Avulsos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-job" className="mt-6">
            <CandidatesByJobTab />
          </TabsContent>

          <TabsContent value="direct" className="mt-6">
            <CandidatesDirectTab />
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}
