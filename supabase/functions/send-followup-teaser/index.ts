// Cron-triggered edge function: sends a 24h follow-up "teaser" email to
// quiz-takers who captured their email but haven't paid for the full report.
// Reveals their #5 state in full detail and teases the locked top 4.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@4.0.0";
import questionsData from "../_shared/followup-data/questions.json" with { type: "json" };
import statesData from "../_shared/followup-data/states.json" with { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

type AnswerMap = Record<string, string>;
interface StateScore { state: string; city: string; score: number }

function calculateScores(answers: AnswerMap): StateScore[] {
  const stateScores: Record<string, number> = {};
  (statesData as any[]).forEach(s => { stateScores[s.state_code] = 0; });

  (questionsData as any[]).forEach(q => {
    const choiceId = answers[q.id];
    if (!choiceId) return;
    const choice = q.choices.find((c: any) => c.id === choiceId);
    if (!choice) return;
    Object.entries(choice.weights as Record<string, number>).forEach(([code, w]) => {
      stateScores[code] = (stateScores[code] || 0) + w;
    });
  });

  return Object.entries(stateScores)
    .map(([code, score]) => {
      const sd: any = (statesData as any[]).find(s => s.state_code === code);
      return { state: code, city: sd?.top_cities?.[0] || "", score };
    })
    .filter(r => r.city)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function buildTeaserHtml(name: string | null, results: StateScore[]) {
  const fifth = results[4];
  const sd: any = (statesData as any[]).find(s => s.state_code === fifth.state);
  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hi there,";

  const top4Teasers = results.slice(0, 4).map((r, i) => `
    <div style="display:flex; align-items:center; gap:12px; padding:14px 16px; background:#f3f4f6; border-radius:8px; margin-bottom:8px; filter:blur(0); position:relative;">
      <div style="font-size:20px; font-weight:bold; color:#9ca3af; min-width:32px;">#${i + 1}</div>
      <div style="flex:1; font-size:16px; color:#9ca3af; letter-spacing:6px; font-weight:bold;">●●●●●●●●</div>
      <div style="font-size:18px;">🔒</div>
    </div>
  `).join("");

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color:#111;">
    <h1 style="color:#4F46E5; margin-bottom: 8px;">${greeting} 👋</h1>
    <p style="font-size:16px; color:#374151; line-height:1.6;">
      We noticed you didn't grab your <strong>full StateMatch report</strong> yet. As a reminder,
      here's the <strong>#5 state</strong> we matched you with — yours to keep, free.
    </p>

    <div style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-left: 5px solid #4F46E5; padding: 25px; margin: 24px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <div style="display:inline-block; background:#4F46E5; color:white; padding:5px 15px; border-radius:20px; font-size:13px; font-weight:bold; margin-bottom:10px;">#5 Match</div>
      <h2 style="color:#1a1a1a; margin:5px 0; font-size:28px;">${sd?.state_name || fifth.state}</h2>
      <p style="color:#4F46E5; margin:4px 0 16px; font-size:18px; font-weight:600;">📍 ${fifth.city}</p>

      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:16px 0; padding:12px; background:white; border-radius:8px; border:1px solid #e5e7eb;">
        <div style="text-align:center;">
          <div style="font-size:22px;">🏠</div>
          <div style="font-size:10px; color:#6b7280; text-transform:uppercase;">Cost of Living</div>
          <div style="font-size:14px; font-weight:bold;">${sd?.cost_of_living || "N/A"}</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:22px;">☀️</div>
          <div style="font-size:10px; color:#6b7280; text-transform:uppercase;">Climate</div>
          <div style="font-size:14px; font-weight:bold;">${sd?.climate || "N/A"}</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:22px;">💼</div>
          <div style="font-size:10px; color:#6b7280; text-transform:uppercase;">Jobs</div>
          <div style="font-size:14px; font-weight:bold;">${sd?.job_market || "Good"}</div>
        </div>
      </div>

      ${sd?.highlights ? `
        <div style="margin-top:16px; padding:14px; background:white; border-radius:8px; border:2px solid #4F46E5;">
          <strong style="color:#4F46E5;">🎯 Why this match?</strong>
          <ul style="margin:8px 0 0; padding-left:0; list-style:none;">
            ${sd.highlights.map((h: string) => `<li style="margin:6px 0; padding-left:22px; position:relative; color:#4b5563; font-size:13px;"><span style="position:absolute; left:0; color:#4F46E5;">✓</span>${h}</li>`).join("")}
          </ul>
        </div>` : ""}

      ${sd?.fun_fact ? `<div style="margin-top:14px; padding:14px; background:#FEF3C7; border-radius:8px; border-left:4px solid #F59E0B;"><strong style="color:#92400E;">💡 Did you know?</strong><p style="margin:6px 0 0; color:#78350F; font-size:13px; font-style:italic;">${sd.fun_fact}</p></div>` : ""}
    </div>

    <h3 style="color:#111; margin-top:32px;">🔒 Your Top 4 are still locked</h3>
    <p style="color:#6b7280; font-size:14px; margin-bottom:16px;">
      Your <strong>#1 — #4 best-matched states</strong> are even stronger fits. Unlock them now:
    </p>
    ${top4Teasers}

    <div style="text-align:center; margin:32px 0;">
      <a href="https://statematchquiz.com/result/preview" style="display:inline-block; background:linear-gradient(135deg,#4F46E5,#7C3AED); color:white; padding:16px 40px; border-radius:8px; text-decoration:none; font-size:18px; font-weight:bold; box-shadow:0 4px 12px rgba(79,70,229,0.3);">
        Unlock My Full Report →
      </a>
      <p style="color:#9ca3af; font-size:12px; margin-top:12px;">One-time $149 — instant access</p>
    </div>

    <p style="color:#9ca3af; font-size:12px; text-align:center; margin-top:40px; border-top:1px solid #e5e7eb; padding-top:16px;">
      You're getting this because you completed the StateMatch quiz. Not interested? Just ignore this email.
    </p>
  </div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const now = new Date();
    const lowerBound = new Date(now.getTime() - 48 * 3600 * 1000).toISOString();
    const upperBound = new Date(now.getTime() - 22 * 3600 * 1000).toISOString();

    const { data: captures, error } = await supabase
      .from("email_captures")
      .select("id, email, name, quiz_answers, captured_at")
      .eq("paid", false)
      .is("followup_sent_at", null)
      .gte("captured_at", lowerBound)
      .lte("captured_at", upperBound)
      .limit(50);

    if (error) throw error;

    console.log(`Found ${captures?.length || 0} eligible captures for follow-up`);

    let sent = 0, failed = 0;
    for (const c of captures || []) {
      try {
        if (!c.quiz_answers) { failed++; continue; }
        const scores = calculateScores(c.quiz_answers as AnswerMap);
        if (scores.length < 5) { failed++; continue; }

        const html = buildTeaserHtml(c.name, scores);
        const sd: any = (statesData as any[]).find(s => s.state_code === scores[4].state);
        const subject = `${c.name ? c.name.split(" ")[0] + ", y" : "Y"}our #5 state match: ${sd?.state_name || scores[4].state} 🔓`;

        await resend.emails.send({
          from: "StateMatch Quiz <support@statematchquiz.com>",
          to: [c.email],
          subject,
          html,
        });

        await supabase
          .from("email_captures")
          .update({ followup_sent_at: new Date().toISOString() })
          .eq("id", c.id);
        sent++;
      } catch (e) {
        console.error(`Failed sending to ${c.email}:`, e);
        failed++;
      }
    }

    return new Response(JSON.stringify({ ok: true, eligible: captures?.length || 0, sent, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-followup-teaser error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
