import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-12">
      <header className="w-full max-w-[480px] text-center pb-6">
        <img 
          src={logo} 
          alt="Logo Essentia" 
          className="max-w-[140px] mx-auto mb-2"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          Bem-vindo à Essentia
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground mb-6">
          Uma nova forma de conectar imagem, propósito e identidade. Descubra nosso ensaio fotográfico com propósito e viva a experiência que transforma sua essência em imagem.
        </p>
      </header>

      <section className="bg-accent/30 border border-border rounded-2xl p-6 max-w-[480px] w-full mb-6 text-center">
        <h2 className="text-xl font-semibold mb-3">
          Miniensaio "Essência com Propósito"
        </h2>
        <p className="text-sm mb-5 text-muted-foreground">
          Seu ensaio profissional com identidade, espiritualidade e visão de futuro. Em até 3x de R$ 99,00.
        </p>
        <Button size="lg" className="w-full sm:w-auto">
          Agendar agora
        </Button>
      </section>

      <section className="max-w-[480px] w-full mt-3 text-center">
        <p className="text-sm mb-2 text-muted-foreground">
          Já é cliente Essentia?
        </p>
        <a href="#" className="text-foreground font-semibold underline hover:text-primary transition-colors">
          Acesse sua área reservada
        </a>
      </section>

      <footer className="text-sm text-muted-foreground mt-6 text-center">
        © 2025 Essentia. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Index;
