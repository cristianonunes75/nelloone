import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Fotografo = () => {
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
            Área do Fotógrafo
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie seus clientes e sessões.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Clientes</h2>
              <p className="text-muted-foreground mb-4">
                Visualize perfis e testes dos clientes.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Sessões</h2>
              <p className="text-muted-foreground mb-4">
                Acompanhe agenda e status das sessões.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Upload de Fotos</h2>
              <p className="text-muted-foreground mb-4">
                Envie fotos editadas e previews.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>

            <div className="bg-accent/30 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Recomendações</h2>
              <p className="text-muted-foreground mb-4">
                Envie legendas baseadas nos arquétipos.
              </p>
              <Button variant="outline">Em breve</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Fotografo;
