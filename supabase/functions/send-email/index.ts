import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType = 
  | "purchase_confirmation"
  | "welcome"
  | "access_instructions"
  | "test_completed"
  | "map_available";

interface EmailRequest {
  type: EmailType;
  to: string;
  data: {
    name?: string;
    testNames?: string[];
    testName?: string;
    amount?: number;
    currency?: string;
    language?: string;
  };
}

const getEmailContent = (type: EmailType, data: EmailRequest["data"]) => {
  const lang = data.language || "pt";
  const name = data.name || "Usuário";

  const templates: Record<string, Record<EmailType, { subject: string; html: string }>> = {
    pt: {
      purchase_confirmation: {
        subject: "✓ Compra confirmada - NELLO ONE",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
              <p style="color: #666; font-size: 14px; margin-top: 8px;">O caminho começa dentro.</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Olá, ${name}!</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Sua compra foi confirmada com sucesso! 🎉
              </p>
              
              <div style="background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="color: #666; font-size: 14px; margin: 0 0 8px;">Testes adquiridos:</p>
                <ul style="color: #1A1A1A; font-size: 16px; margin: 0; padding-left: 20px;">
                  ${(data.testNames || []).map(t => `<li style="margin: 4px 0;">${t}</li>`).join("")}
                </ul>
                <p style="color: #1A1A1A; font-size: 18px; font-weight: 600; margin: 16px 0 0;">
                  Total: ${data.currency || "R$"} ${data.amount?.toFixed(2)}
                </p>
              </div>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Acesse sua conta para iniciar sua jornada de autoconhecimento.
              </p>
              
              <a href="https://nelloone.app/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                Acessar Minha Conta
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. Todos os direitos reservados.
            </p>
          </div>
        `,
      },
      welcome: {
        subject: "Bem-vindo ao NELLO ONE! 🌟",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
              <p style="color: #666; font-size: 14px; margin-top: 8px;">O caminho começa dentro.</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Bem-vindo, ${name}! 🌟</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Sua jornada de autoconhecimento começa agora. O NELLO ONE vai te ajudar a descobrir padrões profundos sobre quem você é.
              </p>
              
              <div style="background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #1A1A1A; font-size: 16px; margin: 0 0 12px;">O que você vai descobrir:</h3>
                <ul style="color: #444; font-size: 15px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Seus arquétipos dominantes</li>
                  <li>Seu perfil comportamental DISC</li>
                  <li>Suas inteligências múltiplas</li>
                  <li>Seu tipo de personalidade Nello 16</li>
                  <li>Seu tipo do Eneagrama</li>
                  <li>Seu temperamento</li>
                  <li>Seus estilos de conexão afetiva</li>
                </ul>
              </div>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Ao completar todos os testes, você receberá seu <strong>Mapa Nello One</strong> personalizado.
              </p>
              
              <a href="https://nelloone.app/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                Começar Jornada
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. Todos os direitos reservados.
            </p>
          </div>
        `,
      },
      access_instructions: {
        subject: "Como acessar seus testes - NELLO ONE",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Instruções de Acesso</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Olá, ${name}! Aqui está como acessar seus testes:
              </p>
              
              <div style="margin: 24px 0;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                  <span style="background: #1F2E4B; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px; flex-shrink: 0;">1</span>
                  <p style="color: #444; font-size: 15px; margin: 0; line-height: 1.6;">Acesse <a href="https://nelloone.app/cliente" style="color: #1F2E4B;">nelloone.app/cliente</a></p>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                  <span style="background: #1F2E4B; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px; flex-shrink: 0;">2</span>
                  <p style="color: #444; font-size: 15px; margin: 0; line-height: 1.6;">Faça login com o e-mail usado na compra</p>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                  <span style="background: #1F2E4B; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px; flex-shrink: 0;">3</span>
                  <p style="color: #444; font-size: 15px; margin: 0; line-height: 1.6;">Clique no teste que deseja realizar</p>
                </div>
                <div style="display: flex; align-items: flex-start;">
                  <span style="background: #1F2E4B; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px; flex-shrink: 0;">4</span>
                  <p style="color: #444; font-size: 15px; margin: 0; line-height: 1.6;">Responda com calma e honestidade</p>
                </div>
              </div>
              
              <a href="https://nelloone.app/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                Acessar Minha Conta
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. Todos os direitos reservados.
            </p>
          </div>
        `,
      },
      test_completed: {
        subject: `Parabéns! Você completou ${data.testName || "o teste"} 🎉`,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Parabéns, ${name}! 🎉</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Você completou o teste <strong>${data.testName}</strong>!
              </p>
              
              <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="color: #166534; font-size: 16px; margin: 0;">
                  ✓ Seus resultados estão disponíveis na sua área de cliente.
                </p>
              </div>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Continue sua jornada completando os próximos testes para desbloquear seu Mapa Nello One completo.
              </p>
              
              <a href="https://nelloone.app/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                Ver Resultados
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. Todos os direitos reservados.
            </p>
          </div>
        `,
      },
      map_available: {
        subject: "Seu Mapa Nello One está pronto! 🗺️",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Parabéns, ${name}! 🗺️</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Você completou toda a jornada e seu <strong>Mapa Nello One</strong> está pronto!
              </p>
              
              <div style="background: linear-gradient(135deg, #1F2E4B 0%, #2F3A57 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
                <p style="color: #CDAE67; font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Disponível agora</p>
                <p style="color: white; font-size: 24px; font-weight: 600; margin: 0;">Seu Mapa Nello One</p>
              </div>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Este mapa integra todos os seus resultados em uma visão única e profunda sobre quem você é. Inclui:
              </p>
              
              <ul style="color: #444; font-size: 15px; padding-left: 20px; line-height: 1.8;">
                <li>Sua identidade central</li>
                <li>Sua imagem essencial</li>
                <li>Sua comunicação essencial</li>
                <li>Seu propósito essencial</li>
                <li>Seu plano de vida essencial</li>
              </ul>
              
              <a href="https://nelloone.app/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                Ver Meu Mapa
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. Todos os direitos reservados.
            </p>
          </div>
        `,
      },
    },
    en: {
      purchase_confirmation: {
        subject: "✓ Purchase confirmed - NELLO ONE",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
              <p style="color: #666; font-size: 14px; margin-top: 8px;">The path begins within.</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Hello, ${name}!</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Your purchase has been confirmed! 🎉
              </p>
              
              <div style="background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="color: #666; font-size: 14px; margin: 0 0 8px;">Tests purchased:</p>
                <ul style="color: #1A1A1A; font-size: 16px; margin: 0; padding-left: 20px;">
                  ${(data.testNames || []).map(t => `<li style="margin: 4px 0;">${t}</li>`).join("")}
                </ul>
                <p style="color: #1A1A1A; font-size: 18px; font-weight: 600; margin: 16px 0 0;">
                  Total: ${data.currency || "$"} ${data.amount?.toFixed(2)}
                </p>
              </div>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Access your account to start your self-discovery journey.
              </p>
              
              <a href="https://nelloone.app/en/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                Access My Account
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. All rights reserved.
            </p>
          </div>
        `,
      },
      welcome: {
        subject: "Welcome to NELLO ONE! 🌟",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
              <p style="color: #666; font-size: 14px; margin-top: 8px;">The path begins within.</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Welcome, ${name}! 🌟</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Your self-discovery journey begins now. NELLO ONE will help you uncover deep patterns about who you are.
              </p>
              
              <div style="background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #1A1A1A; font-size: 16px; margin: 0 0 12px;">What you'll discover:</h3>
                <ul style="color: #444; font-size: 15px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Your dominant archetypes</li>
                  <li>Your DISC behavioral profile</li>
                  <li>Your multiple intelligences</li>
                  <li>Your Nello 16 personality type</li>
                  <li>Your Enneagram type</li>
                  <li>Your temperament</li>
                  <li>Your affection connection styles</li>
                </ul>
              </div>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                After completing all tests, you'll receive your personalized <strong>Nello One Map</strong>.
              </p>
              
              <a href="https://nelloone.app/en/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                Start Journey
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. All rights reserved.
            </p>
          </div>
        `,
      },
      access_instructions: {
        subject: "How to access your tests - NELLO ONE",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Access Instructions</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Hello, ${name}! Here's how to access your tests:
              </p>
              
              <div style="margin: 24px 0;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                  <span style="background: #1F2E4B; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px; flex-shrink: 0;">1</span>
                  <p style="color: #444; font-size: 15px; margin: 0; line-height: 1.6;">Go to <a href="https://nelloone.app/en/cliente" style="color: #1F2E4B;">nelloone.app/en/cliente</a></p>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                  <span style="background: #1F2E4B; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px; flex-shrink: 0;">2</span>
                  <p style="color: #444; font-size: 15px; margin: 0; line-height: 1.6;">Log in with the email used for purchase</p>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                  <span style="background: #1F2E4B; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px; flex-shrink: 0;">3</span>
                  <p style="color: #444; font-size: 15px; margin: 0; line-height: 1.6;">Click on the test you want to take</p>
                </div>
                <div style="display: flex; align-items: flex-start;">
                  <span style="background: #1F2E4B; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px; flex-shrink: 0;">4</span>
                  <p style="color: #444; font-size: 15px; margin: 0; line-height: 1.6;">Answer calmly and honestly</p>
                </div>
              </div>
              
              <a href="https://nelloone.app/en/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                Access My Account
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. All rights reserved.
            </p>
          </div>
        `,
      },
      test_completed: {
        subject: `Congratulations! You completed ${data.testName || "the test"} 🎉`,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Congratulations, ${name}! 🎉</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                You completed the <strong>${data.testName}</strong> test!
              </p>
              
              <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="color: #166534; font-size: 16px; margin: 0;">
                  ✓ Your results are available in your client area.
                </p>
              </div>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Continue your journey by completing the remaining tests to unlock your complete Nello One Map.
              </p>
              
              <a href="https://nelloone.app/en/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                View Results
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. All rights reserved.
            </p>
          </div>
        `,
      },
      map_available: {
        subject: "Your Nello One Map is ready! 🗺️",
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">Congratulations, ${name}! 🗺️</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                You completed the entire journey and your <strong>Nello One Map</strong> is ready!
              </p>
              
              <div style="background: linear-gradient(135deg, #1F2E4B 0%, #2F3A57 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
                <p style="color: #CDAE67; font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Available now</p>
                <p style="color: white; font-size: 24px; font-weight: 600; margin: 0;">Your Nello One Map</p>
              </div>
              
              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                This map integrates all your results into a unique and deep view of who you are. It includes:
              </p>
              
              <ul style="color: #444; font-size: 15px; padding-left: 20px; line-height: 1.8;">
                <li>Your central identity</li>
                <li>Your essential image</li>
                <li>Your essential communication</li>
                <li>Your essential purpose</li>
                <li>Your essential life plan</li>
              </ul>
              
              <a href="https://nelloone.app/en/cliente" 
                 style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                View My Map
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
              © 2025 NELLO ONE. All rights reserved.
            </p>
          </div>
        `,
      },
    },
  };

  const langTemplates = templates[lang] || templates["pt"];
  return langTemplates[type];
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();

    console.log("[SEND-EMAIL] Processing request", { type, to, language: data.language });

    if (!type || !to) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, to" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailContent = getEmailContent(type, data);

    if (!emailContent) {
      return new Response(
        JSON.stringify({ error: `Invalid email type: ${type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "NELLO ONE <noreply@nelloone.app>",
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("[SEND-EMAIL] Email sent successfully", { type, to, response: emailResponse });

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[SEND-EMAIL] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
