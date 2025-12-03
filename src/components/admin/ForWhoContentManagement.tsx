import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const iconOptions = ["Heart", "Target", "Lightbulb", "Sparkles", "Award", "Users", "Zap", "Star"];

interface Profile {
  icon: string;
  title: string;
  description: string;
}

export const ForWhoContentManagement = () => {
  const { content, isLoading, updateContent, isUpdating } = useHomeContent("for_who");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (content?.content) {
      setTitle(content.title);
      setDescription((content.content as any).description || "");
      setProfiles((content.content as any).profiles || []);
    }
  }, [content]);

  const handleAddProfile = () => {
    setProfiles([...profiles, { icon: "Heart", title: "", description: "" }]);
  };

  const handleRemoveProfile = (index: number) => {
    setProfiles(profiles.filter((_, i) => i !== index));
  };

  const handleProfileChange = (index: number, field: keyof Profile, value: string) => {
    const newProfiles = [...profiles];
    newProfiles[index] = { ...newProfiles[index], [field]: value };
    setProfiles(newProfiles);
  };

  const handleSave = () => {
    updateContent({
      title,
      content: {
        description,
        profiles: profiles.filter(p => p.title.trim() !== ""),
      } as any,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar "Para Quem é o NELLO ONE"</CardTitle>
        <CardDescription>
          Gerencie os perfis de público-alvo exibidos nesta seção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Para quem é o"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Perfis</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddProfile}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Perfil
            </Button>
          </div>

          {profiles.map((profile, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Ícone</Label>
                    <Select
                      value={profile.icon}
                      onValueChange={(value) => handleProfileChange(index, "icon", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <Label>Título</Label>
                    <Input
                      value={profile.title}
                      onChange={(e) => handleProfileChange(index, "title", e.target.value)}
                      placeholder="Ex: Líderes Espirituais"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProfile(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <Label>Descrição</Label>
                <Input
                  value={profile.description}
                  onChange={(e) => handleProfileChange(index, "description", e.target.value)}
                  placeholder="Ex: Padres, pastores, missionários..."
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="gap-2 bg-gold hover:bg-gold-dark"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};