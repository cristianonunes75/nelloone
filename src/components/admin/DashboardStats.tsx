import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, Calendar, FileText, Image } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalSessions: number;
  totalTests: number;
  totalGalleries: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSessions: 0,
    totalTests: 0,
    totalGalleries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResult, sessionsResult, testsResult, galleriesResult] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("photo_sessions").select("id", { count: "exact", head: true }),
        supabase.from("user_tests").select("id", { count: "exact", head: true }),
        supabase.from("photo_galleries").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalSessions: sessionsResult.count || 0,
        totalTests: testsResult.count || 0,
        totalGalleries: galleriesResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Usuários Cadastrados",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Sessões Agendadas",
      value: stats.totalSessions,
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Testes Realizados",
      value: stats.totalTests,
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Galerias Criadas",
      value: stats.totalGalleries,
      icon: Image,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
          <p className="text-3xl font-bold">
            {loading ? "..." : stat.value}
          </p>
        </Card>
      ))}
    </div>
  );
};
