import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a helpful customer support assistant for StateMatch Quiz (statematchquiz.com).

PRODUCT INFORMATION:
- StateMatch Quiz helps people find their ideal US state and city to live in
- Users take a 30-question quiz covering climate, cost of living, politics, lifestyle, and more
- The quiz matches their preferences with comprehensive data for all 50 US states

PRICING:
- Free preview: See top 3 state matches immediately after quiz
- Full report: $7 one-time payment
- Full report includes: Top 10 state matches with detailed scores, city recommendations for each state, insights on politics, climate, cost of living, healthcare, crime levels, and more

REFUND POLICY:
- 30-day money-back guarantee
- No questions asked
- Contact: support@statematchquiz.com

COMMON QUESTIONS:
- Quiz takes about 5 minutes to complete
- Results are based on 20+ data points including government statistics, climate data, cost of living indices
- Report is delivered via email and can be downloaded as PDF
- Data is secure, encrypted, payment via Stripe
- We never sell user data

ESCALATION:
For refund requests, complex issues, or complaints, tell users to email support@statematchquiz.com and a team member will respond within 24 hours.

Be friendly, concise, and helpful. If you don't know something, admit it and direct them to support@statematchquiz.com.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("customer-support error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
