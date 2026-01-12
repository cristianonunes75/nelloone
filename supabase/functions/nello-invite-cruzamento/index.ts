import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface InviteRequest {
  email: string;
  relationshipType: 'spouse' | 'parent_child' | 'siblings' | 'friends';
  locale?: string;
}

const TRANSLATIONS = {
  pt: {
    spouse: {
      subject: 'Convite para Relatório de Casal',
      heading: 'Convite para Cruzamento de Perfis',
      body: 'convidou você para criar um Relatório de Casal baseado nos Códigos da Essência de vocês.',
      cta: 'Aceitar Convite',
      footer: 'Este relatório ajudará vocês a entenderem melhor um ao outro.'
    },
    parent_child: {
      subject: 'Convite para Relatório Familiar',
      heading: 'Convite para Cruzamento de Perfis',
      body: 'convidou você para criar um Relatório Familiar baseado nos Códigos da Essência.',
      cta: 'Aceitar Convite',
      footer: 'Este relatório fortalecerá a comunicação familiar.'
    },
    siblings: {
      subject: 'Convite para Relatório entre Irmãos',
      heading: 'Convite para Cruzamento de Perfis',
      body: 'convidou você para criar um Relatório entre Irmãos.',
      cta: 'Aceitar Convite',
      footer: 'Este relatório ajudará vocês a se entenderem melhor.'
    },
    friends: {
      subject: 'Convite para Relatório de Amizade',
      heading: 'Convite para Cruzamento de Perfis',
      body: 'convidou você para criar um Relatório de Amizade.',
      cta: 'Aceitar Convite',
      footer: 'Este relatório fortalecerá a amizade de vocês.'
    }
  },
  en: {
    spouse: {
      subject: 'Couple Report Invitation',
      heading: 'Profile Crossing Invitation',
      body: 'invited you to create a Couple Report based on your Essence Codes.',
      cta: 'Accept Invitation',
      footer: 'This report will help you understand each other better.'
    },
    parent_child: {
      subject: 'Family Report Invitation',
      heading: 'Profile Crossing Invitation',
      body: 'invited you to create a Family Report based on your Essence Codes.',
      cta: 'Accept Invitation',
      footer: 'This report will strengthen family communication.'
    },
    siblings: {
      subject: 'Sibling Report Invitation',
      heading: 'Profile Crossing Invitation',
      body: 'invited you to create a Sibling Report.',
      cta: 'Accept Invitation',
      footer: 'This report will help you understand each other better.'
    },
    friends: {
      subject: 'Friendship Report Invitation',
      heading: 'Profile Crossing Invitation',
      body: 'invited you to create a Friendship Report.',
      cta: 'Accept Invitation',
      footer: 'This report will strengthen your friendship.'
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, relationshipType, locale = 'pt' } = await req.json() as InviteRequest;

    if (!email || !relationshipType) {
      return new Response(
        JSON.stringify({ error: 'email and relationshipType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get inviter's profile
    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const inviterName = inviterProfile?.full_name || 'Alguém';

    // Check if invited user exists
    const { data: invitedUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase());

    const invitedUserId = invitedUsers?.[0]?.id || null;

    // Check if crossing already exists
    const { data: existingCrossing } = await supabase
      .from('codigo_cruzamentos')
      .select('id, status')
      .eq('user_a_id', user.id)
      .eq('invite_email', email.toLowerCase())
      .single();

    if (existingCrossing && existingCrossing.status !== 'expired' && existingCrossing.status !== 'declined') {
      return new Response(
        JSON.stringify({ error: 'Invite already sent', existingId: existingCrossing.id }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create crossing record
    const { data: crossing, error: insertError } = await supabase
      .from('codigo_cruzamentos')
      .insert({
        user_a_id: user.id,
        user_b_id: invitedUserId,
        relationship_type: relationshipType,
        invite_email: email.toLowerCase(),
        user_a_consent_at: new Date().toISOString(), // Inviter automatically consents
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating crossing:', insertError);
      throw insertError;
    }

    // Send invitation email
    if (RESEND_API_KEY) {
      const lang = locale === 'en' ? 'en' : 'pt';
      const t = TRANSLATIONS[lang][relationshipType];
      
      const acceptUrl = `${Deno.env.get('SITE_URL') || 'https://nello.one'}/aceitar-cruzamento/${crossing.invite_token}`;
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px; }
            .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            .logo { font-size: 24px; font-weight: bold; color: #7c3aed; margin-bottom: 24px; }
            h1 { font-size: 20px; color: #111827; margin: 0 0 16px; }
            p { color: #6b7280; line-height: 1.6; margin: 0 0 16px; }
            .inviter { color: #7c3aed; font-weight: 600; }
            .cta { display: inline-block; background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { font-size: 12px; color: #9ca3af; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">✦ Nello One</div>
            <h1>${t.heading}</h1>
            <p><span class="inviter">${inviterName}</span> ${t.body}</p>
            <a href="${acceptUrl}" class="cta">${t.cta}</a>
            <p class="footer">${t.footer}</p>
          </div>
        </body>
        </html>
      `;

      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Nello One <noreply@nello.one>',
            to: email,
            subject: t.subject,
            html: emailHtml,
          }),
        });

        if (emailResponse.ok) {
          await supabase
            .from('codigo_cruzamentos')
            .update({ invite_sent_at: new Date().toISOString() })
            .eq('id', crossing.id);
        } else {
          console.error('Email send failed:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the request if email fails
      }
    }

    console.log('Crossing invite created:', crossing.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        crossingId: crossing.id,
        inviteToken: crossing.invite_token
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in nello-invite-cruzamento:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
