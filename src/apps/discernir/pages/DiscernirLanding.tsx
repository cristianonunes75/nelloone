import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Church, Heart, Users, Shield, BookOpen, X } from 'lucide-react';

export function DiscernirLanding() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="container px-4 py-6">
        <div className="flex items-center gap-2">
          <Church className="h-8 w-8 text-[#8B5A2B]" />
          <span className="font-serif text-2xl font-semibold text-[#5D4E37]">
            DISCERNIR
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="container px-4 py-16 md:py-24 text-center">
        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-[#4A3C2A] max-w-3xl mx-auto leading-tight">
          Experiência Assistida de Escuta Pastoral
        </h1>
        <p className="mt-6 text-lg text-[#6B5B4F] max-w-2xl mx-auto leading-relaxed">
          Um apoio para a conversa pastoral, respeitando o tempo, o limite e a liberdade de cada pessoa e casal.
        </p>
        
        {/* Pilot context phrase */}
        <p className="mt-4 text-sm text-[#8B7355] italic max-w-xl mx-auto">
          Esta experiência está sendo vivida, neste momento, como um piloto pastoral no contexto da Pastoral Familiar.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-[#C4785C] hover:bg-[#A66249] text-white border-none shadow-sm"
            >
              <Heart className="mr-2 h-5 w-5" />
              Entrar
            </Button>
          </Link>
        </div>
      </section>

      {/* Principles */}
      <section className="container px-4 py-16">
        <h2 className="font-serif text-2xl font-semibold text-[#4A3C2A] text-center mb-12">
          Princípios que guiam o DISCERNIR
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="border-[#E8DFD3] bg-white/60 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Shield className="h-10 w-10 text-[#8B5A2B] mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-[#4A3C2A] mb-2">Proteção</h3>
              <p className="text-sm text-[#6B5B4F] leading-relaxed">
                Nenhum dado é exposto sem consentimento explícito e revogável
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#E8DFD3] bg-white/60 shadow-sm">
            <CardContent className="pt-6 text-center">
              <Users className="h-10 w-10 text-[#8B5A2B] mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-[#4A3C2A] mb-2">Escuta</h3>
              <p className="text-sm text-[#6B5B4F] leading-relaxed">
                O sistema apenas apoia a conversa, nunca substitui o encontro
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#E8DFD3] bg-white/60 shadow-sm">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-10 w-10 text-[#8B5A2B] mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-[#4A3C2A] mb-2">Discernimento</h3>
              <p className="text-sm text-[#6B5B4F] leading-relaxed">
                Inspirado na Sagrada Escritura e no Magistério da Igreja
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vivida em comunhão */}
      <section className="container px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-xl font-semibold text-[#4A3C2A] mb-4">
            Vivida em comunhão
          </h2>
          <p className="text-[#6B5B4F] leading-relaxed">
            O DISCERNIR é sempre vivido em diálogo com o pároco ou agente pastoral responsável. 
            Ele não é uma experiência individual ou automática.
          </p>
        </div>
      </section>

      {/* O que esta experiência não é */}
      <section className="container px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-xl font-semibold text-[#4A3C2A] text-center mb-6">
            O que esta experiência não é
          </h2>
          <ul className="space-y-3 text-[#6B5B4F]">
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-[#A66249] mt-0.5 flex-shrink-0" />
              <span>Não é terapia</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-[#A66249] mt-0.5 flex-shrink-0" />
              <span>Não é avaliação de pessoas ou casais</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-[#A66249] mt-0.5 flex-shrink-0" />
              <span>Não define funções ou lideranças</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-[#A66249] mt-0.5 flex-shrink-0" />
              <span>Não substitui conversa, oração ou acompanhamento pastoral</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Disclaimer with ecclesial anchor */}
      <section className="container px-4 py-12">
        <div className="max-w-2xl mx-auto bg-[#F5EFE6] rounded-xl p-8 text-center border border-[#E8DFD3]">
          <p className="text-[#6B5B4F] italic font-serif text-lg leading-relaxed">
            "Isso não é avaliação nem diagnóstico. É apenas um apoio para a conversa pastoral. 
            Você pode sair a qualquer momento."
          </p>
          <p className="mt-6 text-sm text-[#8B7355]">
            Inspirado na Sagrada Escritura, no Magistério da Igreja e no Diretório da Pastoral Familiar.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#EDE5D8] border-t border-[#DDD3C3] mt-8">
        <div className="container px-4 py-10">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <p className="font-serif text-[#5D4E37] font-medium">
              DISCERNIR – versão piloto pastoral
            </p>
            <p className="text-sm text-[#7A6B5A]">
              Esta experiência respeita integralmente a LGPD.
            </p>
            <p className="text-sm text-[#7A6B5A]">
              Nenhuma informação é compartilhada sem consentimento explícito e revogável.
            </p>
            <p className="text-xs text-[#8B7A69] pt-4">
              © 2026 – Uso pastoral acompanhado.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
