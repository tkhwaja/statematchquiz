import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, results, statesData } = await req.json();

    if (!email || !results) {
      throw new Error("Email and results are required");
    }

    console.log("Sending report to:", email);

    // Build HTML email content
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 3px solid #4F46E5; padding-bottom: 10px;">
          Your StateMatch Report
        </h1>
        <p style="font-size: 16px; color: #666; margin-bottom: 30px;">
          Thank you for using StateMatch! Here are your top 5 personalized state recommendations:
        </p>
    `;

    results.forEach((result: any, index: number) => {
      const stateData = statesData?.find((s: any) => s.state_code === result.state);
      
      htmlContent += `
        <div style="background: #f9fafb; border-left: 4px solid #4F46E5; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
            <div>
              <h2 style="color: #111; margin: 0 0 5px 0; font-size: 24px;">
                #${index + 1} ${stateData?.state_name || result.state}
              </h2>
              <p style="color: #666; margin: 0; font-size: 18px;">
                📍 ${result.city}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; color: #666;">Match Score</div>
              <div style="font-size: 28px; font-weight: bold; color: #4F46E5;">${result.score}</div>
            </div>
          </div>
          
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
              <div><strong>Climate:</strong> ${stateData?.climate || 'N/A'}</div>
              <div><strong>Cost of Living:</strong> ${stateData?.cost_of_living || 'N/A'}</div>
              <div><strong>Politics:</strong> ${stateData?.politics || 'N/A'}</div>
              <div><strong>Healthcare:</strong> ${stateData?.healthcare_quality || 'N/A'}</div>
              <div><strong>Crime Level:</strong> ${stateData?.crime_level || 'N/A'}</div>
              <div><strong>Landscape:</strong> ${stateData?.landscape || 'N/A'}</div>
            </div>
          </div>
          
          ${stateData?.highlights ? `
            <div style="margin-top: 15px; padding: 12px; background: white; border-radius: 4px;">
              <strong style="color: #4F46E5;">Why This Match?</strong>
              <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #666;">
                ${stateData.highlights.map((h: string) => `<li style="margin: 4px 0;">${h}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    });

    htmlContent += `
        <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 4px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This report was generated based on your quiz responses. 
            We hope it helps you find your perfect state!
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "StateMatch <onboarding@resend.dev>",
      to: [email],
      subject: "Your StateMatch Report - Top 5 Recommendations",
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-report:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
