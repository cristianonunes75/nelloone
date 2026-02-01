import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Shield, 
  ArrowLeft, 
  BookOpen,
  Edit3,
  Save,
  X,
  Lock,
} from 'lucide-react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { SalesPlaybook } from '@/types/leads';
import ReactMarkdown from 'react-markdown';

export const AdminSalesPlaybook = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, hasPermission, isLoading: permissionsLoading } = useAdminPermissions();
  
  const [sections, setSections] = useState<SalesPlaybook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const canManageLeads = isSuperAdmin || hasPermission('can_manage_leads' as any);
  const canEdit = isSuperAdmin;

  useEffect(() => {
    fetchPlaybook();
  }, []);

  const fetchPlaybook = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_playbook')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      setSections((data || []) as SalesPlaybook[]);
    } catch (err) {
      console.error('Error fetching playbook:', err);
      toast.error('Erro ao carregar playbook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (section: SalesPlaybook) => {
    setEditingSection(section.id);
    setEditTitle(section.title);
    setEditContent(section.content);
  };

  const handleSave = async () => {
    if (!editingSection) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('sales_playbook')
        .update({ 
          title: editTitle,
          content: editContent,
        })
        .eq('id', editingSection);
      
      if (error) throw error;
      
      toast.success('Playbook atualizado!');
      setEditingSection(null);
      fetchPlaybook();
    } catch (err) {
      console.error('Error saving playbook:', err);
      toast.error('Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditContent('');
    setEditTitle('');
  };

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canManageLeads) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full border-border/50">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Acesso Restrito</h3>
              <p className="text-muted-foreground text-sm">
                Você não tem permissão para visualizar o playbook.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Playbook de Vendas
          </h1>
          <p className="text-muted-foreground text-sm">
            Guia oficial para a equipe de vendas do Identity
          </p>
        </div>
        {!canEdit && (
          <Badge variant="secondary" className="gap-1">
            <Lock className="w-3 h-3" />
            Somente leitura
          </Badge>
        )}
      </div>

      <Tabs defaultValue={sections[0]?.section_key || 'discurso_base'} className="w-full">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1">
          {sections.map((section) => (
            <TabsTrigger 
              key={section.section_key} 
              value={section.section_key}
              className="text-sm"
            >
              {section.title.split(' ').slice(0, 2).join(' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.section_key} value={section.section_key} className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                {editingSection === section.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="max-w-md font-semibold"
                  />
                ) : (
                  <CardTitle>{section.title}</CardTitle>
                )}
                
                {canEdit && (
                  <div className="flex gap-2">
                    {editingSection === section.id ? (
                      <>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                          <X className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(section)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {editingSection === section.id ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Conteúdo em Markdown..."
                  />
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminSalesPlaybook;
