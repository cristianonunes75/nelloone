import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { getNelloAppUrl, NelloApp } from "@/hooks/useSubdomain";

interface NelloGlobalFooterProps {
  currentApp?: NelloApp;
  variant?: 'light' | 'dark';
}

/**
 * Global Footer for the entire Nello ecosystem
 * Used across all 5 modules: Identity, Life, Flow, Business, Praxis
 */
export const NelloGlobalFooter = ({ currentApp = 'identity', variant = 'light' }: NelloGlobalFooterProps) => {
  const { language } = useLanguage();

  const isDark = variant === 'dark';
  
  // Module links with proper URLs
  const moduleLinks = [
    { name: 'NELLO Identity', app: 'identity' as NelloApp, description: language === 'en' ? 'Self-knowledge' : 'Autoconhecimento' },
    { name: 'NELLO Life', app: 'life' as NelloApp, description: language === 'en' ? 'Christian life' : 'Vida cristã' },
    { name: 'NELLO Flow', app: 'flow' as NelloApp, description: language === 'en' ? 'Digital mentor' : 'Mentor digital' },
    { name: 'NELLO Business', app: 'business' as NelloApp, description: language === 'en' ? 'Corporate' : 'Corporativo' },
    { name: 'NELLO Praxis', app: 'business' as NelloApp, href: '/praxis', description: language === 'en' ? 'For professionals' : 'Para profissionais' },
  ];

  // Company links
  const companyLinks = [
    { label: language === 'en' ? 'Our Vision' : 'Nossa Visão', href: 'https://nello.one#ecossistema' },
    { label: language === 'en' ? 'Investors' : 'Investidores', href: 'https://nello.one#investidor' },
    { label: 'WhatsApp', href: 'https://wa.me/5561992430090', external: true },
  ];

  // Legal links
  const legalLinks = [
    { label: language === 'en' ? 'Terms of Use' : 'Termos de Uso', href: '/termos-de-servico' },
    { label: language === 'en' ? 'Privacy' : 'Privacidade', href: '/politica-de-privacidade' },
  ];

  const getModuleUrl = (link: typeof moduleLinks[0]) => {
    if (link.href) {
      return `${getNelloAppUrl(link.app)}${link.href}`;
    }
    return getNelloAppUrl(link.app);
  };

  return (
    <footer className={`py-16 md:py-20 border-t ${
      isDark 
        ? 'bg-nello-graphite border-white/10' 
        : 'bg-background border-border/40'
    }`}>
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-1 mb-3">
                <span className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-ink-deep'}`}>
                  NELLO
                </span>
                <span className={`font-serif text-lg font-light ${isDark ? 'text-white/80' : 'text-ink-deep/80'}`}>
                  ONE
                </span>
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
                {language === 'en' 
                  ? 'One Life. One Ecosystem. The definitive solution for modern life fragmentation.'
                  : 'Uma Vida. Um Ecossistema. A solução definitiva para a fragmentação da vida moderna.'}
              </p>
              <LanguageToggle variant="minimal" />
            </div>

            {/* Modules Column */}
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${
                isDark ? 'text-white' : 'text-foreground'
              }`}>
                {language === 'en' ? 'Modules' : 'Módulos'}
              </h4>
              <ul className="space-y-3">
                {moduleLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={getModuleUrl(link)}
                      className={`text-sm transition-colors ${
                        currentApp === link.app 
                          ? (isDark ? 'text-nello-gold' : 'text-nello-gold font-medium')
                          : (isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground')
                      }`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${
                isDark ? 'text-white' : 'text-foreground'
              }`}>
                {language === 'en' ? 'Company' : 'Empresa'}
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className={`text-sm transition-colors ${
                        isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${
                isDark ? 'text-white' : 'text-foreground'
              }`}>
                Legal
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className={`text-sm transition-colors ${
                        isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'border-white/10' : 'border-border/40'
          }`}>
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-muted-foreground/60'}`}>
              © {new Date().getFullYear()} Nello One. {language === 'en' ? 'All rights reserved.' : 'Todos os direitos reservados.'}
            </p>
            <p className={`text-xs font-serif italic ${isDark ? 'text-white/40' : 'text-muted-foreground/60'}`}>
              {language === 'en' ? 'Life from the inside out.' : 'Vida de dentro para fora.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
