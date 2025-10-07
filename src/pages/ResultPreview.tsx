import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostHog } from "@/contexts/PostHogContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, MapPin } from "lucide-react";
import { calculateScores } from "@/lib/scoring";
import { StateScore, AnswerMap } from "@/lib/types";
import statesData from "@/data/states.json";
import CloudBackground from "@/components/CloudBackground";

const ResultPreview = () => {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const [results, setResults] = useState<StateScore[]>([]);

  useEffect(() => {
    posthog.capture('page_view', { page: 'result_preview' });
    
    const savedAnswers = localStorage.getItem("quizAnswers");
    if (!savedAnswers) {
      navigate("/");
      return;
    }

    const answers: AnswerMap = JSON.parse(savedAnswers);
    const scores = calculateScores(answers);
    setResults(scores);
  }, [navigate]);

  const lockedResults = results.slice(0, 3);
  const unlockedResults = results.slice(3, 5).filter(r => r.state && r.city);

  const getStateData = (stateCode: string) => {
    return statesData.find(s => s.state_code === stateCode);
  };

  return (
    <div className="min-h-screen py-12">
      <CloudBackground />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Top Matches</h1>
            <p className="text-lg text-muted-foreground">
              Here are your personalized state and city recommendations
            </p>
          </div>

          {/* Locked Results */}
          <div className="space-y-6 mb-8">
            {lockedResults.map((result, index) => {
              const stateData = getStateData(result.state);
              return (
                <Card key={result.state} className="relative overflow-hidden">
                  <div className="absolute inset-0 blur-card bg-muted/50 backdrop-blur-md z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-primary mx-auto mb-3" />
                      <p className="text-lg font-semibold">Rank #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">Unlock to see details</p>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1">#{index + 1}</div>
                        <CardTitle className="text-2xl">{stateData?.state_name}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Match Score</div>
                        <div className="text-2xl font-bold text-primary">{result.score}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-accent" />
                      <span className="text-lg font-medium">{result.city}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Unlock CTA */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 mb-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Your Top 5 picks are ready!</h3>
              <p className="text-muted-foreground mb-6">
                Unlock them to see why they're a perfect fit, including detailed insights on climate, 
                cost of living, healthcare, and more.
              </p>
              <Button size="lg" variant="hero" onClick={() => navigate("/checkout")}>
                Unlock Full Report
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                One-time purchase • Instant download • Report delivered to your email
              </p>
            </CardContent>
          </Card>

          {/* Unlocked Results */}
          <div className="space-y-6">
            {unlockedResults.map((result, index) => {
              const stateData = getStateData(result.state);
              return (
                <Card key={result.state}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1">#{index + 4}</div>
                        <CardTitle className="text-2xl">{stateData?.state_name}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Match Score</div>
                        <div className="text-2xl font-bold text-primary">{result.score}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-accent" />
                      <span className="text-lg font-medium">{result.city}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
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
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        {stateData?.highlights.slice(0, 2).join(" • ")}
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

export default ResultPreview;
