import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, body, icon, url, targetUserIds, notifyAdmins, sendEmail, ticketData } = await req.json();

    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'title and body are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let subscriptions: Array<{ id: string; user_id: string; endpoint: string; p256dh_key: string; auth_key: string }> = [];
    let adminUserIds: string[] = [];

    if (notifyAdmins) {
      // Get all admin user IDs
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      adminUserIds = adminRoles?.map(r => r.user_id) || [];
      
      if (adminUserIds.length > 0) {
        const { data } = await supabase
          .from('push_subscriptions')
          .select('*')
          .in('user_id', adminUserIds);
        subscriptions = data || [];
      }
    } else if (targetUserIds && targetUserIds.length > 0) {
      const { data } = await supabase
        .from('push_subscriptions')
        .select('*')
        .in('user_id', targetUserIds);
      subscriptions = data || [];
    }

    console.log(`Found ${subscriptions.length} subscriptions to notify`);

    // Log notification to history
    const logEntry = {
      title,
      body,
      url: url || '/admin/comunicacao',
      status: 'sent',
      user_id: subscriptions.length > 0 ? subscriptions[0].user_id : null
    };

    await supabase.from('push_notifications_log').insert(logEntry);

    // Send email to admins if requested
    if (sendEmail && RESEND_API_KEY && ticketData) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        
        // Get admin emails
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .in('id', adminUserIds);

        // Get emails from auth.users via admin API
        for (const adminId of adminUserIds) {
          const { data: userData } = await supabase.auth.admin.getUserById(adminId);
          if (userData?.user?.email) {
            console.log(`Sending email notification to admin: ${userData.user.email}`);
            
            await resend.emails.send({
              from: "NELLO ONE <onboarding@resend.dev>",
              to: [userData.user.email],
              subject: `📩 Novo ticket de suporte: ${ticketData.subject || ticketData.category}`,
              html: `
                <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FCFCFC;">
                  <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #1A1A1A; font-size: 28px; margin: 0;">NELLO ONE</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 8px;">Novo ticket de suporte</p>
                  </div>
                  
                  <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <h2 style="color: #1A1A1A; font-size: 20px; margin: 0 0 16px;">📩 Nova mensagem recebida</h2>
                    
                    <div style="background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 16px 0;">
                      <p style="margin: 8px 0;"><strong>De:</strong> ${ticketData.name}</p>
                      <p style="margin: 8px 0;"><strong>Email:</strong> ${ticketData.email}</p>
                      <p style="margin: 8px 0;"><strong>Categoria:</strong> ${ticketData.category}</p>
                      ${ticketData.subject ? `<p style="margin: 8px 0;"><strong>Assunto:</strong> ${ticketData.subject}</p>` : ''}
                    </div>
                    
                    <div style="margin: 24px 0;">
                      <p style="color: #666; font-size: 14px; margin: 0 0 8px;">Mensagem:</p>
                      <p style="color: #1A1A1A; line-height: 1.6; white-space: pre-wrap;">${ticketData.message}</p>
                    </div>
                    
                    <a href="https://nello.one/admin/comunicacao" 
                       style="display: inline-block; background: #1F2E4B; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; margin-top: 16px;">
                      Responder Ticket
                    </a>
                  </div>
                  
                  <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
                    © 2025 NELLO ONE. Todos os direitos reservados.
                  </p>
                </div>
              `,
            });
          }
        }
        console.log('Email notifications sent to admins');
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError);
      }
    }

    if (subscriptions.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        sent: 0,
        message: 'No push subscriptions found, but notification logged'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/pwa-192x192.png',
      url: url || '/admin/comunicacao'
    });

    let successCount = 0;
    const failedSubscriptions: string[] = [];

    // Simple push notification without encryption (for testing)
    for (const sub of subscriptions) {
      try {
        const response = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'TTL': '86400',
          },
          body: payload,
        });

        if (response.ok || response.status === 201) {
          console.log(`Push sent to ${sub.id}`);
          successCount++;
        } else if (response.status === 410 || response.status === 404) {
          console.log(`Subscription ${sub.id} expired`);
          failedSubscriptions.push(sub.id);
        } else {
          console.log(`Push failed for ${sub.id}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error sending to ${sub.id}:`, error);
      }
    }

    // Remove expired subscriptions
    if (failedSubscriptions.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('id', failedSubscriptions);
      console.log(`Removed ${failedSubscriptions.length} expired subscriptions`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successCount,
      failed: failedSubscriptions.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Error in send-push function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
