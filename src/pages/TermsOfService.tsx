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
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <LogoText variant="default" className="text-4xl mb-4" />
          <h1 className="text-3xl font-bold">Termos de Uso</h1>
          <p className="text-muted-foreground mt-2">Última atualização: Janeiro de 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e utilizar a plataforma Essentia, você concorda com os presentes Termos de Uso. 
              Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Descrição dos Serviços</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Essentia oferece uma experiência completa de autoconhecimento através de:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li>Aplicação de testes de personalidade e análise de perfil</li>
              <li>Consultoria de imagem profissional personalizada</li>
              <li>Sessões fotográficas com propósito e direcionamento</li>
              <li>Atendimento exclusivo em Brasília-DF</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Uso da Plataforma</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Ao criar uma conta no Essentia, você concorda em:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
              <li>Manter a segurança e confidencialidade de sua senha</li>
              <li>Não utilizar a plataforma para fins ilícitos ou não autorizados</li>
              <li>Respeitar os direitos de propriedade intelectual do Essentia</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Propriedade Intelectual e Uso de Imagens</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              <strong>IMPORTANTE:</strong> Todas as fotografias produzidas pelo Essentia são propriedade compartilhada entre o cliente e o estúdio:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Você recebe os direitos de uso das imagens para fins pessoais e profissionais</li>
              <li><strong>Nenhuma imagem será publicada ou divulgada sem sua autorização expressa e por escrito</strong></li>
              <li>O Essentia pode solicitar autorização para uso em portfólio, redes sociais ou materiais de divulgação</li>
              <li>Você pode revogar a autorização de uso a qualquer momento mediante solicitação formal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Agendamento e Cancelamento</h2>
            <p className="text-muted-foreground leading-relaxed">
              As sessões fotográficas devem ser agendadas com antecedência mínima de 7 dias. 
              Cancelamentos com menos de 48 horas de antecedência estão sujeitos a taxas conforme política de cada plano contratado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Essentia se compromete a fornecer serviços de alta qualidade, porém não se responsabiliza por:
              resultados subjetivos de autoconhecimento, interpretações pessoais dos testes de personalidade, 
              ou expectativas não comunicadas previamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Modificações dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
              Alterações significativas serão comunicadas por email aos usuários cadastrados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <p className="text-muted-foreground mt-2">
              <strong>Email:</strong> contato@essentia.com.br<br />
              <strong>WhatsApp:</strong> +55 (11) 99999-9999
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Button onClick={() => navigate("/")} size="lg">
            Voltar para o site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
