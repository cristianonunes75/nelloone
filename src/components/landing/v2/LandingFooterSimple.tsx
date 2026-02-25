import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Link } from "react-router-dom";

export const LandingFooterSimple = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <footer className="py-12 md:py-16 border-t border-border/40 bg-background">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <span className="font-serif text-lg font-bold text-foreground">NELLO</span>
                <span className="font-serif text-lg font-light text-nello-gold">IDENTITY</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {isEn
                  ? 'Discover how you work through a guided self-knowledge journey.'
                  : 'Descubra como você funciona através de uma jornada guiada de autoconhecimento.'}
              </p>
              <LanguageToggle variant="minimal" />
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                {isEn ? 'Support' : 'Suporte'}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to={isEn ? '/en/help' : '/ajuda'} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {isEn ? 'Help Center' : 'Central de Ajuda'}
                  </Link>
                </li>
                <li>
                  <a href="mailto:suporte@nello.one" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {isEn ? 'Contact' : 'Contato'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/termos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {isEn ? 'Terms of Use' : 'Termos de Uso'}
                  </Link>
                </li>
                <li>
                  <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {isEn ? 'Privacy & LGPD' : 'Privacidade e LGPD'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} Nello One. {isEn ? 'All rights reserved.' : 'Todos os direitos reservados.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
