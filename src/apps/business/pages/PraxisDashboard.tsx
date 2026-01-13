import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  MoreVertical,
  Clock,
  DollarSign,
  TrendingUp,
  Sparkles,
  Settings,
  LogOut,
  Bell,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { usePraxisAuth } from '../hooks/usePraxisAuth';
import { usePraxisClients } from '../hooks/usePraxisClients';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PraxisClientDialog } from '../components/PraxisClientDialog';

export default function PraxisDashboard() {
  const { signOut } = useAuth();
  const { professionalProfile, isLoading: profileLoading } = usePraxisAuth();
  const { clients, activeClients, isLoading: clientsLoading } = usePraxisClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);

  const filteredClients = activeClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalSessions = clients.reduce((acc, c) => acc + c.total_sessions, 0);
  const upcomingSessions = 3; // TODO: calculate from sessions
  const monthlyRevenue = 4500; // TODO: calculate from financial records

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Praxis</span>
              <Badge variant="secondary" className="text-xs">
                {professionalProfile?.subscription_tier || 'Trial'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={professionalProfile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm">
                        {professionalProfile?.business_name?.[0] || 'P'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{professionalProfile?.business_name || 'Minha Prática'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{professionalProfile?.specialty}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/praxis/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Olá, {professionalProfile?.business_name || 'Profissional'}!
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                  <p className="text-2xl font-bold">{activeClients.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessões Hoje</p>
                  <p className="text-2xl font-bold">{upcomingSessions}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessões</p>
                  <p className="text-2xl font-bold">{totalSessions}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Este Mês</p>
                  <p className="text-2xl font-bold">R$ {monthlyRevenue.toLocaleString('pt-BR')}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Meus Clientes</CardTitle>
                <CardDescription>Gerencie seus clientes e sessões</CardDescription>
              </div>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-600"
                onClick={() => setShowAddClient(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Client List */}
            {clientsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente ainda'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Tente outra busca' 
                    : 'Adicione seu primeiro cliente para começar'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowAddClient(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar cliente
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredClients.map((client) => (
                  <Link
                    key={client.id}
                    to={`/praxis/clients/${client.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors group"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={client.photo_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-amber-700">
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{client.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {client.total_sessions} sessões
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {client.email || 'Sem email'}
                      </p>
                    </div>

                    <div className="text-right hidden sm:block">
                      {client.last_session_at && (
                        <p className="text-xs text-muted-foreground">
                          Última sessão: {format(new Date(client.last_session_at), "d 'de' MMM", { locale: ptBR })}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Client Dialog */}
      <PraxisClientDialog
        open={showAddClient}
        onOpenChange={setShowAddClient}
      />
    </div>
  );
}
