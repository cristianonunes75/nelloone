import logo from "@/assets/logo.png";
import { Instagram, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <img 
                src={logo} 
                alt="Essentia" 
                className="h-12 w-auto mb-6 brightness-0 invert opacity-90"
              />
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Imagem com propósito.<br />
                Identidade revelada.<br />
                Beleza com fé.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/essentiaimagem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                  aria-label="Instagram Essentia"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Navegação</h4>
              <ul className="space-y-3 text-primary-foreground/80">
                <li>
                  <button
                    onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-gold transition-colors"
                  >
                    Sobre
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('testes')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-gold transition-colors"
                  >
                    Testes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-gold transition-colors"
                  >
                    Planos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/auth")}
                    className="hover:text-gold transition-colors font-semibold"
                  >
                    Área do Cliente
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
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
                    href="https://instagram.com/essentiaimagem" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-gold transition-colors"
                  >
                    @essentiaimagem
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
              <p>&copy; 2025 Essentia. Todos os direitos reservados.</p>
              <div className="flex gap-6">
                <button 
                  onClick={() => navigate("/termos")}
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Termos de Uso
                </button>
                <button 
                  onClick={() => navigate("/privacidade")}
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Política de Privacidade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
