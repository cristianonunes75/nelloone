import { useMemo } from 'react';
import {
  ExternalLink,
  Lock,
  Sparkles,
  Heart,
  Compass,
  Users,
  Shield,
  UserCircle2,
  Flower2,
  HandHeart,
  HeartHandshake,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Store,
  Eye,
  Crown,
  Briefcase,
} from 'lucide-react';
import { BusinessLayout } from '../components/BusinessLayout';
import { useBusinessAuth } from '../hooks/useBusinessAuth';
import { useAuth } from '@/hooks/useAuth';
import { useMySpaceTeam } from '../hooks/useMySpaceTeam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  buildWorkLens,
  buildTeammateDeepConnect,
  buildLeaderOneOnOneLens,
  type EssenceSnapshot,
  type LeaderOneOnOneLens,
} from '../lib/essenceLens';
import { GENTLE_VOCABULARY, getLeadershipRank } from '../lib/gentleVocabulary';

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

function EthicalFooter() {
  return (
    <p className="text-[11px] text-muted-foreground/80 leading-relaxed border-t pt-3 mt-2">
      {GENTLE_VOCABULARY.ethicalFooter}
    </p>
  );
}

export default function BusinessMySpace() {
  const { company } = useBusinessAuth();
  const { user } = useAuth();
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
            {company && <p className="text-sm text-muted-foreground">{company.name}</p>}
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
                <PhaseAnchor />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Seu Código — resumo
                    </CardTitle>
                    <CardDescription>
                      Espelho curto do seu Código da Essência. O relatório completo mora no seu Identity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <SnapshotTile label="Modo de contribuição" value={self.snapshot.leadershipMode} />
                      <SnapshotTile label="Temperamento" value={self.snapshot.temperament} />
                      <SnapshotTile
                        label="Eneagrama"
                        value={
                          self.snapshot.eneagramType
                            ? `Tipo ${self.snapshot.eneagramType}${self.snapshot.eneagramWing ? `w${self.snapshot.eneagramWing}` : ''}`
                            : null
                        }
                      />
                      <SnapshotTile label="Nello16" value={self.snapshot.nello16Code} />
                      <SnapshotTile label="Arquétipo" value={self.snapshot.archetypePrimary} />
                      <SnapshotTile label="Estilo de conexão" value={self.snapshot.connectionStylePrimary} />
                    </div>
                    {self.snapshot.intelligencesTop3.length > 0 && (
                      <div className="rounded-lg border bg-background/60 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Inteligências mais fortes hoje</p>
                        <p className="text-sm font-medium capitalize">
                          {self.snapshot.intelligencesTop3.join(' · ')}
                        </p>
                      </div>
                    )}
                    <Button variant="outline" asChild>
                      <a href={identityUrl}>
                        Ver meu relatório completo <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
                <PrivacyCard />
                <EthicalFooter />
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
                  icon={<UserCircle2 className="w-4 h-4 text-primary" />}
                  title={GENTLE_VOCABULARY.presentation}
                  items={lens.presentation}
                />
                <LensBlock
                  icon={<Flower2 className="w-4 h-4 text-emerald-500" />}
                  title={GENTLE_VOCABULARY.flourish}
                  items={lens.flourish}
                />
                <LensBlock
                  icon={<HeartHandshake className="w-4 h-4 text-rose-500" />}
                  title={GENTLE_VOCABULARY.clientConnection}
                  items={lens.clientConnection}
                />

                {/* Presença ativa — duas colunas: receber / oferecer */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HandHeart className="w-4 h-4 text-pink-500" />
                      {GENTLE_VOCABULARY.activePresence}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      No trabalho, dar o seu melhor também é uma forma de cuidar e ser cuidada — pelo cliente, pelo time e por você mesma.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <PresenceColumn
                      icon={<ArrowDownToLine className="w-4 h-4 text-pink-500" />}
                      title="Como você costuma receber cuidado"
                      items={lens.activePresence.receive}
                    />
                    <PresenceColumn
                      icon={<ArrowUpFromLine className="w-4 h-4 text-emerald-500" />}
                      title="Como você costuma oferecer cuidado"
                      items={lens.activePresence.give}
                    />
                  </CardContent>
                </Card>

                {/* Afinidade com arquétipos de cliente */}
                {(lens.clientAffinity.flowsWith.length > 0 || lens.clientAffinity.asksAwareness.length > 0) && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-500" />
                        Quais clientes fluem mais com você
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Não é regra — é tendência da sua fase. Todo cliente é único.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{GENTLE_VOCABULARY.clientFlow}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {lens.clientAffinity.flowsWith.map((a) => (
                            <Badge key={a} variant="secondary">{a}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{GENTLE_VOCABULARY.clientAwareness}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {lens.clientAffinity.asksAwareness.map((a) => (
                            <Badge key={a} variant="outline">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <LensBlock
                  icon={<Store className="w-4 h-4 text-indigo-500" />}
                  title={GENTLE_VOCABULARY.storeDay}
                  items={lens.storeDayScenes}
                />
                <LensBlock
                  icon={<Eye className="w-4 h-4 text-amber-600" />}
                  title={GENTLE_VOCABULARY.awarenessScenes}
                  items={lens.awarenessScenes}
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
                {lens.isLeadership && lens.leadershipActions.length > 0 ? (
                  <LensBlock
                    icon={<Crown className="w-4 h-4 text-amber-500" />}
                    title={GENTLE_VOCABULARY.leadershipActions}
                    items={lens.leadershipActions}
                  />
                ) : (
                  <LensBlock
                    icon={<Users className="w-4 h-4 text-emerald-500" />}
                    title={GENTLE_VOCABULARY.askTeam}
                    items={lens.askTeam}
                  />
                )}
                <PrivacyCard />
                <EthicalFooter />
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
                  <ColleagueCard
                    key={c.user_id}
                    name={c.full_name}
                    jobTitle={c.job_title}
                    isPrivate={c.is_private}
                    hasCode={c.has_essence_code}
                    snapshot={c.snapshot}
                    selfSnapshot={self?.snapshot ?? null}
                    selfIsLeadership={lens?.isLeadership ?? false}
                  />
                ))}
              </div>
            )}
            <PrivacyCard />
            <EthicalFooter />
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}

function SnapshotTile({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="rounded-lg border bg-background/60 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground capitalize">{value ?? '—'}</p>
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
            <li
              key={i}
              dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function PresenceColumn({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium flex items-center gap-1.5 mb-2">{icon}{title}</p>
      <ul className="space-y-1.5 text-sm leading-relaxed">
        {items.map((item, i) => (
          <li
            key={i}
            dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
          />
        ))}
      </ul>
    </div>
  );
}

function ColleagueCard({
  name,
  jobTitle,
  isPrivate,
  hasCode,
  snapshot,
  selfSnapshot,
  selfIsLeadership,
}: {
  name: string;
  jobTitle: string | null;
  isPrivate: boolean;
  hasCode: boolean;
  snapshot: EssenceSnapshot;
  selfSnapshot: EssenceSnapshot | null;
  selfIsLeadership: boolean;
}) {
  const connect = useMemo(
    () =>
      !isPrivate && hasCode
        ? buildTeammateDeepConnect(snapshot, selfSnapshot, {
            selfIsLeadership,
            otherFirstName: getFirstName(name),
          })
        : null,
    [snapshot, selfSnapshot, isPrivate, hasCode, selfIsLeadership, name],
  );

  const leader1on1: LeaderOneOnOneLens | null = useMemo(() => {
    if (!selfIsLeadership || !hasCode || isPrivate || !selfSnapshot) return null;
    return buildLeaderOneOnOneLens(selfSnapshot, snapshot, getFirstName(name));
  }, [selfIsLeadership, hasCode, isPrivate, selfSnapshot, snapshot, name]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            {jobTitle && <CardDescription className="text-xs">{jobTitle}</CardDescription>}
          </div>
          {isPrivate ? (
            <Badge variant="outline" className="gap-1 text-xs">
              <Lock className="w-3 h-3" /> {GENTLE_VOCABULARY.privateProfile}
            </Badge>
          ) : hasCode ? (
            <Badge variant="secondary" className="text-xs">
              {snapshot.archetypePrimary || snapshot.leadershipMode || 'Em construção'}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">Código incompleto</Badge>
          )}
        </div>
      </CardHeader>
      {connect && (
        <CardContent className="pt-0 space-y-2.5 text-sm">
          <ConnectLine icon={<HeartHandshake className="w-3.5 h-3.5 text-rose-500" />} label={GENTLE_VOCABULARY.openConversation} text={connect.openConversation} />
          <ConnectLine icon={<HandHeart className="w-3.5 h-3.5 text-pink-500" />} label={GENTLE_VOCABULARY.showCare} text={connect.showCare} />
          <ConnectLine icon={<AlertCircle className="w-3.5 h-3.5 text-amber-500" />} label={GENTLE_VOCABULARY.avoidEarly} text={connect.avoidEarly} />
          <div className="pt-2 border-t">
            <ConnectLine icon={<Sparkles className="w-3.5 h-3.5 text-primary" />} label={GENTLE_VOCABULARY.bridge} text={connect.bridge} />
          </div>
          {connect.managementTip && (
            <div className="pt-2 border-t bg-amber-50/40 dark:bg-amber-900/10 -mx-6 px-6 py-2.5">
              <ConnectLine
                icon={<Briefcase className="w-3.5 h-3.5 text-amber-600" />}
                label={GENTLE_VOCABULARY.managementTip}
                text={connect.managementTip}
              />
            </div>
          )}

          {leader1on1 && (
            <div className="mt-3 -mx-6 px-6 py-4 border-t bg-primary/5 space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-primary" />
                <p className="text-xs uppercase tracking-wider font-medium text-primary">
                  {GENTLE_VOCABULARY.leaderOneOnOne}
                </p>
              </div>
              <ConnectLine
                icon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                label={GENTLE_VOCABULARY.leaderBridge}
                text={leader1on1.bridge}
              />
              <ConnectLine
                icon={<AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                label={GENTLE_VOCABULARY.leaderFriction}
                text={leader1on1.friction}
              />
              {leader1on1.adaptPresence.length > 0 && (
                <div className="flex gap-2">
                  <div className="mt-0.5 shrink-0">
                    <Compass className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      {GENTLE_VOCABULARY.leaderAdaptPresence}
                    </p>
                    <ul className="space-y-1.5">
                      {leader1on1.adaptPresence.map((item, i) => (
                        <li
                          key={i}
                          dangerouslySetInnerHTML={{
                            __html: '• ' + item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                          }}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <ConnectLine
                icon={<Briefcase className="w-3.5 h-3.5 text-indigo-600" />}
                label={GENTLE_VOCABULARY.leaderHowFeedback}
                text={leader1on1.howFeedback}
              />
              <ConnectLine
                icon={<HandHeart className="w-3.5 h-3.5 text-pink-500" />}
                label={GENTLE_VOCABULARY.leaderHowRecognize}
                text={leader1on1.howRecognize}
              />
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function ConnectLine({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="flex gap-2">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <p>
        <span className="text-xs uppercase tracking-wide text-muted-foreground mr-2">{label}</span>
        <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      </p>
    </div>
  );
}
