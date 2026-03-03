import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { emails } = await req.json();
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(JSON.stringify({ error: "emails array required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all active tests
    const { data: allTests, error: testsError } = await supabaseAdmin
      .from("tests")
      .select("id")
      .eq("active", true);

    if (testsError || !allTests) {
      return new Response(JSON.stringify({ error: "Failed to fetch tests" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // List all auth users to find matches
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const emailToUser = new Map<string, { id: string; email: string }>();
    for (const u of authUsers?.users || []) {
      if (u.email) emailToUser.set(u.email.toLowerCase(), { id: u.id, email: u.email });
    }

    const processed: string[] = [];
    const pending: string[] = [];
    const errors: string[] = [];

    for (const rawEmail of emails) {
      const email = rawEmail.trim().toLowerCase();
      const existingUser = emailToUser.get(email);

      if (existingUser) {
        // User exists — grant access immediately
        try {
          // Insert test_purchases for all tests
          for (const test of allTests) {
            await supabaseAdmin.from("test_purchases").upsert({
              user_id: existingUser.id,
              test_id: test.id,
              payment_status: "completed",
              payment_method: "founder_grant",
              price_paid: 0,
              currency: "BRL",
              purchase_category: "jornada_completa",
            }, { onConflict: "user_id,test_id", ignoreDuplicates: true });
          }

          // Update profile flags
          await supabaseAdmin
            .from("profiles")
            .update({ ativacao_codigo_unlocked: true })
            .eq("id", existingUser.id);

          processed.push(email);
          console.log(`✅ Granted access to ${email} (${existingUser.id})`);
        } catch (e) {
          console.error(`Error granting access to ${email}:`, e);
          errors.push(`${email}: ${e.message}`);
        }
      } else {
        // User doesn't exist — store pending grant
        const { error: pendingError } = await supabaseAdmin
          .from("pending_cortesia_grants")
          .insert({
            email,
            granted_by: user.email || user.id,
            status: "pending",
          });

        if (pendingError) {
          console.error(`Error creating pending grant for ${email}:`, pendingError);
          errors.push(`${email}: ${pendingError.message}`);
        } else {
          pending.push(email);
          console.log(`⏳ Pending grant created for ${email}`);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed,
      pending,
      errors,
      tests_granted: allTests.length,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in grant-cortesia-access:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
