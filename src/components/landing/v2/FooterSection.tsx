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
    { label: "Contato", href: "/contato" },
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
    <footer className="py-10 md:py-16 bg-soul-light/50 border-t border-soul-sand/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Brand - Full width on mobile */}
            <div className="col-span-2 md:col-span-1">
              <LogoText className="text-lg md:text-xl mb-3 md:mb-4" variant="solid" />
              <p className="text-xs md:text-sm text-miguel-deep/60 leading-relaxed">
                Plataforma de Autoconhecimento Inteligente
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-medium text-miguel-deep text-xs md:text-sm mb-3 md:mb-4">Produto</h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-xs md:text-sm text-miguel-deep/60 hover:text-essentia-gold transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-miguel-deep text-xs md:text-sm mb-3 md:mb-4">Empresa</h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-xs md:text-sm text-miguel-deep/60 hover:text-essentia-gold transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-medium text-miguel-deep text-xs md:text-sm mb-3 md:mb-4">Legal</h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs md:text-sm text-miguel-deep/60 hover:text-essentia-gold transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 md:pt-8 border-t border-soul-sand/30 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-[10px] md:text-xs text-miguel-deep/50 text-center md:text-left">
              © {new Date().getFullYear()} Essentia — Plataforma de Autoconhecimento Inteligente
            </p>
            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-miguel-deep/50">
              <Link to="/termos-de-servico" className="hover:text-essentia-gold transition-colors">
                Termos
              </Link>
              <span>•</span>
              <Link to="/politica-de-privacidade" className="hover:text-essentia-gold transition-colors">
                Privacidade
              </Link>
              <span>•</span>
              <Link to="/contato" className="hover:text-essentia-gold transition-colors">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
