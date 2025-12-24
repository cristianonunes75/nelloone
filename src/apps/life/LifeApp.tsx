import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

/**
 * Nello Life - Placeholder
 * Subdomínio: life.nello.one
 * 
 * Descrição: Plataforma para organização da vida, hábitos, 
 * espiritualidade e equilíbrio pessoal.
 * 
 * TODO: Implementar app completo quando ativado
 */
export default function LifeApp() {
  return (
    <>
      <SEOHead
        title="Nello Life | Organização de Vida e Equilíbrio"
        description="Organize sua vida, hábitos e espiritualidade em um só lugar."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 flex items-center justify-center p-6">
        <div className="max-w-lg text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-8">
            <Heart className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Nello Life
          </h1>
          
          <p className="text-xl text-emerald-200/80 mb-2">
            Em breve
          </p>
          
          <p className="text-emerald-300/60 mb-8 max-w-md mx-auto">
            Plataforma para organização da vida, hábitos, espiritualidade e equilíbrio pessoal.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://one.nello.one">
              <Button variant="outline" className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10">
                Conhecer Nello One
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="https://flow.nello.one">
              <Button variant="outline" className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10">
                Conhecer Nello Flow
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
          
          <p className="text-emerald-400/40 text-sm mt-12">
            Parte da família Nello
          </p>
        </div>
      </div>
    </>
  );
}
