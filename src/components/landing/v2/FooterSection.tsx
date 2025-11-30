import { LogoText } from "@/components/LogoText";
import { Link } from "react-router-dom";

export const FooterSection = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo & tagline */}
            <div className="text-center md:text-left">
              <LogoText className="text-2xl mb-2" variant="solid" />
              <p className="text-sm text-muted-foreground">
                Descubra quem você realmente é.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link 
                to="/termos-de-servico" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Termos de Uso
              </Link>
              <Link 
                to="/politica-de-privacidade" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidade
              </Link>
              <a 
                href="mailto:contato@essentia.com.br" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contato
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Essentia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
