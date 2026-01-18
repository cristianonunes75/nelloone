import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-miguel-deep hover:text-miguel-deep/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <LogoText variant="solid" className="text-4xl mb-4" />
          <h1 className="text-3xl font-semibold text-miguel-deep font-display">
            Termos de Uso
          </h1>
          <p className="text-miguel-silver mt-2">Última atualização: 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-apple p-8 md:p-12">
          <p className="text-miguel-deep leading-relaxed mb-8 text-lg">
            Bem-vindo ao NELLO ONE, uma plataforma digital de autoconhecimento guiada por inteligência artificial.
            Ao acessar, utilizar ou criar uma conta, você concorda com estes Termos de Uso.
          </p>
          <p className="text-primary font-medium mb-12">Leia atentamente.</p>

          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                1. Sobre o NELLO ONE
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                O NELLO IDENTITY é uma plataforma de autoconhecimento composta por:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-6">
                <li>testes de avaliação de personalidade, comportamento e perfil emocional;</li>
                <li>um agente de IA chamado Miguel, que oferece explicações, reflexões e acompanhamentos;</li>
                <li>ferramentas de análise integradas (Mapa NELLO IDENTITY);</li>
                <li>conteúdos informacionais e interativos.</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                O NELLO IDENTITY <strong className="text-miguel-deep">não substitui:</strong>
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2">
                <li>diagnóstico clínico,</li>
                <li>aconselhamento psicológico,</li>
                <li>orientação médica,</li>
                <li>terapia,</li>
                <li>consultoria profissional.</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed mt-4">
                É um recurso educativo e reflexivo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                2. Elegibilidade
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Para usar o NELLO ONE, você deve:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2">
                <li>ter pelo menos 16 anos;</li>
                <li>ter capacidade de aceitar estes termos;</li>
                <li>fornecer informações verdadeiras.</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed mt-4">
                Menores de 16 anos requerem consentimento dos responsáveis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                3. Conta do Usuário
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Ao criar uma conta, você concorda em:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-6">
                <li>manter seus dados atualizados;</li>
                <li>proteger sua senha;</li>
                <li>não compartilhar acesso com terceiros;</li>
                <li>notificar imediatamente qualquer uso indevido.</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Nós podemos suspender ou encerrar contas em caso de:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2">
                <li>uso inadequado;</li>
                <li>violação dos termos;</li>
                <li>fraude;</li>
                <li>comportamento abusivo.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                4. Uso Permitido
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Você pode usar o NELLO ONE para:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-6">
                <li>realizar testes;</li>
                <li>acessar análises;</li>
                <li>interagir com o agente Miguel;</li>
                <li>aprender sobre si mesmo;</li>
                <li>consultar seu Mapa da Essência.</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                <strong className="text-miguel-deep">É proibido:</strong>
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2">
                <li>copiar conteúdo para fins comerciais;</li>
                <li>manipular o sistema;</li>
                <li>violar segurança da plataforma;</li>
                <li>utilizar para fins ilícitos;</li>
                <li>tentar burlar pagamentos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                5. Pagamentos e Preços
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Alguns recursos são pagos. Preços podem mudar sem aviso prévio.
                Compras são processadas por plataformas terceiras seguras.
                O NELLO ONE não armazena dados completos de pagamento.
              </p>
              <p className="text-miguel-deep/80 leading-relaxed">
                Compras são não reembolsáveis, exceto nos casos previstos pela legislação aplicável.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                6. Conteúdos e Interpretações
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                As interpretações fornecidas por Miguel são geradas por inteligência artificial
                baseada em dados, padrões e modelos de linguagem.
              </p>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Você entende que:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2">
                <li>resultados são simbólicos;</li>
                <li>análises são sugestões;</li>
                <li>não constituem diagnóstico;</li>
                <li>não garantem precisão absoluta.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                7. Privacidade
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed">
                O uso da plataforma implica aceitação da nossa{" "}
                <button
                  onClick={() => navigate("/politica-de-privacidade")}
                  className="text-primary hover:underline"
                >
                  Política de Privacidade
                </button>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                8. Modificações da Plataforma
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed">
                Podemos atualizar, alterar, suspender ou remover funcionalidades a qualquer momento,
                sem obrigação de aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                9. Propriedade Intelectual
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed">
                Todo conteúdo do NELLO ONE — textos, visual, IA, algoritmos, marca e componentes —
                é protegido por direitos autorais e não pode ser copiado ou redistribuído sem autorização.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                10. Limitação de Responsabilidade
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                O NELLO ONE não se responsabiliza por:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-4">
                <li>decisões tomadas com base nos resultados;</li>
                <li>indisponibilidade do sistema;</li>
                <li>perda de dados causada por terceiros;</li>
                <li>uso indevido da plataforma.</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed">
                Você utiliza o NELLO ONE por sua própria conta e risco.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                11. Contato
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed">
                Para dúvidas, suporte ou solicitações:
              </p>
              <p className="text-primary mt-2">
                📧 suporte@nello.one
              </p>
            </section>

            <section className="pt-6 border-t border-soul-sand">
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                12. Aceitação
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed">
                Ao utilizar o NELLO ONE, você declara ter lido e concordado integralmente com estes Termos de Uso.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl shadow-apple"
          >
            Voltar para o site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
