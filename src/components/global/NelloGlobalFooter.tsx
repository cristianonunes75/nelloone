import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { getNelloAppUrl, NelloApp, useSubdomain } from "@/hooks/useSubdomain";
import { useNavigate, useLocation } from "react-router-dom";
import { Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NelloGlobalFooterProps {
  currentApp?: NelloApp;
  variant?: 'light' | 'dark';
}

/**
 * Global Footer for the entire Nello ecosystem (4-column structure)
 * Used across all 5 modules: Identity, Life, Flow, Business, Praxis
 */
export const NelloGlobalFooter = ({ currentApp, variant = 'light' }: NelloGlobalFooterProps) => {
  const { language } = useLanguage();
  const { app: detectedApp } = useSubdomain();
  const navigate = useNavigate();
  const location = useLocation();

  const activeApp = currentApp || detectedApp;
  const isDark = variant === 'dark';
  
  // Module links with proper URLs (Ecosystem column)
  const ecosystemLinks = [
    { name: 'Identity', app: 'identity' as NelloApp, tagline: language === 'en' ? 'Where it all begins' : 'Onde tudo começa' },
    { name: 'Life', app: 'life' as NelloApp, tagline: language === 'en' ? 'Faith and habits' : 'Fé e hábitos' },
    { name: 'Flow', app: 'flow' as NelloApp, tagline: language === 'en' ? 'Ideas and action' : 'Ideias e ação' },
    { name: 'Business', app: 'business' as NelloApp, tagline: language === 'en' ? 'Culture and management' : 'Cultura e gestão' },
    { name: 'Praxis', app: 'business' as NelloApp, href: '/praxis', tagline: language === 'en' ? 'For professionals' : 'Área do profissional' },
  ];

  // Support links
  const supportLinks = [
    { 
      label: language === 'en' ? 'Help Center' : 'Central de Ajuda', 
      href: 'https://nello.one/ajuda',
      external: true 
    },
    { 
      label: 'WhatsApp', 
      href: '/whatsapp',
      external: false,
      icon: MessageCircle
    },
    { 
      label: language === 'en' ? 'Contact' : 'Contato', 
      href: 'mailto:contato@nello.one',
      external: true 
    },
  ];

  // Legal links
  const legalLinks = [
    { label: language === 'en' ? 'Terms of Use' : 'Termos de Uso', href: '/termos-de-servico' },
    { label: language === 'en' ? 'Privacy Policy' : 'Política de Privacidade', href: '/politica-de-privacidade' },
  ];

  // Social links
  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/nello.one' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/nello-one' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@nello-one' },
  ];

  const getModuleUrl = (link: typeof ecosystemLinks[0]) => {
    const isPreview = window.location.hostname.includes('lovable') || 
                      window.location.hostname === 'localhost';
    
    if (isPreview) {
      const params = new URLSearchParams(location.search);
      params.set('app', link.app);
      return `/?${params.toString()}${link.href || ''}`;
    }
    
    if (link.href) {
      return `${getNelloAppUrl(link.app)}${link.href}`;
    }
    return getNelloAppUrl(link.app);
  };

  const isActiveModule = (link: typeof ecosystemLinks[0]) => {
    if (link.href === '/praxis') {
      return location.pathname.includes('/praxis');
    }
    return activeApp === link.app && !location.pathname.includes('/praxis');
  };

  return (
    <footer className={cn(
      "py-16 md:py-20 border-t",
      isDark 
        ? "bg-nello-graphite border-white/10" 
        : "bg-background border-border/40"
    )}>
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          {/* 4-Column Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">
            
            {/* Column 1: About (Sobre) */}
            <div className="col-span-2 md:col-span-1">
              {/* Brand */}
              <a 
                href="https://identity.nello.one"
                className="inline-flex items-center gap-1.5 mb-4"
              >
                <span className={cn(
                  "font-serif text-lg font-bold",
                  isDark ? "text-white" : "text-ink-deep"
                )}>
                  NELLO
                </span>
                <span className={cn(
                  "font-serif text-lg font-light",
                  isDark ? "text-nello-gold" : "text-nello-gold-deep"
                )}>
                  IDENTITY
                </span>
              </a>
              
              {/* Description */}
              <p className={cn(
                "text-sm leading-relaxed mb-5",
                isDark ? "text-white/60" : "text-muted-foreground"
              )}>
                {language === 'en' 
                  ? 'One Life. One Ecosystem. The definitive solution for modern life fragmentation.'
                  : 'Uma Vida. Um Ecossistema. A solução definitiva para a fragmentação da vida moderna.'}
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3 mb-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                      isDark 
                        ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              
              <LanguageToggle variant="minimal" />
            </div>

            {/* Column 2: Ecosystem (Ecossistema) */}
            <div>
              <h4 className={cn(
                "text-xs font-semibold uppercase tracking-widest mb-4",
                isDark ? "text-white" : "text-foreground"
              )}>
                {language === 'en' ? 'Ecosystem' : 'Ecossistema'}
              </h4>
              <ul className="space-y-3">
                {ecosystemLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={getModuleUrl(link)}
                      className={cn(
                        "text-sm transition-colors group flex items-center gap-2",
                        isActiveModule(link) 
                          ? (isDark ? 'text-nello-gold font-medium' : 'text-nello-gold-deep font-medium')
                          : (isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground')
                      )}
                    >
                      <span>{link.name}</span>
                      {isActiveModule(link) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-nello-gold" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support (Suporte) */}
            <div>
              <h4 className={cn(
                "text-xs font-semibold uppercase tracking-widest mb-4",
                isDark ? "text-white" : "text-foreground"
              )}>
                {language === 'en' ? 'Support' : 'Suporte'}
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        "text-sm transition-colors flex items-center gap-2",
                        isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 className={cn(
                "text-xs font-semibold uppercase tracking-widest mb-4",
                isDark ? "text-white" : "text-foreground"
              )}>
                Legal
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className={cn(
                        "text-sm transition-colors",
                        isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={cn(
            "pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4",
            isDark ? "border-white/10" : "border-border/40"
          )}>
            <p className={cn(
              "text-xs",
              isDark ? "text-white/40" : "text-muted-foreground/60"
            )}>
              © {new Date().getFullYear()} Nello One. {language === 'en' ? 'All rights reserved.' : 'Todos os direitos reservados.'}
            </p>
            <p className={cn(
              "text-xs font-serif italic",
              isDark ? "text-white/40" : "text-muted-foreground/60"
            )}>
              {language === 'en' 
                ? 'Life from the inside out. With Christ at the center.' 
                : 'Vida de dentro para fora. Com Cristo no centro.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
