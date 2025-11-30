import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-essentia-white">
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
            Política de Privacidade
          </h1>
          <p className="text-miguel-silver mt-2">Última atualização: 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-apple p-8 md:p-12">
          <p className="text-miguel-deep leading-relaxed mb-8 text-lg">
            A sua privacidade é importante para nós.
            Este documento explica como coletamos, usamos e protegemos seus dados.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                1. Informações coletadas
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Coletamos:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2">
                <li>nome e e-mail;</li>
                <li>respostas dos testes;</li>
                <li>interações com Miguel;</li>
                <li>dados de navegação;</li>
                <li>informações de dispositivo;</li>
                <li>dados de pagamento (parcial, via terceiros).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                2. Como usamos seus dados
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Usamos seus dados para:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2">
                <li>gerar seus resultados;</li>
                <li>personalizar interações com Miguel;</li>
                <li>melhorar a plataforma;</li>
                <li>oferecer suporte;</li>
                <li>cumprir obrigações legais;</li>
                <li>enviar comunicações (opcional).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                3. Compartilhamento de Informações
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                <strong className="text-miguel-deep">Não vendemos</strong> e não compartilhamos dados com terceiros, exceto:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-4">
                <li>processadores de pagamento</li>
                <li>provedores de segurança</li>
                <li>sistemas de analytics</li>
                <li>quando exigido por lei</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed">
                Todos operam sob padrão de proteção de dados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                4. Armazenamento e Segurança
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Os dados são armazenados em provedores cloud confiáveis.
                Aplicamos:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-4">
                <li>criptografia;</li>
                <li>controle de acesso;</li>
                <li>logs de segurança;</li>
                <li>monitoramento contínuo.</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed">
                Nenhum sistema é 100% seguro, mas adotamos as melhores práticas disponíveis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                5. Seus Direitos
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Você pode solicitar:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-4">
                <li>acesso aos dados</li>
                <li>correção</li>
                <li>anonimização</li>
                <li>portabilidade</li>
                <li>exclusão</li>
                <li>cancelamento de e-mails</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed">
                Basta enviar solicitação para:
              </p>
              <p className="text-essentia-gold mt-2">
                📧 privacidade@essentia.app
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                6. Exclusão da Conta
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Ao solicitar exclusão, removeremos:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-4">
                <li>conta</li>
                <li>resultados</li>
                <li>histórico com Miguel</li>
                <li>dados pessoais</li>
                <li>configurações</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed">
                Exceto quando tivermos obrigação legal de manter algo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                7. Cookies
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed mb-4">
                Usamos cookies para:
              </p>
              <ul className="list-disc pl-6 text-miguel-deep/80 space-y-2 mb-4">
                <li>lembrar login</li>
                <li>melhorar experiência</li>
                <li>métricas</li>
                <li>recomendações personalizadas</li>
              </ul>
              <p className="text-miguel-deep/80 leading-relaxed">
                Você pode desativar nas configurações do navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                8. Alterações na Política
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed">
                Podemos atualizar esta política periodicamente.
                Usar a plataforma implica aceitar a versão mais recente.
              </p>
            </section>

            <section className="pt-6 border-t border-soul-sand">
              <h2 className="text-xl font-semibold text-miguel-deep mb-4 font-display">
                9. Contato
              </h2>
              <p className="text-miguel-deep/80 leading-relaxed">
                Para dúvidas:
              </p>
              <p className="text-essentia-gold mt-2">
                📧 privacidade@essentia.app
              </p>
            </section>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-essentia-gold hover:bg-essentia-gold/90 text-white px-8 py-3 rounded-xl shadow-apple"
          >
            Voltar para o site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
