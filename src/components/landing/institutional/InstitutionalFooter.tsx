import { LogoText } from "@/components/LogoText";
import { Link } from "react-router-dom";
import { Sparkles, ExternalLink } from "lucide-react";

const ecosystemLinks = [
  { name: 'Identity', url: 'https://identity.nello.one' },
  { name: 'Life', url: 'https://life.nello.one' },
  { name: 'Flow', url: 'https://flow.nello.one' },
  { name: 'Hiring', url: 'https://business.nello.one' },
  { name: 'Praxis', url: 'https://business.nello.one/praxis' },
];

const institutionalLinks = [
  { name: 'Sobre', href: '#ecossistema' },
  { name: 'Investidores', href: '#investidor' },
  { name: 'Contato', href: 'mailto:contato@nello.one' },
];

const legalLinks = [
  { name: 'Termos de Uso', href: '/termos-de-servico' },
  { name: 'Privacidade', href: '/politica-de-privacidade' },
];

export const InstitutionalFooter = () => {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.startsWith("mailto:")) {
      window.location.href = href;
    }
  };

  return (
    <footer className="py-12 md:py-16 bg-muted/50 border-t border-border/50">
      <div className="container px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-14">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <LogoText className="text-lg md:text-xl mb-3 md:mb-4" variant="solid" />
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4">
                Uma Vida. Um Ecossistema.
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground/60">
                A inteligência que integra sua essência, sua fé e seu impacto no mundo.
              </p>
            </div>

            {/* Ecossistema */}
            <div>
              <h4 className="font-medium text-foreground text-xs md:text-sm mb-3 md:mb-4 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-nello-gold" />
                Ecossistema
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {ecosystemLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.name}
                      <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Institucional */}
            <div>
              <h4 className="font-medium text-foreground text-xs md:text-sm mb-3 md:mb-4">
                Institucional
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {institutionalLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-medium text-foreground text-xs md:text-sm mb-3 md:mb-4">
                Legal
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Seal */}
          <div className="text-center py-6 border-t border-border/50 mb-6">
            <p className="text-sm md:text-base text-foreground/70 font-display italic">
              "Vida de dentro para fora. Com Cristo no centro."
            </p>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-[10px] md:text-xs text-muted-foreground/60 text-center md:text-left">
              © {new Date().getFullYear()} Nello One — Todos os direitos reservados
            </p>
            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-muted-foreground/60">
              <Link to="/termos-de-servico" className="hover:text-foreground transition-colors">
                Termos
              </Link>
              <span>•</span>
              <Link to="/politica-de-privacidade" className="hover:text-foreground transition-colors">
                Privacidade
              </Link>
              <span>•</span>
              <a href="mailto:contato@nello.one" className="hover:text-foreground transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
