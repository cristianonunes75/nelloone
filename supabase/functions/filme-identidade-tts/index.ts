import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is not configured");

    if (!text || text.length < 10) {
      throw new Error("Narration text is too short");
    }

    // Use Laura voice - warm, natural female voice good for narration
    // Using eleven_multilingual_v2 for Portuguese support
    const voiceId = "FGY2WhTYpPnrIDTdsKH5"; // Laura

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.7,
            style: 0.4,
            use_speaker_boost: true,
            speed: 0.85, // Slightly slower for contemplative narration
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs TTS error:", response.status, errorText);
      throw new Error(`TTS generation failed: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = base64Encode(audioBuffer);

    return new Response(
      JSON.stringify({ audioContent: audioBase64 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("filme-identidade-tts error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
