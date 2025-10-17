import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components/LogoText";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold">Política de Privacidade e LGPD</h1>
          <p className="text-muted-foreground mt-2">Última atualização: Janeiro de 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Compromisso com sua Privacidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Essentia está comprometido com a proteção de seus dados pessoais e em conformidade com a 
              Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Esta política explica como 
              coletamos, usamos, armazenamos e protegemos suas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Dados que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Coletamos as seguintes categorias de dados:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Dados de Cadastro:</strong> nome completo, email, telefone/WhatsApp</li>
              <li><strong>Dados de Perfil:</strong> profissão, preferências de estilo, objetivos com a imagem</li>
              <li><strong>Resultados dos Testes:</strong> respostas e análises dos 9 testes de personalidade</li>
              <li><strong>Imagens:</strong> fotografias produzidas durante as sessões</li>
              <li><strong>Dados de Navegação:</strong> cookies e informações técnicas de uso da plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Finalidade do Uso dos Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Seus dados são utilizados exclusivamente para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Análise de perfil e consultoria de imagem personalizada</li>
              <li>Agendamento e realização de sessões fotográficas</li>
              <li>Comunicação sobre serviços, agendamentos e novidades</li>
              <li>Melhoria contínua de nossos serviços e experiência do usuário</li>
              <li>Cumprimento de obrigações legais e contratuais</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong className="text-foreground">Consentimento Expresso:</strong> Ao prosseguir com o cadastro, 
              você concorda com o uso de seus dados exclusivamente para os fins descritos acima.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Seus dados pessoais <strong>NÃO serão vendidos, alugados ou compartilhados</strong> com terceiros 
              para fins comerciais. Compartilhamento ocorre apenas quando:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
              <li>Necessário para prestação do serviço (ex: fotógrafos e consultores da equipe)</li>
              <li>Exigido por lei ou ordem judicial</li>
              <li>Você autorizar expressamente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Proteção e Armazenamento</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizacionais de segurança para proteger seus dados contra 
              acesso não autorizado, perda, destruição ou alteração. Seus dados são armazenados em servidores 
              seguros e criptografados, mantidos apenas pelo tempo necessário para as finalidades descritas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              De acordo com a LGPD, você tem direito a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Confirmação:</strong> saber se tratamos seus dados</li>
              <li><strong>Acesso:</strong> solicitar cópia dos seus dados</li>
              <li><strong>Correção:</strong> atualizar dados incompletos ou incorretos</li>
              <li><strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários ou excessivos</li>
              <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
              <li><strong>Revogação do consentimento:</strong> a qualquer momento</li>
              <li><strong>Oposição:</strong> ao tratamento de dados em situações específicas</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Para exercer seus direitos, entre em contato: <strong>contato@essentia.com.br</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Uso de Imagens e Autorização</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Garantia de Privacidade:</strong> Nenhuma fotografia será 
              publicada em redes sociais, site, portfólio ou qualquer meio de divulgação sem sua autorização 
              expressa e por escrito. Você tem total controle sobre o uso de suas imagens.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies para melhorar sua experiência de navegação, personalizar conteúdo e analisar 
              o uso da plataforma. Você pode configurar seu navegador para recusar cookies, porém isso pode 
              limitar algumas funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Alterações significativas serão 
              comunicadas por email. Recomendamos revisar esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contato - Encarregado de Dados (DPO)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas, solicitações ou exercício de seus direitos relacionados à privacidade e proteção de dados:
            </p>
            <p className="text-muted-foreground mt-2">
              <strong>Email:</strong> contato@essentia.com.br<br />
              <strong>WhatsApp:</strong> +55 (11) 99999-9999<br />
              <strong>Endereço:</strong> Brasília-DF
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

export default PrivacyPolicy;
