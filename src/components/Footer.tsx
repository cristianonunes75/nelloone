export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gold mb-4">Essentia</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Imagem com propósito.<br />
              Identidade revelada.<br />
              Beleza com fé.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-gold transition-colors">Sobre</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Processo</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Planos</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>contato@essentia.com.br</li>
              <li>+55 (11) 99999-9999</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>&copy; 2025 Essentia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
