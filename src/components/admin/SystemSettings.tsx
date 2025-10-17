import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string;
}

export const SystemSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configurações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ 
          value: JSON.stringify(value),
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq("key", key);

      if (error) throw error;

      await supabase.rpc("log_audit", {
        p_action: "UPDATE_SETTING",
        p_table_name: "system_settings",
        p_record_id: null,
        p_new_data: { key, value },
      });

      toast({
        title: "Configuração salva",
        description: "A alteração foi registrada com sucesso",
      });
      
      fetchSettings();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderSettingInput = (setting: Setting) => {
    const value = typeof setting.value === 'string' ? setting.value.replace(/"/g, '') : setting.value;
    
    if (typeof setting.value === "boolean") {
      return (
        <Switch
          checked={value}
          onCheckedChange={(checked) => updateSetting(setting.key, checked)}
        />
      );
    }

    return (
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => {
            const newSettings = settings.map(s =>
              s.key === setting.key ? { ...s, value: e.target.value } : s
            );
            setSettings(newSettings);
          }}
        />
        <Button
          size="sm"
          onClick={() => updateSetting(setting.key, value)}
        >
          <Save className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  const categoryNames: Record<string, string> = {
    general: "Geral",
    contact: "Contato",
    social: "Redes Sociais",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Configurações do Sistema</h2>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
      ) : (
        Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <Card key={category} className="p-6">
            <h3 className="text-xl font-semibold mb-4">{categoryNames[category] || category}</h3>
            <div className="space-y-4">
              {categorySettings.map((setting) => (
                <div key={setting.id} className="grid gap-2">
                  <Label>{setting.description}</Label>
                  {renderSettingInput(setting)}
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
