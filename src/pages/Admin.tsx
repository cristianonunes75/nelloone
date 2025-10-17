import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Admin = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container px-4 py-4 flex items-center justify-between">
          <img src={logo} alt="Essentia" className="h-10" />
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </div>
      </header>

      <main className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Painel Administrativo
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Controle total do sistema Essentia.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Usuários</h2>
              <p className="text-muted-foreground mb-4">
                Gerenciar cadastros e roles.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Sessões</h2>
              <p className="text-muted-foreground mb-4">
                Controlar agendamentos.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Pagamentos</h2>
              <p className="text-muted-foreground mb-4">
                Acompanhar transações.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Promoções</h2>
              <p className="text-muted-foreground mb-4">
                Gerenciar cupons e ofertas.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Testes</h2>
              <p className="text-muted-foreground mb-4">
                Visualizar relatórios.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Acessos</h2>
              <p className="text-muted-foreground mb-4">
                Liberar fotógrafos e clientes.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
