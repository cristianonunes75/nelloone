import { useMemo } from 'react';
import { ExternalLink, Lock, Sparkles, Heart, Compass, Users, Shield } from 'lucide-react';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { useMySpaceTeam } from '../hooks/useMySpaceTeam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { buildWorkLens, buildConnectFrase } from '../lib/essenceLens';
import { GENTLE_VOCABULARY } from '../lib/gentleVocabulary';

function getFirstName(name: string) {
  return name.split(' ')[0] || name;
}

function PhaseAnchor() {
  return (
    <p className="text-xs italic text-muted-foreground border-l-2 border-primary/30 pl-3">
      {GENTLE_VOCABULARY.phaseAnchor}
    </p>
  );
}

function PrivacyCard() {
  return (
    <Alert className="bg-muted/40">
      <Shield className="h-4 w-4" />
      <AlertDescription className="text-xs">
        {GENTLE_VOCABULARY.privacyNote}
      </AlertDescription>
    </Alert>
  );
}

export default function BusinessMySpace() {
  const { user, company } = useBusinessAuth();
  const { rows, self, isLoading } = useMySpaceTeam(company?.id);

  const firstName = useMemo(() => {
    const fromMeta = (user?.user_metadata as { full_name?: string } | undefined)?.full_name;
    return fromMeta ? getFirstName(fromMeta) : self ? getFirstName(self.full_name) : 'olá';
  }, [user, self]);

  const colleagues = useMemo(() => rows.filter((r) => !r.is_self), [rows]);

  const lens = useMemo(() => {
    if (!self?.has_essence_code) return null;
    return buildWorkLens(self.snapshot, self.job_title);
  }, [self]);

  const identityUrl = company?.id ? `/cliente?company=${company.id}` : '/cliente';

  return (
    <BusinessLayout>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Meu espaço</p>
            <h1 className="text-2xl font-semibold text-foreground">Olá, {firstName}</h1>
            {company && (
              <p className="text-sm text-muted-foreground">{company.name}</p>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={identityUrl}>
              <ExternalLink className="w-4 h-4 mr-2" /> Ver meu Identity
            </a>
          </Button>
        </header>

        <Tabs defaultValue="meu-codigo" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="meu-codigo">Meu Código</TabsTrigger>
            <TabsTrigger value="no-trabalho">No trabalho</TabsTrigger>
            <TabsTrigger value="minha-equipe">Minha equipe</TabsTrigger>
          </TabsList>

          {/* ============ ABA 1: MEU CÓDIGO ============ */}
          <TabsContent value="meu-codigo" className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !self?.has_essence_code ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Seu Código da Essência ainda não está completo
                  </CardTitle>
                  <CardDescription>
                    Para ver sua leitura pessoal aqui no Business, finalize sua jornada no Nello Identity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <a href={identityUrl}>
                      Gerar meu Código no Identity <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Seu Código — resumo
                    </CardTitle>
                    <CardDescription>
                      Este é um espelho curto do seu Código da Essência. O relatório completo mora no seu Identity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <SnapshotTile label="Modo de contribuição" value={self.snapshot.leadershipMode} />
                      <SnapshotTile label="Temperamento" value={self.snapshot.temperament} />
                      <SnapshotTile label="Arquétipo" value={self.snapshot.archetypePrimary} />
                      <SnapshotTile label="Estilo de conexão" value={self.snapshot.connectionStyle} />
                    </div>
                    <PhaseAnchor />
                    <Button variant="outline" asChild>
                      <a href={identityUrl}>
                        Ver meu relatório completo <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
                <PrivacyCard />
              </>
            )}
          </TabsContent>

          {/* ============ ABA 2: NO TRABALHO ============ */}
          <TabsContent value="no-trabalho" className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-96 w-full" />
            ) : !lens ? (
              <Alert>
                <AlertDescription>
                  Para ver a leitura aplicada ao seu trabalho, finalize seu Código no{' '}
                  <a href={identityUrl} className="underline font-medium">Nello Identity</a>.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <PhaseAnchor />
                <LensBlock
                  icon={<Sparkles className="w-4 h-4 text-amber-500" />}
                  title={GENTLE_VOCABULARY.shine}
                  items={lens.shine}
                />
                <LensBlock
                  icon={<Compass className="w-4 h-4 text-blue-500" />}
                  title={GENTLE_VOCABULARY.weight}
                  items={lens.weight}
                />
                <LensBlock
                  icon={<Heart className="w-4 h-4 text-rose-500" />}
                  title={GENTLE_VOCABULARY.helpYou}
                  items={lens.helpYou}
                />
                <LensBlock
                  icon={<Users className="w-4 h-4 text-emerald-500" />}
                  title={GENTLE_VOCABULARY.askTeam}
                  items={lens.askTeam}
                />
                <PrivacyCard />
              </>
            )}
          </TabsContent>

          {/* ============ ABA 3: MINHA EQUIPE ============ */}
          <TabsContent value="minha-equipe" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Uma forma simples de se conectar melhor com cada colega. Aqui você só vê o resumo de quem
              autorizou compartilhar com a equipe.
            </p>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : colleagues.length === 0 ? (
              <Alert><AlertDescription>Você ainda é a única pessoa cadastrada nesta equipe.</AlertDescription></Alert>
            ) : (
              <div className="grid gap-3">
                {colleagues.map((c) => (
                  <Card key={c.user_id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">{c.full_name}</CardTitle>
                          {c.job_title && (
                            <CardDescription className="text-xs">{c.job_title}</CardDescription>
                          )}
                        </div>
                        {c.is_private ? (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Lock className="w-3 h-3" /> {GENTLE_VOCABULARY.privateProfile}
                          </Badge>
                        ) : c.has_essence_code ? (
                          <Badge variant="secondary" className="text-xs">{c.snapshot.leadershipMode || 'Em construção'}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Código incompleto</Badge>
                        )}
                      </div>
                    </CardHeader>
                    {!c.is_private && c.has_essence_code && (
                      <CardContent className="pt-0">
                        <p className="text-sm">{buildConnectFrase(getFirstName(c.full_name), c.snapshot)}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
            <PrivacyCard />
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}

function SnapshotTile({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-lg border bg-background/60 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground capitalize">{value || '—'}</p>
    </div>
  );
}

function LensBlock({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">{icon}{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm leading-relaxed">
          {items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
