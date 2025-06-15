
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { transcript, aiName, aiPersonality } = body;

    if (!transcript || !aiName) {
      return new Response(
        JSON.stringify({ error: "transcript and aiName are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = `
You are roleplaying as "${aiName}" (${aiPersonality}). Given the transcript of a speed-dating conversation, write a short, casual feedback message for the user. Keep it friendly and realistic, as if you were the character, and condense your feedback to 1-2 sentences. Example: "You were fun to talk to!" or "You talked a lot about yourself 😉." 

Transcript:
${transcript}

Feedback:
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a witty speed-dating advisor helping AI characters give friendly feedback to users in a casual tone.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 60,
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    const data = await response.json();
    const feedback =
      data.choices?.[0]?.message?.content?.trim() ||
      "You were interesting to talk to!";

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
