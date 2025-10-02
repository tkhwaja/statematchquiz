import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, MapPin } from "lucide-react";
import { calculateScores } from "@/lib/scoring";
import { StateScore, AnswerMap } from "@/lib/types";
import statesData from "@/data/states.json";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CloudBackground from "@/components/CloudBackground";

const ResultFull = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<StateScore[]>([]);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const savedAnswers = sessionStorage.getItem("quizAnswers");
    if (!savedAnswers) {
      navigate("/");
      return;
    }

    const answers: AnswerMap = JSON.parse(savedAnswers);
    const scores = calculateScores(answers);
    setResults(scores);

    // Check if coming from successful payment
    const sessionId = searchParams.get("session_id");
    const savedEmail = sessionStorage.getItem("reportEmail");
    
    if (sessionId && savedEmail && !emailSent) {
      // Send email with report
      sendReportEmail(savedEmail, scores);
    }
  }, [navigate, searchParams, emailSent]);

  const sendReportEmail = async (email: string, scores: StateScore[]) => {
    try {
      const { error } = await supabase.functions.invoke("send-report", {
        body: { email, results: scores, statesData },
      });

      if (error) throw error;

      toast.success("Report sent to your email!");
      setEmailSent(true);
      sessionStorage.removeItem("reportEmail");
    } catch (error: any) {
      console.error("Email sending error:", error);
      toast.error("Failed to send email. Please contact support.");
    }
  };

  const getStateData = (stateCode: string) => {
    return statesData.find(s => s.state_code === stateCode);
  };

  const handleDownload = () => {
    const savedEmail = sessionStorage.getItem("reportEmail");
    if (savedEmail && results.length > 0 && !emailSent) {
      sendReportEmail(savedEmail, results);
    } else {
      toast.info("Report already sent to your email!");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <CloudBackground />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Your Complete StateMatch Report</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Here are your top 5 personalized recommendations
            </p>
            <Button variant="hero" size="lg" onClick={handleDownload}>
              <Download className="mr-2 h-5 w-5" />
              {emailSent ? "Resend Report to Email" : "Send Report to Email"}
            </Button>
          </div>

          <div className="space-y-6">
            {results.map((result, index) => {
              const stateData = getStateData(result.state);
              return (
                <Card key={result.state} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-4xl font-bold mb-1">#{index + 1}</div>
                        <CardTitle className="text-3xl">{stateData?.state_name}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Match Score</div>
                        <div className="text-3xl font-bold text-primary">{result.score}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-accent" />
                      <span className="text-xl font-semibold">{result.city}</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold">Climate:</span> {stateData?.climate}
                        </div>
                        <div>
                          <span className="font-semibold">Cost of Living:</span> {stateData?.cost_of_living}
                        </div>
                        <div>
                          <span className="font-semibold">Politics:</span> {stateData?.politics}
                        </div>
                        <div>
                          <span className="font-semibold">Healthcare:</span> {stateData?.healthcare_quality}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold">Abortion Laws:</span> {stateData?.abortion_laws}
                        </div>
                        <div>
                          <span className="font-semibold">Gun Laws:</span> {stateData?.gun_laws}
                        </div>
                        <div>
                          <span className="font-semibold">Crime Level:</span> {stateData?.crime_level}
                        </div>
                        <div>
                          <span className="font-semibold">Landscape:</span> {stateData?.landscape}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Why This Match?</h4>
                      <ul className="space-y-1">
                        {stateData?.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t bg-accent/10 -mx-6 px-6 py-4 -mb-6">
                      <p className="text-sm italic text-muted-foreground">
                        🎯 This location ranks #{index + 1} because it aligns strongly with your 
                        preferences for {stateData?.politics.toLowerCase()} values, {stateData?.climate.toLowerCase()} climate, 
                        and {stateData?.cost_of_living.toLowerCase()} cost of living. 
                        {result.city} offers the best combination of your priorities within {stateData?.state_name}.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultFull;
