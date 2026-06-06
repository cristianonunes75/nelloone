import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Hit {
  id: string;
  page_number: number;
  transcription: string;
  document: { id: string; title: string } | null;
}

function snippet(text: string, q: string): string {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text.slice(0, 160);
  const start = Math.max(0, i - 60);
  return (start > 0 ? '...' : '') + text.slice(start, i + q.length + 100) + '...';
}

export function BibliotecaBusca() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<Hit[] | null>(null);

  const run = async () => {
    const term = q.trim();
    if (term.length < 2) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('ecc_pages')
        .select('id, page_number, transcription, document:ecc_documents(id, title)')
        .ilike('transcription', `%${term}%`)
        .limit(50);
      if (error) throw error;
      setHits((data || []) as Hit[]);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="font-serif text-lg font-semibold text-amber-900">Buscar nos documentos</h2>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="Palavra ou trecho..."
            className="h-11 pl-9"
            autoFocus
          />
        </div>
        <Button className="h-11 bg-amber-700 hover:bg-amber-800" onClick={run} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
        </Button>
      </div>

      {hits !== null && (
        <p className="text-xs text-muted-foreground">
          {hits.length === 0 ? 'Nada encontrado.' : `${hits.length} resultado(s)`}
        </p>
      )}

      <div className="space-y-2">
        {(hits || []).map((h) => (
          <Link key={h.id} to={`/biblioteca/doc/${h.document?.id ?? ''}`}>
            <Card className="transition-colors hover:bg-amber-50">
              <CardContent className="space-y-1 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">{h.document?.title ?? 'Documento'}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    pág. {h.page_number}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{snippet(h.transcription || '', q)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
