import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Church, Heart, Users, Shield, BookOpen } from 'lucide-react';

export function DiscernirLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background">
      {/* Header */}
      <header className="container px-4 py-6">
        <div className="flex items-center gap-2">
          <Church className="h-8 w-8 text-amber-700" />
          <span className="font-serif text-2xl font-semibold text-amber-900">
            DISCERNIR
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="container px-4 py-16 md:py-24 text-center">
        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-amber-900 max-w-3xl mx-auto leading-tight">
          Experiência Assistida de Escuta Pastoral
        </h1>
        <p className="mt-6 text-lg text-amber-800/80 max-w-2xl mx-auto">
          Um apoio para a conversa pastoral, respeitando o tempo, o limite e a liberdade de cada pessoa e casal.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-white">
              <Heart className="mr-2 h-5 w-5" />
              Entrar
            </Button>
          </Link>
        </div>
      </section>

      {/* Principles */}
      <section className="container px-4 py-16">
        <h2 className="font-serif text-2xl font-semibold text-amber-900 text-center mb-12">
          Princípios que guiam o DISCERNIR
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="border-amber-200/50 bg-white/50">
            <CardContent className="pt-6 text-center">
              <Shield className="h-10 w-10 text-amber-700 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-900 mb-2">Proteção</h3>
              <p className="text-sm text-amber-800/70">
                Nenhum dado é exposto sem consentimento explícito e revogável
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200/50 bg-white/50">
            <CardContent className="pt-6 text-center">
              <Users className="h-10 w-10 text-amber-700 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-900 mb-2">Escuta</h3>
              <p className="text-sm text-amber-800/70">
                O sistema apenas apoia a conversa, nunca substitui o encontro
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200/50 bg-white/50">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-10 w-10 text-amber-700 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-900 mb-2">Discernimento</h3>
              <p className="text-sm text-amber-800/70">
                Inspirado na Sagrada Escritura e no Magistério da Igreja
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container px-4 py-12">
        <div className="max-w-2xl mx-auto bg-amber-100/50 rounded-xl p-8 text-center border border-amber-200/50">
          <p className="text-amber-800 italic font-serif text-lg">
            "Isso não é avaliação nem diagnóstico. É apenas um apoio para a conversa pastoral. Você pode sair a qualquer momento."
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container px-4 py-8 text-center border-t border-amber-200/30">
        <p className="text-sm text-amber-800/60">
          DISCERNIR · Versão Piloto 0.1 · Pastoral Familiar
        </p>
        <p className="mt-2 text-xs text-amber-800/40">
          Desenvolvido com ♥ para a Igreja
        </p>
      </footer>
    </div>
  );
}
