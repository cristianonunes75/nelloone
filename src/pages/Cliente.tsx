import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Cliente = () => {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo, {user?.user_metadata?.full_name || "Cliente"}!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Esta é sua área exclusiva Essentia.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Meus Testes</h2>
              <p className="text-muted-foreground mb-4">
                Acesse seus testes de autoconhecimento e relatórios personalizados.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Minha Sessão</h2>
              <p className="text-muted-foreground mb-4">
                Agende sua sessão fotográfica e acompanhe o status.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Minhas Fotos</h2>
              <p className="text-muted-foreground mb-4">
                Visualize e baixe suas fotos profissionais.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Meu Perfil</h2>
              <p className="text-muted-foreground mb-4">
                Gerencie suas informações e preferências.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cliente;
