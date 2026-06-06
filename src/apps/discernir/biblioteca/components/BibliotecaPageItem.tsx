import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Trash2, Save, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getSignedUrl } from '../utils/bibliotecaImage';
import type { EccPage } from '../hooks/useBibliotecaData';

interface Props {
  page: EccPage;
  canEdit: boolean;
  onUpdate: (id: string, patch: Partial<EccPage>) => Promise<void>;
  onRetranscribe: (page: EccPage, dataUrl: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'sem transcrição', cls: 'border-amber-300 text-amber-800' },
  transcribed: { label: 'transcrita', cls: 'border-emerald-300 text-emerald-800' },
  reviewed: { label: 'revisada', cls: 'border-sky-300 text-sky-800' },
};

async function urlToDataURL(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

export function BibliotecaPageItem({ page, canEdit, onUpdate, onRetranscribe, onDelete }: Props) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [showImg, setShowImg] = useState(false);
  const [text, setText] = useState(page.transcription ?? '');
  const [notes, setNotes] = useState(page.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getSignedUrl(page.image_path).then((u) => active && setImgUrl(u));
    return () => {
      active = false;
    };
  }, [page.image_path]);

  useEffect(() => {
    setText(page.transcription ?? '');
    setNotes(page.notes ?? '');
  }, [page.id, page.transcription, page.notes]);

  const dirty = text !== (page.transcription ?? '') || notes !== (page.notes ?? '');

  const save = async () => {
    setSaving(true);
    try {
      await onUpdate(page.id, {
        transcription: text,
        notes,
        status: page.status === 'pending' && text ? 'reviewed' : page.status,
      });
      toast.success(`Página ${page.page_number} salva`);
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const retranscribe = async () => {
    if (!imgUrl) return;
    setBusy(true);
    try {
      const dataUrl = await urlToDataURL(imgUrl);
      await onRetranscribe(page, dataUrl);
      toast.success(`Página ${page.page_number} transcrita`);
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao transcrever');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Excluir a página ${page.page_number}?`)) return;
    await onDelete(page.id);
  };

  const st = STATUS[page.status] || STATUS.pending;

  return (
    <Card>
      <CardContent className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-amber-900">Página {page.page_number}</span>
          <Badge variant="outline" className={`text-[10px] ${st.cls}`}>
            {st.label}
          </Badge>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowImg((s) => !s)} title="Ver foto">
              <ImageIcon className="h-4 w-4" />
            </Button>
            {canEdit && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={retranscribe} disabled={busy} title="Transcrever de novo">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            )}
            {canEdit && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={remove} title="Excluir">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {showImg && imgUrl && (
          <img src={imgUrl} alt={`Página ${page.page_number}`} className="max-h-96 w-full rounded-md object-contain" />
        )}

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          readOnly={!canEdit}
          rows={Math.min(18, Math.max(4, Math.ceil((text.length || 0) / 60)))}
          placeholder="Transcrição da página"
          className="text-sm leading-relaxed"
        />

        {canEdit && (
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Suas anotações nesta página (opcional)"
            className="text-sm"
          />
        )}

        {canEdit && dirty && (
          <Button size="sm" className="bg-amber-700 hover:bg-amber-800" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
