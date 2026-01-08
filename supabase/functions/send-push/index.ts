import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, body, icon, url, targetUserIds, notifyAdmins } = await req.json();

    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'title and body are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let subscriptions: Array<{ id: string; endpoint: string; p256dh_key: string; auth_key: string }> = [];

    if (notifyAdmins) {
      // Get all admin user IDs
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      const adminIds = adminRoles?.map(r => r.user_id) || [];
      
      if (adminIds.length > 0) {
        const { data } = await supabase
          .from('push_subscriptions')
          .select('*')
          .in('user_id', adminIds);
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

    if (subscriptions.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        sent: 0,
        message: 'No subscriptions found'
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
    // In production, you would use proper Web Push encryption
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
