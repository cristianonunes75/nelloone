import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Camera, Loader2, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhotoUploadWithConsentProps {
  userId: string;
  currentAvatarUrl?: string | null;
  fullName: string;
  onAvatarChange: (newUrl: string | null) => void;
}

const CONSENT_TEXT = `Seu nome e, se desejar, sua foto, são utilizados apenas para facilitar a escuta pastoral e o reconhecimento humano dentro desta experiência.

A foto não é obrigatória, não é utilizada para qualquer tipo de análise e pode ser removida a qualquer momento.`;

export function PhotoUploadWithConsent({ 
  userId, 
  currentAvatarUrl, 
  fullName,
  onAvatarChange 
}: PhotoUploadWithConsentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleOpenDialog = () => {
    setHasConsented(false);
    setIsDialogOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido', {
        description: 'Por favor, selecione uma imagem.'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande', {
        description: 'O tamanho máximo é 5MB.'
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/avatars/')[1]?.split('?')[0];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarChange(`${publicUrl}?t=${Date.now()}`);
      setIsDialogOpen(false);
      
      toast.success('Foto atualizada!', {
        description: 'Sua foto foi salva com sucesso.'
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error('Erro no upload', {
        description: error.message
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsRemoving(true);

    try {
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/avatars/')[1]?.split('?')[0];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (error) throw error;

      onAvatarChange(null);
      setIsDialogOpen(false);

      toast.success('Foto removida', {
        description: 'Sua foto foi removida com sucesso.'
      });
    } catch (error: any) {
      console.error('Avatar remove error:', error);
      toast.error('Erro ao remover', {
        description: error.message
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar className="w-24 h-24 border-2 border-amber-200/50 shadow-sm">
            <AvatarImage src={currentAvatarUrl || undefined} alt={fullName} />
            <AvatarFallback className="text-2xl bg-amber-100 text-amber-800 font-serif">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full w-8 h-8 shadow-md bg-amber-100 hover:bg-amber-200 border border-amber-200"
            onClick={handleOpenDialog}
          >
            <Camera className="w-4 h-4 text-amber-700" />
          </Button>
        </div>
        
        <p className="text-xs text-amber-700/60 text-center max-w-[200px]">
          Clique na câmera para adicionar ou alterar sua foto
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-amber-50/95 border-amber-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-amber-900">
              {currentAvatarUrl ? 'Gerenciar sua foto' : 'Adicionar sua foto'}
            </DialogTitle>
            <DialogDescription className="text-amber-700/80">
              A foto é opcional e pode ser removida a qualquer momento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Consent Text */}
            <div className="bg-white/60 rounded-lg p-4 border border-amber-100">
              <p className="text-sm text-amber-800 whitespace-pre-line leading-relaxed">
                {CONSENT_TEXT}
              </p>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="photo-consent"
                checked={hasConsented}
                onCheckedChange={(checked) => setHasConsented(checked === true)}
                className="mt-0.5 border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <Label 
                htmlFor="photo-consent" 
                className="text-sm text-amber-800 cursor-pointer leading-relaxed"
              >
                Li e compreendo que minha foto é utilizada apenas para reconhecimento humano e pode ser removida a qualquer momento.
              </Label>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={!hasConsented || isUploading}
                className="w-full bg-amber-700 hover:bg-amber-800"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {currentAvatarUrl ? 'Alterar foto' : 'Enviar foto'}
                  </>
                )}
              </Button>

              {currentAvatarUrl && (
                <Button
                  variant="outline"
                  onClick={handleRemovePhoto}
                  disabled={isRemoving}
                  className="w-full border-red-200 text-red-700 hover:bg-red-50"
                >
                  {isRemoving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removendo...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover foto
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
