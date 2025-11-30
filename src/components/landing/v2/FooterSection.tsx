import { LogoText } from "@/components/LogoText";
import { useNavigate, Link } from "react-router-dom";

const footerLinks = {
  produto: [
    { label: "Teste de Arquétipos", href: "/auth" },
    { label: "Mapa da Essência", href: "/auth" },
    { label: "Preços", href: "#precos" },
  ],
  empresa: [
    { label: "Sobre", href: "#jornada" },
    { label: "Contato", href: "mailto:contato@essentia.app" },
  ],
  legal: [
    { label: "Termos de Uso", href: "/termos-de-servico" },
    { label: "Privacidade", href: "/politica-de-privacidade" },
  ],
};

export const FooterSection = () => {
  const navigate = useNavigate();

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.startsWith("mailto:")) {
      window.location.href = href;
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="py-16 bg-soul-light/50 border-t border-border/30">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <LogoText className="text-xl mb-4" variant="solid" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Autoconhecimento que tem alma.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-medium text-foreground text-sm mb-4">Produto</h4>
              <ul className="space-y-2">
                {footerLinks.produto.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground text-sm mb-4">Empresa</h4>
              <ul className="space-y-2">
                {footerLinks.empresa.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Essentia. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Feito com ♡ para quem busca autoconhecimento
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
