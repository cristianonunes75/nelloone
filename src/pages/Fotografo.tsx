import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGalleries } from "@/hooks/useGalleries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, LogOut, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Fotografo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { galleries, isLoading, createGallery, uploadPhoto } = useGalleries();
  const [showNewGallery, setShowNewGallery] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [newGallery, setNewGallery] = useState({ title: "", description: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleCreateGallery = () => {
    createGallery(newGallery);
    setNewGallery({ title: "", description: "" });
    setShowNewGallery(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadPhoto = () => {
    if (uploadFile && selectedGallery) {
      uploadPhoto({
        galleryId: selectedGallery,
        file: uploadFile,
      });
      setUploadFile(null);
      setSelectedGallery(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      draft: "secondary",
      review: "outline",
      published: "default",
      archived: "outline",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Área do Fotógrafo</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Minhas Galerias</h2>
          <Dialog open={showNewGallery} onOpenChange={setShowNewGallery}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Galeria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Galeria</DialogTitle>
                <DialogDescription>
                  Crie uma nova galeria para organizar suas fotos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newGallery.title}
                    onChange={(e) =>
                      setNewGallery({ ...newGallery, title: e.target.value })
                    }
                    placeholder="Ex: Sessão João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newGallery.description}
                    onChange={(e) =>
                      setNewGallery({ ...newGallery, description: e.target.value })
                    }
                    placeholder="Descreva a galeria..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleCreateGallery} className="w-full">
                  Criar Galeria
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {galleries && galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Card key={gallery.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{gallery.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {gallery.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(gallery.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <ImageIcon className="h-4 w-4" />
                    <span>0 fotos</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedGallery(gallery.id)}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload de Fotos
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload de Fotos</DialogTitle>
                        <DialogDescription>
                          Adicione fotos à galeria {gallery.title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="photo">Selecionar Foto</Label>
                          <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </div>
                        {uploadFile && (
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium">{uploadFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                        <Button
                          onClick={handleUploadPhoto}
                          disabled={!uploadFile}
                          className="w-full"
                        >
                          Enviar Foto
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Você ainda não criou nenhuma galeria
              </p>
              <Button onClick={() => setShowNewGallery(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Galeria
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
