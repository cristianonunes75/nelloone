import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileUp,
  Loader2,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMiniMercado } from '../contexts/MiniMercadoContext';
import { useMiniMercadoImport, type ImportTeam } from '../hooks/useMiniMercadoImport';

export function MiniMercadoImport() {
  const navigate = useNavigate();
  const { activeEventId, activeEvent } = useMiniMercado();
  const { parseFiles, commit } = useMiniMercadoImport(activeEventId);
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [parsing, setParsing] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [teams, setTeams] = useState<ImportTeam[] | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const selectedCount = useMemo(
    () =>
      (teams || []).reduce(
        (acc, t) => acc + t.people.filter((p) => p.include).length,
        0
      ),
    [teams]
  );

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files || []));
    setTeams(null);
  };

  const handleParse = async () => {
    if (files.length === 0) {
      toast.error('Escolha um arquivo primeiro');
      return;
    }
    setParsing(true);
    try {
      const res = await parseFiles(files, activeEvent?.movement);
      setTeams(res.teams);
      setWarnings(res.warnings);
      const total = res.teams.reduce((a, t) => a + t.people.length, 0);
      if (total === 0) toast.warning('Nenhuma pessoa identificada. Tente outro arquivo.');
      else toast.success(`${total} pessoas encontradas. Revise antes de salvar.`);
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao ler o arquivo');
    } finally {
      setParsing(false);
    }
  };

  const togglePerson = (ti: number, pi: number) => {
    setTeams((prev) => {
      if (!prev) return prev;
      const next = prev.map((t) => ({ ...t, people: t.people.map((p) => ({ ...p })) }));
      next[ti].people[pi].include = !next[ti].people[pi].include;
      return next;
    });
  };

  const editPerson = (ti: number, pi: number, field: 'name' | 'nickname', value: string) => {
    setTeams((prev) => {
      if (!prev) return prev;
      const next = prev.map((t) => ({ ...t, people: t.people.map((p) => ({ ...p })) }));
      (next[ti].people[pi] as any)[field] = value;
      return next;
    });
  };

  const editTeamName = (ti: number, value: string) => {
    setTeams((prev) => {
      if (!prev) return prev;
      const next = prev.map((t) => ({ ...t }));
      next[ti].name = value;
      return next;
    });
  };

  const toggleTeam = (ti: number, on: boolean) => {
    setTeams((prev) => {
      if (!prev) return prev;
      const next = prev.map((t) => ({ ...t, people: t.people.map((p) => ({ ...p })) }));
      next[ti].people.forEach((p) => (p.include = on));
      return next;
    });
  };

  const handleCommit = async () => {
    if (!teams || selectedCount === 0) {
      toast.error('Selecione ao menos uma pessoa');
      return;
    }
    setCommitting(true);
    try {
      const r = await commit(teams);
      toast.success(
        `${r.inserted} trabalhadores importados${r.linked ? `, ${r.linked} cônjuges vinculados` : ''}.`
      );
      navigate('/mini-mercado/servos');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao importar');
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('/mini-mercado/servos')}
        className="flex items-center gap-1 text-sm text-amber-700"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div>
        <h2 className="font-serif text-lg font-semibold text-amber-900">Importar trabalhadores</h2>
        <p className="text-sm text-muted-foreground">
          Envie o quadrante/escala em PDF, Word ou foto (JPG/PNG). A IA lê e você revisa antes de salvar.
        </p>
      </div>

      {!teams && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png,image/*,application/pdf"
            multiple
            className="hidden"
            onChange={handlePick}
          />
          <Card
            className="cursor-pointer border-dashed border-amber-300"
            onClick={() => inputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <FileUp className="h-8 w-8 text-amber-700" />
              <p className="font-medium text-amber-900">
                {files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : 'Escolher arquivos'}
              </p>
              <p className="text-xs text-muted-foreground">PDF, Word (.docx), JPG ou PNG</p>
            </CardContent>
          </Card>

          {files.length > 0 && (
            <div className="space-y-1">
              {files.map((f, i) => (
                <p key={i} className="truncate text-xs text-muted-foreground">
                  • {f.name}
                </p>
              ))}
            </div>
          )}

          <Button
            className="w-full bg-amber-700 hover:bg-amber-800"
            onClick={handleParse}
            disabled={parsing || files.length === 0}
          >
            {parsing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lendo com IA...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Ler arquivos
              </>
            )}
          </Button>
        </>
      )}

      {teams && (
        <div className="space-y-3 pb-28">
          {warnings.length > 0 && (
            <Card className="border-amber-300 bg-amber-50/60">
              <CardContent className="space-y-1 p-3 text-xs text-amber-800">
                {warnings.map((w, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {w}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          {teams.map((team, ti) => {
            const allOn = team.people.every((p) => p.include);
            return (
              <Card key={ti}>
                <CardContent className="space-y-2 p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 shrink-0 text-amber-700" />
                    <Input
                      value={team.name}
                      onChange={(e) => editTeamName(ti, e.target.value)}
                      className="h-8 flex-1 font-semibold text-amber-900"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => toggleTeam(ti, !allOn)}
                    >
                      {allOn ? 'Desmarcar' : 'Marcar'}
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    {team.people.map((p, pi) => (
                      <div
                        key={pi}
                        className={`flex items-center gap-2 rounded-md border p-2 ${
                          p.include ? '' : 'opacity-45'
                        }`}
                      >
                        <button onClick={() => togglePerson(ti, pi)} className="shrink-0">
                          {p.include ? (
                            <CheckCircle2 className="h-5 w-5 text-amber-700" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        <div className="grid flex-1 grid-cols-2 gap-1.5">
                          <Input
                            value={p.name}
                            onChange={(e) => editPerson(ti, pi, 'name', e.target.value)}
                            placeholder="Nome"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={p.nickname ?? ''}
                            onChange={(e) => editPerson(ti, pi, 'nickname', e.target.value)}
                            placeholder="Como é chamado"
                            className="h-8 text-sm"
                          />
                        </div>
                        {p.kind === 'casal' && (
                          <Badge variant="outline" className="shrink-0 text-[10px]">
                            casal
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* barra fixa */}
          <div className="fixed bottom-16 left-0 right-0 z-30 border-t bg-background/95 p-3 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Selecionados</p>
                <p className="text-lg font-bold text-amber-900">{selectedCount}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setTeams(null);
                  setFiles([]);
                }}
                disabled={committing}
              >
                Recomeçar
              </Button>
              <Button
                className="h-11 bg-amber-700 hover:bg-amber-800"
                onClick={handleCommit}
                disabled={committing || selectedCount === 0}
              >
                {committing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Importar {selectedCount}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
