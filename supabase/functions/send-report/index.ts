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
        <div style="background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-left: 5px solid #4F46E5; padding: 25px; margin-bottom: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header Section -->
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
            <div>
              <div style="display: inline-block; background: #4F46E5; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 10px;">
                #${index + 1} Match
              </div>
              <h2 style="color: #111; margin: 5px 0; font-size: 28px; font-weight: bold;">
                ${stateData?.state_name || result.state}
              </h2>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                <span style="font-size: 20px;">📍</span>
                <p style="color: #4F46E5; margin: 0; font-size: 20px; font-weight: 600;">
                  ${result.city}
                </p>
              </div>
            </div>
            <div style="text-align: right; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 15px 20px; border-radius: 12px; color: white; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin-bottom: 5px;">Match Score</div>
              <div style="font-size: 32px; font-weight: bold;">${result.score}</div>
            </div>
          </div>
          
          <!-- Key Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; padding: 12px;">
              <div style="font-size: 28px; margin-bottom: 5px;">🏠</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px;">Cost of Living</div>
              <div style="font-size: 16px; font-weight: bold; color: #111;">${stateData?.cost_of_living || 'N/A'}</div>
              ${stateData?.avg_home_price ? `<div style="font-size: 11px; color: #6b7280; margin-top: 3px;">${stateData.avg_home_price}</div>` : ''}
            </div>
            <div style="text-align: center; padding: 12px;">
              <div style="font-size: 28px; margin-bottom: 5px;">☀️</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px;">Climate</div>
              <div style="font-size: 16px; font-weight: bold; color: #111;">${stateData?.climate || 'N/A'}</div>
              ${stateData?.avg_temp ? `<div style="font-size: 11px; color: #6b7280; margin-top: 3px;">${stateData.avg_temp}</div>` : ''}
            </div>
            <div style="text-align: center; padding: 12px;">
              <div style="font-size: 28px; margin-bottom: 5px;">💼</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px;">Job Market</div>
              <div style="font-size: 16px; font-weight: bold; color: #111;">${stateData?.job_market || 'Good'}</div>
              ${stateData?.avg_salary ? `<div style="font-size: 11px; color: #6b7280; margin-top: 3px;">${stateData.avg_salary}</div>` : ''}
            </div>
          </div>
          
          <!-- Detailed Information Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; padding: 15px; background: #fafbfc; border-radius: 8px;">
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="font-size: 18px;">🗳️</span>
              <div>
                <strong style="font-size: 13px; color: #374151;">Politics:</strong>
                <div style="font-size: 13px; color: #6b7280;">${stateData?.politics || 'N/A'}</div>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="font-size: 18px;">🏥</span>
              <div>
                <strong style="font-size: 13px; color: #374151;">Healthcare:</strong>
                <div style="font-size: 13px; color: #6b7280;">${stateData?.healthcare_quality || 'N/A'}</div>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="font-size: 18px;">🔒</span>
              <div>
                <strong style="font-size: 13px; color: #374151;">Crime Level:</strong>
                <div style="font-size: 13px; color: #6b7280;">${stateData?.crime_level || 'N/A'}</div>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="font-size: 18px;">🎓</span>
              <div>
                <strong style="font-size: 13px; color: #374151;">Education:</strong>
                <div style="font-size: 13px; color: #6b7280;">${stateData?.education_quality || 'Good'}</div>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="font-size: 18px;">👶</span>
              <div>
                <strong style="font-size: 13px; color: #374151;">Abortion Laws:</strong>
                <div style="font-size: 13px; color: #6b7280;">${stateData?.abortion_laws || 'N/A'}</div>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="font-size: 18px;">🔫</span>
              <div>
                <strong style="font-size: 13px; color: #374151;">Gun Laws:</strong>
                <div style="font-size: 13px; color: #6b7280;">${stateData?.gun_laws || 'N/A'}</div>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="font-size: 18px;">🏞️</span>
              <div>
                <strong style="font-size: 13px; color: #374151;">Landscape:</strong>
                <div style="font-size: 13px; color: #6b7280;">${stateData?.landscape || 'N/A'}</div>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 10px;">
              <span style="font-size: 18px;">🎨</span>
              <div>
                <strong style="font-size: 13px; color: #374151;">Culture:</strong>
                <div style="font-size: 13px; color: #6b7280;">${stateData?.culture || 'Diverse'}</div>
              </div>
            </div>
          </div>

          ${stateData?.major_industries ? `
            <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 8px; border-left: 3px solid #4F46E5;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 18px;">🏭</span>
                <strong style="color: #4F46E5; font-size: 14px;">Major Industries</strong>
              </div>
              <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">${stateData.major_industries}</div>
            </div>
          ` : ''}
          
          ${stateData?.highlights ? `
            <div style="margin: 20px 0; padding: 18px; background: white; border-radius: 8px; border: 2px solid #4F46E5;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 20px;">🎯</span>
                <strong style="color: #4F46E5; font-size: 16px;">Why This Match?</strong>
              </div>
              <ul style="margin: 8px 0 0 0; padding-left: 0; list-style: none;">
                ${stateData.highlights.map((h: string) => `
                  <li style="margin: 8px 0; padding-left: 25px; position: relative; color: #4b5563; font-size: 13px; line-height: 1.6;">
                    <span style="position: absolute; left: 0; color: #4F46E5; font-weight: bold;">✓</span>
                    ${h}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${stateData?.fun_fact ? `
            <div style="margin: 20px 0; padding: 18px; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 8px; border-left: 4px solid #F59E0B;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                <span style="font-size: 20px;">💡</span>
                <strong style="color: #92400E; font-size: 14px;">Did You Know?</strong>
              </div>
              <p style="margin: 0; color: #78350F; font-size: 13px; line-height: 1.6; font-style: italic;">${stateData.fun_fact}</p>
            </div>
          ` : ''}

          ${stateData?.lifestyle ? `
            <div style="margin: 20px 0; padding: 18px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                <span style="font-size: 18px;">🌟</span>
                <strong style="color: #374151; font-size: 14px;">What to Expect</strong>
              </div>
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.7;">${stateData.lifestyle}</p>
            </div>
          ` : ''}

          <!-- Summary Footer -->
          <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 8px; border: 1px solid #4F46E5;">
            <p style="margin: 0; color: #4b5563; font-size: 13px; line-height: 1.7;">
              <strong style="color: #4F46E5;">Perfect Match Summary:</strong> This location ranks <strong style="color: #4F46E5;">#${index + 1}</strong> because it strongly aligns with your preferences for <strong>${stateData?.politics?.toLowerCase() || 'various'}</strong> values, <strong>${stateData?.climate?.toLowerCase() || 'favorable'}</strong> climate, and <strong>${stateData?.cost_of_living?.toLowerCase() || 'reasonable'}</strong> cost of living. ${result.city} represents the optimal balance of your priorities within ${stateData?.state_name}, offering an ideal environment for your lifestyle and values.
            </p>
          </div>
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
