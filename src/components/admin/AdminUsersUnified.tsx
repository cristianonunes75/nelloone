import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Route, BarChart3 } from "lucide-react";
import { AdminUsersJourneys } from "./AdminUsersJourneys";
import { AdminJourneyDashboard } from "./AdminJourneyDashboard";

export const AdminUsersUnified = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Usuários & Jornadas</h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Gerencie usuários, acompanhe jornadas e envie lembretes
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Gestão de Usuários</span>
            <span className="sm:hidden">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="journeys" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard Jornadas</span>
            <span className="sm:hidden">Jornadas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <AdminUsersJourneys hideHeader />
        </TabsContent>

        <TabsContent value="journeys" className="mt-6">
          <AdminJourneyDashboard hideHeader />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsersUnified;
