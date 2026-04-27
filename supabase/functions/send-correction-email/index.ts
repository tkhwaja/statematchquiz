// One-shot correction email to the 6 recipients who got the bad $149 follow-up.
// After running, this function will be deleted.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const RECIPIENTS: Array<{ email: string; first_name: string }> = [
  { email: "kylieyoung9000@icloud.com", first_name: "" },
  { email: "Couponjoy619@gmail.com", first_name: "Joy" },
  { email: "lunch.gives.2y@icloud.com", first_name: "Kaitlyn" },
  { email: "washington.william@gmail.com", first_name: "Billiam" },
  { email: "mdtbbca6@gmail.com", first_name: "Deanna" },
  { email: "anita23anderson@gmail.com", first_name: "Anita" },
];

function buildHtml(firstName: string) {
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color:#111; line-height:1.6; font-size:15px;">
    <p>${greeting}</p>
    <p>I'm writing to correct an error you may have encountered when accessing your StateMatch results.</p>
    <p>A previous message incorrectly listed the price of the full report as <strong>$149</strong>. This was due to an internal mistake and does not reflect our actual pricing.</p>
    <p>The correct price for the full StateMatch report is <strong>$6.99</strong> &mdash; a one-time payment with immediate access.</p>
    <p>If you were interested in viewing your results, you can access them here:</p>
    <p style="text-align:center; margin: 28px 0;">
      <a href="https://statematchquiz.com/" style="background:#4F46E5; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">👉 Unlock your full report for $6.99</a>
    </p>
    <p>We apologize for any confusion this may have caused and appreciate your understanding.</p>
    <p>If you have any questions, feel free to reply directly to this email.</p>
    <p>Sincerely,<br/>StateMatch Team</p>
  </div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const results: any[] = [];
  for (const r of RECIPIENTS) {
    try {
      const { data, error } = await resend.emails.send({
        from: "StateMatch Team <support@statematchquiz.com>",
        to: [r.email],
        subject: "Correction: your StateMatch report is $6.99, not $149",
        html: buildHtml(r.first_name),
      });
      if (error) throw error;
      results.push({ email: r.email, status: "sent", id: data?.id });
      await supabase.from("email_send_log").insert({
        message_id: data?.id ?? null,
        template_name: "price_correction_oneshot",
        recipient_email: r.email,
        status: "sent",
      });
    } catch (e: any) {
      results.push({ email: r.email, status: "failed", error: e?.message ?? String(e) });
      await supabase.from("email_send_log").insert({
        template_name: "price_correction_oneshot",
        recipient_email: r.email,
        status: "failed",
        error_message: e?.message ?? String(e),
      });
    }
    await new Promise((res) => setTimeout(res, 300));
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
