import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Twilio credentials
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_WHATSAPP_NUMBER = Deno.env.get("TWILIO_WHATSAPP_NUMBER") || "whatsapp:+14155238886";

const logStep = (step: string, details?: unknown) => {
  console.log(`[NOTIFY-ADMIN] ${step}`, details ? JSON.stringify(details) : '');
};

// Event types supported
type EventType = 
  | "new_purchase" 
  | "new_signup" 
  | "new_testimonial" 
  | "support_ticket"
  | "test_completed"
  | "essence_map_generated"
  | "affiliate_sale"
  | "crossing_accepted"
  | "journey_completed";

interface NotifyAdminRequest {
  event_type: EventType;
  data: {
    user_name?: string;
    user_email?: string;
    amount?: number;
    currency?: string;
    product?: string;
    message?: string;
    test_name?: string;
    affiliate_name?: string;
    commission?: number;
    partner_name?: string;
    [key: string]: unknown;
  };
}

// Get email templates for each event type
function getEmailContent(eventType: EventType, data: NotifyAdminRequest["data"]): { subject: string; html: string } {
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  
  switch (eventType) {
    case "new_purchase":
      const currencySymbol = data.currency === "USD" ? "$" : data.currency === "EUR" ? "€" : "R$";
      return {
        subject: `💰 Nova Venda! ${currencySymbol}${data.amount?.toFixed(2)} - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
              💰 Nova Venda Realizada!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>🛒 Produto:</strong> ${data.product || "Não especificado"}</p>
              <p><strong>💰 Valor:</strong> ${currencySymbol}${data.amount?.toFixed(2)}</p>
              <p><strong>👤 Cliente:</strong> ${data.user_name || "Não informado"} (${data.user_email || "sem email"})</p>
              <p><strong>📅 Data:</strong> ${now}</p>
            </div>
            <a href="https://nelloone.lovable.app/admin/pedidos" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Ver no Admin
            </a>
          </div>
        `,
      };

    case "new_signup":
      return {
        subject: `👤 Novo Cadastro - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              👤 Novo Usuário Cadastrado!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 Nome:</strong> ${data.user_name || "Não informado"}</p>
              <p><strong>📧 Email:</strong> ${data.user_email || "Não informado"}</p>
              <p><strong>📅 Data:</strong> ${now}</p>
            </div>
            <a href="https://nelloone.lovable.app/admin/usuarios" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Ver no Admin
            </a>
          </div>
        `,
      };

    case "new_testimonial":
      return {
        subject: `💬 Novo Depoimento - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
              💬 Novo Depoimento Recebido!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 De:</strong> ${data.user_name || "Anônimo"}</p>
              <p><strong>📅 Data:</strong> ${now}</p>
              ${data.message ? `<p style="font-style: italic; color: #666; margin-top: 10px;">"${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}"</p>` : ''}
            </div>
            <a href="https://nelloone.lovable.app/admin/depoimentos" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Revisar Depoimento
            </a>
          </div>
        `,
      };

    case "support_ticket":
      return {
        subject: `📩 Novo Ticket de Suporte - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
              📩 Novo Ticket de Suporte!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 De:</strong> ${data.user_name || "Não informado"} (${data.user_email || "sem email"})</p>
              <p><strong>📅 Data:</strong> ${now}</p>
              ${data.message ? `<p style="margin-top: 10px;"><strong>Mensagem:</strong><br/>${data.message.substring(0, 500)}${data.message.length > 500 ? '...' : ''}</p>` : ''}
            </div>
          </div>
        `,
      };

    case "test_completed":
      return {
        subject: `✅ Teste Concluído - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
              ✅ Teste Concluído!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>📝 Teste:</strong> ${data.test_name || "Não especificado"}</p>
              <p><strong>👤 Usuário:</strong> ${data.user_name || "Não informado"}</p>
              <p><strong>📅 Data:</strong> ${now}</p>
            </div>
          </div>
        `,
      };

    case "essence_map_generated":
      return {
        subject: `🗺️ Código da Essência Gerado - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">
              🗺️ Novo Código da Essência Gerado!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 Usuário:</strong> ${data.user_name || "Não informado"}</p>
              <p><strong>📧 Email:</strong> ${data.user_email || "Não informado"}</p>
              <p><strong>📅 Data:</strong> ${now}</p>
            </div>
            <a href="https://nelloone.lovable.app/admin/codigo-essencia" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Ver no Admin
            </a>
          </div>
        `,
      };

    case "affiliate_sale":
      const affCurrency = data.currency === "USD" ? "$" : data.currency === "EUR" ? "€" : "R$";
      return {
        subject: `🤝 Nova Venda de Afiliado - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
              🤝 Nova Venda via Afiliado!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 Afiliado:</strong> ${data.affiliate_name || "Não informado"}</p>
              <p><strong>💰 Valor da Venda:</strong> ${affCurrency}${data.amount?.toFixed(2)}</p>
              <p><strong>💵 Comissão:</strong> ${affCurrency}${data.commission?.toFixed(2)}</p>
              <p><strong>🛒 Produto:</strong> ${data.product || "Não especificado"}</p>
              <p><strong>📅 Data:</strong> ${now}</p>
            </div>
            <a href="https://nelloone.lovable.app/admin/afiliados" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Ver Afiliados
            </a>
          </div>
        `,
      };

    case "crossing_accepted":
      return {
        subject: `💕 Cruzamento Aceito - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">
              💕 Convite de Cruzamento Aceito!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 Usuário:</strong> ${data.user_name || "Não informado"}</p>
              <p><strong>💑 Parceiro:</strong> ${data.partner_name || "Não informado"}</p>
              <p><strong>📅 Data:</strong> ${now}</p>
            </div>
          </div>
        `,
      };

    case "journey_completed":
      return {
        subject: `🎉 Jornada Completa! ${data.user_name || "Usuário"} - NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
              🎉 Jornada NELLO ONE Concluída!
            </h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 Usuário:</strong> ${data.user_name || "Não informado"}</p>
              <p><strong>📧 Email:</strong> ${data.user_email || "Não informado"}</p>
              <p><strong>📅 Conclusão:</strong> ${now}</p>
              <p><strong>⏱️ Duração:</strong> ${data.journey_duration || "N/A"}</p>
            </div>
            <p style="color: #666; margin-bottom: 20px;">O usuário completou todos os 7 testes da jornada!</p>
            <a href="https://nelloone.lovable.app/admin/usuarios" 
               style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Ver no Admin
            </a>
          </div>
        `,
      };

    default:
      return {
        subject: `📢 Notificação NELLO ONE`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a;">📢 Nova Notificação</h1>
            <p>Tipo: ${eventType}</p>
            <p>Data: ${now}</p>
            <pre style="background: #f8fafc; padding: 10px; border-radius: 4px;">${JSON.stringify(data, null, 2)}</pre>
          </div>
        `,
      };
  }
}

// Get WhatsApp message for each event type
function getWhatsAppMessage(eventType: EventType, data: NotifyAdminRequest["data"]): string {
  const currencySymbol = data.currency === "USD" ? "$" : data.currency === "EUR" ? "€" : "R$";
  
  switch (eventType) {
    case "new_purchase":
      return `💰 *Nova venda NELLO ONE!*\n\nProduto: ${data.product || "N/A"}\nValor: ${currencySymbol}${data.amount?.toFixed(2)}\nCliente: ${data.user_name || "N/A"}\n\n👉 nelloone.lovable.app/admin`;

    case "new_signup":
      return `👤 *Novo cadastro NELLO ONE!*\n\nNome: ${data.user_name || "N/A"}\nEmail: ${data.user_email || "N/A"}\n\n👉 nelloone.lovable.app/admin`;

    case "new_testimonial":
      return `💬 *Novo depoimento NELLO ONE!*\n\nDe: ${data.user_name || "Anônimo"}\n\n👉 nelloone.lovable.app/admin/depoimentos`;

    case "support_ticket":
      return `📩 *Novo ticket de suporte!*\n\nDe: ${data.user_name || "N/A"}\nEmail: ${data.user_email || "N/A"}\n\n👉 Verifique o email para detalhes`;

    case "test_completed":
      return `✅ *Teste concluído!*\n\nTeste: ${data.test_name || "N/A"}\nUsuário: ${data.user_name || "N/A"}`;

    case "essence_map_generated":
      return `🗺️ *Código da Essência gerado!*\n\nUsuário: ${data.user_name || "N/A"}\n\n👉 nelloone.lovable.app/admin/codigo-essencia`;

    case "affiliate_sale":
      return `🤝 *Nova venda de afiliado!*\n\nAfiliado: ${data.affiliate_name || "N/A"}\nVenda: ${currencySymbol}${data.amount?.toFixed(2)}\nComissão: ${currencySymbol}${data.commission?.toFixed(2)}`;

    case "crossing_accepted":
      return `💕 *Cruzamento aceito!*\n\n${data.user_name || "Alguém"} aceitou o convite de ${data.partner_name || "parceiro"}`;

    case "journey_completed":
      return `🎉 *Jornada NELLO ONE completa!*\n\n👤 ${data.user_name || "Usuário"}\n📧 ${data.user_email || "N/A"}\n⏱️ ${data.journey_duration || "N/A"}\n\nO usuário completou todos os 7 testes!\n\n👉 nelloone.lovable.app/admin/usuarios`;

    default:
      return `📢 Notificação NELLO ONE: ${eventType}`;
  }
}

// Send WhatsApp via Twilio
async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    logStep("WhatsApp not configured - missing Twilio credentials");
    return false;
  }

  try {
    const formattedTo = to.startsWith("+") ? to : `+${to}`;
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append("From", TWILIO_WHATSAPP_NUMBER);
    formData.append("To", `whatsapp:${formattedTo}`);
    formData.append("Body", message);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      logStep("WhatsApp send failed", { error: result });
      return false;
    }

    logStep("WhatsApp sent successfully", { sid: result.sid });
    return true;
  } catch (error) {
    logStep("WhatsApp error", { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

// Log notification
async function logNotification(
  eventType: string,
  channel: string,
  recipient: string,
  status: string,
  payload: unknown,
  errorMessage?: string
) {
  try {
    await supabase.from("admin_notification_logs").insert({
      event_type: eventType,
      channel,
      recipient,
      status,
      payload,
      error_message: errorMessage,
    });
  } catch (error) {
    logStep("Failed to log notification", { error });
  }
}

// Get all admin users with their notification preferences
async function getAdminNotificationPreferences(eventType: EventType) {
  // Get all admin users
  const { data: adminRoles } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  if (!adminRoles || adminRoles.length === 0) {
    logStep("No admin users found");
    return [];
  }

  const adminUserIds = adminRoles.map(r => r.user_id);
  
  // Get notification settings for this event type
  const { data: settings } = await supabase
    .from("admin_notification_settings")
    .select("*")
    .in("admin_user_id", adminUserIds)
    .eq("event_type", eventType);

  // Get contact info
  const { data: contacts } = await supabase
    .from("admin_notification_contacts")
    .select("*")
    .in("admin_user_id", adminUserIds);

  // Get admin emails from auth
  const adminsWithPrefs = [];
  
  for (const adminId of adminUserIds) {
    const setting = settings?.find(s => s.admin_user_id === adminId);
    const contact = contacts?.find(c => c.admin_user_id === adminId);
    
    // If no specific setting, default to email only
    const notifyEmail = setting?.notify_email ?? true;
    const notifyWhatsapp = setting?.notify_whatsapp ?? false;
    const notifyPush = setting?.notify_push ?? false;

    // Get admin email
    const { data: authData } = await supabase.auth.admin.getUserById(adminId);
    const email = contact?.email_override || authData?.user?.email;
    const whatsappNumber = contact?.whatsapp_number;

    adminsWithPrefs.push({
      adminId,
      email,
      whatsappNumber,
      notifyEmail,
      notifyWhatsapp,
      notifyPush,
    });
  }

  return adminsWithPrefs;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_type, data }: NotifyAdminRequest = await req.json();

    logStep("Received notification request", { event_type, data });

    if (!event_type) {
      return new Response(
        JSON.stringify({ error: "event_type is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get admin preferences
    const admins = await getAdminNotificationPreferences(event_type);
    logStep("Found admins to notify", { count: admins.length });

    const results: Array<{ channel: string; success: boolean; recipient: string }> = [];

    for (const admin of admins) {
      // Send Email
      if (admin.notifyEmail && admin.email) {
        try {
          const emailContent = getEmailContent(event_type, data);
          
          const emailResult = await resend.emails.send({
            from: "NELLO ONE <noreply@nello.one>",
            to: [admin.email],
            subject: emailContent.subject,
            html: emailContent.html,
          });

          const success = !!emailResult?.data?.id;
          results.push({ channel: "email", success, recipient: admin.email });
          await logNotification(event_type, "email", admin.email, success ? "sent" : "failed", data);
          
          logStep("Email sent", { to: admin.email, success });
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          results.push({ channel: "email", success: false, recipient: admin.email });
          await logNotification(event_type, "email", admin.email, "failed", data, errorMsg);
          logStep("Email failed", { error: errorMsg });
        }
      }

      // Send WhatsApp
      if (admin.notifyWhatsapp && admin.whatsappNumber) {
        const message = getWhatsAppMessage(event_type, data);
        const success = await sendWhatsApp(admin.whatsappNumber, message);
        
        results.push({ channel: "whatsapp", success, recipient: admin.whatsappNumber });
        await logNotification(
          event_type, 
          "whatsapp", 
          admin.whatsappNumber, 
          success ? "sent" : "failed", 
          data,
          success ? undefined : "WhatsApp send failed"
        );

        // Fallback to email if WhatsApp fails
        if (!success && admin.email && !admin.notifyEmail) {
          logStep("WhatsApp failed, falling back to email");
          try {
            const emailContent = getEmailContent(event_type, data);
            await resend.emails.send({
              from: "NELLO ONE <noreply@nello.one>",
              to: [admin.email],
              subject: `[Fallback] ${emailContent.subject}`,
              html: emailContent.html,
            });
            results.push({ channel: "email_fallback", success: true, recipient: admin.email });
          } catch {
            results.push({ channel: "email_fallback", success: false, recipient: admin.email });
          }
        }
      }
    }

    logStep("Notifications complete", { results });

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    logStep("Error in notify-admin", { error: error instanceof Error ? error.message : String(error) });
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
