import { useState } from 'react';
import { BusinessLayout } from '../components/BusinessLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhatsAppContacts } from '../components/whatsapp/WhatsAppContacts';
import { WhatsAppCampaigns } from '../components/whatsapp/WhatsAppCampaigns';
import { MessageCircle, AlertTriangle } from 'lucide-react';

export default function BusinessWhatsApp() {
  const [activeTab, setActiveTab] = useState('contacts');

  return (
    <BusinessLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            Automação WhatsApp
          </h1>
          <p className="text-muted-foreground mt-1">
            Envie mensagens individualizadas em lote via WhatsApp Business API
          </p>
        </div>

        {/* Consent disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Aviso obrigatório sobre consentimento</p>
            <p className="text-muted-foreground mt-1">
              Somente contatos com consentimento explícito podem receber mensagens. 
              Certifique-se de que todos os contatos cadastrados autorizaram o envio de mensagens 
              antes de iniciar uma campanha. O envio sem consentimento viola a LGPD.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-4">
            <WhatsAppContacts />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-4">
            <WhatsAppCampaigns />
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}
