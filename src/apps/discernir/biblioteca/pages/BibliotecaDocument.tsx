import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2, StickyNote } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useBibliotecaAccess } from '../contexts/BibliotecaAccessContext';
import { useBibliotecaDocument, useBibliotecaPages } from '../hooks/useBibliotecaData';
import { BibliotecaPageItem } from '../components/BibliotecaPageItem';

export function BibliotecaDocument() {
  const { id } = useParams<{ id: string }>();
  const { canEdit } = useBibliotecaAccess();
  const { document: doc, updateDocument } = useBibliotecaDocument(id ?? null);
  const { pages, isLoading, capturePage, updatePage, retranscribe, deletePage } =
    useBibliotecaPages(id ?? null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);

  const docNotes = notes ?? doc?.notes ?? '';

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setCapturing(true);
    try {
      let ok = 0;
      let pend = 0;
      for (const f of files) {
        const r = await capturePage(f);
        if (r.transcribed) ok++;
        else pend++;
      }
      toast.success(
        `${ok + pend} página(s) adicionada(s)${pend ? `, ${pend} sem transcrição (tente "transcrever de novo")` : ''}.`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao adicionar página');
    } finally {
      setCapturing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateDocument({ notes: docNotes });
      toast.success('Anotações salvas');
      setNotes(null);
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao salvar');
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-3 pb-24">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1 text-sm text-amber-700"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div>
        <h2 className="font-serif text-lg font-semibold text-amber-900">{doc?.title ?? 'Documento'}</h2>
        {doc?.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
      </div>

      {/* Anotacoes do documento */}
      {canEdit && (
        <Card className="border-amber-200/70 bg-amber-50/40">
          <CardContent className="space-y-2 p-3">
            <div className="flex items-center gap-1.5 text-sm font-medium text-amber-900">
              <StickyNote className="h-4 w-4" /> Anotações do documento
            </div>
            <Textarea
              value={docNotes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anotações gerais, referências cruzadas, observações..."
              className="text-sm"
            />
            {notes !== null && notes !== (doc?.notes ?? '') && (
              <Button size="sm" className="bg-amber-700 hover:bg-amber-800" onClick={saveNotes} disabled={savingNotes}>
                {savingNotes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar anotações
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Captura */}
      {canEdit && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <Button
            className="w-full bg-amber-700 hover:bg-amber-800"
            onClick={() => inputRef.current?.click()}
            disabled={capturing}
          >
            {capturing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lendo e transcrevendo...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" /> Adicionar página (foto)
              </>
            )}
          </Button>
        </>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-7 w-7 animate-spin text-amber-700" />
        </div>
      ) : pages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma página ainda. Tire uma foto da primeira página para transcrever.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {pages.map((p) => (
            <BibliotecaPageItem
              key={p.id}
              page={p}
              canEdit={canEdit}
              onUpdate={updatePage}
              onRetranscribe={retranscribe}
              onDelete={deletePage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
