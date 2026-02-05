import logo from "@/assets/logo.png";
import { Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const LandingFooter = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const isEn = language === 'en';
  const isPtPt = language === 'pt-pt';

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <img 
                src={logo} 
                alt="NELLO IDENTITY" 
                className="h-12 w-auto mb-6 brightness-0 invert opacity-90"
              />
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                {isEn ? (
                  <>NELLO IDENTITY<br />The path begins within.</>
                ) : isPtPt ? (
                  <>NELLO IDENTITY<br />O caminho começa dentro.</>
                ) : (
                  <>NELLO IDENTITY<br />O caminho começa dentro.</>
                )}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/identity.nello?igsh=YzdvaXdzbHp0ZW1k&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                  aria-label="Instagram NELLO IDENTITY"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">
                {isEn ? 'Navigation' : 'Navegação'}
              </h4>
              <ul className="space-y-3 text-primary-foreground/80">
                <li>
                  <button
                    onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-gold transition-colors"
                  >
                    {isEn ? 'About' : 'Sobre'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('testes')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-gold transition-colors"
                  >
                    {isEn ? 'Tests' : 'Testes'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-gold transition-colors"
                  >
                    {isEn ? 'Plans' : 'Planos'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(isEn ? "/en/auth" : isPtPt ? "/pt-pt/auth" : "/auth")}
                    className="hover:text-gold transition-colors font-semibold"
                  >
                    {isEn ? 'Client Area' : 'Área do Cliente'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">
                {isEn ? 'Contact' : 'Contato'}
              </h4>
              <ul className="space-y-3 text-primary-foreground/80">
                <li>
                  <a 
                    href="https://wa.me/5561992430090" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <span>WhatsApp</span>
                  </a>
                </li>
                <li className="pt-2">
                  <a 
                    href="https://www.instagram.com/identity.nello?igsh=YzdvaXdzbHp0ZW1k&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-gold transition-colors"
                  >
                    @identity.nello
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
              <p>&copy; 2025 NELLO IDENTITY. {isEn ? 'All rights reserved.' : 'Todos os direitos reservados.'}</p>
              <div className="flex gap-6">
                <button 
                  onClick={() => navigate(isEn ? "/en/methodology" : isPtPt ? "/pt-pt/metodologia" : "/metodologia")}
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  {isEn ? 'Methodology' : 'Metodologia'}
                </button>
                <button 
                  onClick={() => navigate(isEn ? "/en/terms" : isPtPt ? "/pt-pt/termos" : "/termos")}
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  {isEn ? 'Terms of Use' : 'Termos de Uso'}
                </button>
                <button 
                  onClick={() => navigate(isEn ? "/en/privacy" : isPtPt ? "/pt-pt/privacidade" : "/privacidade")}
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  {isEn ? 'Privacy Policy' : 'Política de Privacidade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};