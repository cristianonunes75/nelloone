import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Generate SHA-1 hash of password
async function sha1Hash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();

    if (!password || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Minimum length check
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ breached: false, count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Checking password breach for password with length:', password.length);

    // Generate SHA-1 hash
    const hash = await sha1Hash(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    console.log('Hash prefix:', prefix);

    // Query HaveIBeenPwned API using k-Anonymity
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'Nello-Password-Checker',
        'Add-Padding': 'true', // Adds fake results to protect privacy
      },
    });

    if (!response.ok) {
      console.error('HIBP API error:', response.status);
      throw new Error('Failed to check password breach database');
    }

    const text = await response.text();
    const lines = text.split('\n');

    // Check if our suffix is in the results
    let breached = false;
    let count = 0;

    for (const line of lines) {
      const [hashSuffix, countStr] = line.trim().split(':');
      if (hashSuffix === suffix) {
        breached = true;
        count = parseInt(countStr, 10) || 0;
        break;
      }
    }

    console.log('Password breach check result:', { breached, count });

    return new Response(
      JSON.stringify({ breached, count }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking password breach:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check password breach' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
