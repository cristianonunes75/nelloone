import { LogoText } from "@/components/LogoText";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

export const FooterSection = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const footerLinks = {
    produto: language === 'en' ? [
      { label: "Archetypes Test", href: "/auth" },
      { label: "NELLO IDENTITY Map", href: "/auth" },
      { label: "Pricing", href: "#precos" },
    ] : [
      { label: "Teste de Arquétipos", href: "/auth" },
      { label: "Mapa NELLO IDENTITY", href: "/auth" },
      { label: "Preços", href: "#precos" },
    ],
    empresa: language === 'en' ? [
      { label: "About", href: "#jornada" },
      { label: "Contact", href: "/contato" },
    ] : [
      { label: "Sobre", href: "#jornada" },
      { label: "Contato", href: "/contato" },
    ],
    legal: [
      { label: t.landing.footer.links.terms, href: "/termos-de-servico" },
      { label: t.landing.footer.links.privacy, href: "/politica-de-privacidade" },
    ],
  };

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
    <footer className="py-10 md:py-16 bg-bruma-light/50 border-t border-bruma-deep/20">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="col-span-2 md:col-span-1">
              <LogoText className="text-lg md:text-xl mb-3 md:mb-4" variant="solid" />
              <p className="text-xs md:text-sm text-ink-blue/60 leading-relaxed">
                NELLO IDENTITY
              </p>
              <p className="text-[10px] md:text-xs text-ink-blue/40 mt-2">
                {language === 'en' ? 'Part of the Nello ecosystem' : 'Parte do ecossistema Nello'}
              </p>
              <div className="mt-4">
                <LanguageToggle />
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-medium text-ink-blue text-xs md:text-sm mb-3 md:mb-4">
                {language === 'en' ? 'Product' : 'Produto'}
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-xs md:text-sm text-ink-blue/60 hover:text-ink-blue transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-ink-blue text-xs md:text-sm mb-3 md:mb-4">
                {language === 'en' ? 'Company' : 'Empresa'}
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-xs md:text-sm text-ink-blue/60 hover:text-ink-blue transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-medium text-ink-blue text-xs md:text-sm mb-3 md:mb-4">
                {language === 'en' ? 'Legal' : 'Legal'}
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs md:text-sm text-ink-blue/60 hover:text-ink-blue transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 md:pt-8 border-t border-bruma-deep/20 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-[10px] md:text-xs text-ink-blue/50 text-center md:text-left">
              © {new Date().getFullYear()} Nello Identity — {language === 'en' ? 'Part of the Nello ecosystem' : 'Parte do ecossistema Nello'}
            </p>
            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-ink-blue/50">
              <Link to="/termos-de-servico" className="hover:text-ink-blue transition-colors">
                {language === 'en' ? 'Terms' : 'Termos'}
              </Link>
              <span>•</span>
              <Link to="/politica-de-privacidade" className="hover:text-ink-blue transition-colors">
                {language === 'en' ? 'Privacy' : 'Privacidade'}
              </Link>
              <span>•</span>
              <Link to="/contato" className="hover:text-ink-blue transition-colors">
                {language === 'en' ? 'Contact' : 'Contato'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
