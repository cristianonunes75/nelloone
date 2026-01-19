import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  console.log(`[NELLO-ACCEPT-CRUZAMENTO] ${step}`, details ? JSON.stringify(details) : '');
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
      logStep('Auth error', { error: authError?.message });
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('User authenticated', { userId: user.id, email: user.email });

    const { invite_token } = await req.json();

    if (!invite_token) {
      return new Response(
        JSON.stringify({ error: 'invite_token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the crossing by invite_token
    const { data: crossing, error: crossingError } = await supabase
      .from('codigo_cruzamentos')
      .select('*')
      .eq('invite_token', invite_token)
      .single();

    if (crossingError || !crossing) {
      logStep('Crossing not found', { invite_token, error: crossingError?.message });
      return new Response(
        JSON.stringify({ error: 'Invalid invite token' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('Crossing found', { crossingId: crossing.id, status: crossing.status });

    // Check if already accepted
    if (crossing.user_b_consent_at) {
      logStep('Already accepted', { crossingId: crossing.id });
      return new Response(
        JSON.stringify({ error: 'Invitation already accepted', already_accepted: true }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if crossing is expired or declined
    if (crossing.status === 'expired' || crossing.status === 'declined') {
      logStep('Crossing is not valid', { status: crossing.status });
      return new Response(
        JSON.stringify({ error: 'Invitation is no longer valid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate: if user_b_id is already set, it must match the current user
    if (crossing.user_b_id && crossing.user_b_id !== user.id) {
      logStep('User mismatch', { expected: crossing.user_b_id, actual: user.id });
      return new Response(
        JSON.stringify({ error: 'This invitation is for a different user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate: if invite_email is set, it should match user's email
    if (crossing.invite_email) {
      const inviteEmail = crossing.invite_email.toLowerCase();
      const userEmail = user.email?.toLowerCase();
      
      if (userEmail && inviteEmail !== userEmail) {
        logStep('Email mismatch', { inviteEmail, userEmail });
        return new Response(
          JSON.stringify({ error: 'This invitation was sent to a different email address' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Prevent self-acceptance
    if (crossing.user_a_id === user.id) {
      logStep('Self acceptance blocked');
      return new Response(
        JSON.stringify({ error: 'You cannot accept your own invitation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the crossing with consent
    const now = new Date().toISOString();
    const { data: updatedCrossing, error: updateError } = await supabase
      .from('codigo_cruzamentos')
      .update({
        user_b_id: user.id,
        user_b_consent_at: now,
        invite_accepted_at: now,
        status: 'accepted'
      })
      .eq('id', crossing.id)
      .select()
      .single();

    if (updateError) {
      logStep('Update error', { error: updateError.message });
      throw updateError;
    }

    logStep('Crossing accepted successfully', { 
      crossingId: crossing.id, 
      user_b_id: user.id,
      status: 'accepted'
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        crossing: {
          id: updatedCrossing.id,
          status: updatedCrossing.status,
          user_b_consent_at: updatedCrossing.user_b_consent_at,
          invite_accepted_at: updatedCrossing.invite_accepted_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logStep('Error', { error: error instanceof Error ? error.message : 'Unknown error' });
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
