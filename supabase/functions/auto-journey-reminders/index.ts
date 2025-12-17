import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Test name mapping
const TEST_NAMES: Record<string, string> = {
  arquetipos_proposito: "Arquétipos com Propósito",
  disc: "DISC",
  temperamentos: "Temperamentos",
  estilos_conexao: "Estilos de Conexão Afetiva",
  inteligencias_multiplas: "Inteligências Múltiplas",
  eneagrama: "Eneagrama",
  nello16: "Nello 16 Personality",
};

// Journey order for determining next test
const JOURNEY_ORDER = [
  "arquetipos_proposito",
  "disc", 
  "temperamentos",
  "estilos_conexao",
  "inteligencias_multiplas",
  "eneagrama",
  "nello16"
];

function getNextTest(testsStatus: Record<string, string>): string {
  for (const slug of JOURNEY_ORDER) {
    const status = testsStatus[slug];
    if (status !== "completed") {
      return TEST_NAMES[slug] || slug;
    }
  }
  return "Próximo teste";
}

function generateReminderEmail(name: string, completedTests: number, nextTest: string): string {
  const testsRemaining = 7 - completedTests;
  const progressPercent = Math.round((completedTests / 7) * 100);

  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
        <p style="color: #666; font-size: 14px; margin-top: 8px;">O caminho começa dentro.</p>
      </div>
      
      <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #1A1A1A; font-size: 22px; margin: 0 0 16px;">
          Olá, ${name}! 👋
        </h2>
        
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Sentimos sua falta! Você começou sua jornada de autoconhecimento, mas ainda há caminho pela frente.
          Você está a apenas <strong>${testsRemaining} ${testsRemaining === 1 ? 'teste' : 'testes'}</strong> de completar sua jornada!
        </p>
        
        <div style="background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="color: #666; font-size: 14px; margin: 0 0 12px;">Seu progresso atual:</p>
          
          <div style="background: #E5E7EB; border-radius: 999px; height: 12px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #1F2E4B 0%, #2F3A57 100%); height: 100%; width: ${progressPercent}%; border-radius: 999px;"></div>
          </div>
          
          <p style="color: #1A1A1A; font-size: 16px; font-weight: 600; margin: 12px 0 0;">
            ${completedTests}/7 testes completos (${progressPercent}%)
          </p>
          
          <p style="color: #666; font-size: 14px; margin: 8px 0 0;">
            Próximo teste: <strong>${nextTest}</strong>
          </p>
        </div>
        
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Cada teste revela uma nova camada de quem você é. Ao completar os 7 testes, 
          você receberá seu <strong>Código da Essência</strong> — um relatório integrado 
          que conecta todos os seus padrões em uma leitura única.
        </p>
        
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://nello.one/cliente" 
             style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500;">
            Continuar Minha Jornada →
          </a>
        </div>
        
        <p style="color: #999; font-size: 13px; margin-top: 24px; line-height: 1.5; text-align: center;">
          Este é um lembrete gentil. Se preferir não receber mais, 
          basta responder este email pedindo a remoção.
        </p>
      </div>
      
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
        © 2025 NELLO ONE. Todos os direitos reservados.
      </p>
    </div>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("[AUTO-REMINDERS] Cron job triggered at:", new Date().toISOString());

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate the date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoISO = threeDaysAgo.toISOString();

    console.log("[AUTO-REMINDERS] Looking for users inactive since:", threeDaysAgoISO);

    // Query users with journey in progress who haven't been active for 3+ days
    const { data: inactiveUsers, error: queryError } = await supabase
      .from("profiles")
      .select("id, full_name, journey_status, journey_completed_tests, journey_tests_status, updated_at")
      .eq("journey_status", "in_progress")
      .eq("is_deleted", false)
      .eq("is_blocked", false)
      .lt("updated_at", threeDaysAgoISO);

    if (queryError) {
      console.error("[AUTO-REMINDERS] Error querying profiles:", queryError);
      throw queryError;
    }

    console.log(`[AUTO-REMINDERS] Found ${inactiveUsers?.length || 0} inactive users`);

    if (!inactiveUsers || inactiveUsers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No inactive users found",
          usersProcessed: 0 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[]
    };

    // Process each inactive user
    for (const user of inactiveUsers) {
      try {
        // Get user email from auth.users
        const { data: authData, error: authError } = await supabase.auth.admin.getUserById(user.id);
        
        if (authError || !authData?.user?.email) {
          console.log(`[AUTO-REMINDERS] Skipping user ${user.id}: No email found`);
          results.skipped++;
          continue;
        }

        const email = authData.user.email;
        const name = user.full_name || "Usuário";
        const completedTests = user.journey_completed_tests || 0;
        const testsStatus = (user.journey_tests_status as Record<string, string>) || {};
        const nextTest = getNextTest(testsStatus);

        console.log(`[AUTO-REMINDERS] Sending reminder to ${email} (${completedTests}/7 tests)`);

        // Generate and send email
        const emailHtml = generateReminderEmail(name, completedTests, nextTest);

        const emailResponse = await resend.emails.send({
          from: "NELLO ONE <noreply@nello.one>",
          to: [email],
          subject: `${name}, sua jornada está esperando por você 🌿`,
          html: emailHtml,
        });

        console.log(`[AUTO-REMINDERS] Email sent to ${email}:`, emailResponse);
        results.sent++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (userError: any) {
        console.error(`[AUTO-REMINDERS] Error processing user ${user.id}:`, userError);
        results.failed++;
        results.errors.push(`User ${user.id}: ${userError.message}`);
      }
    }

    console.log("[AUTO-REMINDERS] Completed. Results:", results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${inactiveUsers.length} users`,
        results
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("[AUTO-REMINDERS] Fatal error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
