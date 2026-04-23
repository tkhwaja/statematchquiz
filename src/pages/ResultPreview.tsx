import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePostHog } from "@/contexts/PostHogContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Lock, Loader2 } from "lucide-react";
import { calculateScores } from "@/lib/scoring";
import { StateScore, AnswerMap } from "@/lib/types";
import statesData from "@/data/states.json";
import CloudBackground from "@/components/CloudBackground";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ResultPreview = () => {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const [results, setResults] = useState<StateScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    posthog.capture('results_viewed', { top_state: scores[0]?.state, total_results: scores.length });
  }, [navigate]);

  const getStateData = (stateCode: string) => {
    return statesData.find(s => s.state_code === stateCode);
  };

  const handleUnlock = async () => {
    const email = localStorage.getItem("capturedEmail");
    if (!email) {
      toast({ title: "Email required", description: "Please complete the email capture step first.", variant: "destructive" });
      navigate("/result/email-capture");
      return;
    }

    setIsLoading(true);
    posthog.capture('checkout_initiated', { top_state: results[0]?.state, price: 6.99 });

    try {
      localStorage.setItem("reportEmail", email);
      const answers = JSON.parse(localStorage.getItem("quizAnswers") || "{}");
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { email, answers, origin: window.location.origin },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast({ title: "Something went wrong", description: "Could not start checkout. Please try again.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  // Reverse so #5 is at top, #1 at bottom (countdown effect)
  const displayResults = [...results].reverse();

  return (
    <div className="min-h-screen py-12">
      <CloudBackground />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Top Matches Are Ready</h1>
            <p className="text-lg text-muted-foreground">
              Unlock your personalized state and city recommendations below
            </p>
          </div>

          {/* Free #5 reveal + blurred remaining results with paywall overlay */}
          {(() => {
            const freeResult = displayResults.find((r) => results.indexOf(r) + 1 === 5);
            const blurredResults = displayResults.filter((r) => results.indexOf(r) + 1 !== 5);

            const renderCard = (result: StateScore, blurred: boolean) => {
              const stateData = getStateData(result.state);
              const rank = results.indexOf(result) + 1;
              return (
                <Card
                  key={result.state}
                  className={`shadow-lg ${blurred ? "blur-md pointer-events-none select-none" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-4xl font-bold mb-1">#{rank}</div>
                        <CardTitle className="text-3xl">{stateData?.state_name}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Match Score</div>
                        <div className="text-3xl font-bold text-primary">{result.score}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                      <MapPin className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Best City Match</div>
                        <span className="text-2xl font-bold">{result.city}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-card border rounded-lg p-4 space-y-2">
                        <div className="text-2xl">🏠</div>
                        <div className="text-xs text-muted-foreground">Cost of Living</div>
                        <div className="font-semibold text-lg">{stateData?.cost_of_living}</div>
                        {stateData?.avg_home_price && (
                          <div className="text-xs text-muted-foreground">~{stateData.avg_home_price}</div>
                        )}
                      </div>
                      <div className="bg-card border rounded-lg p-4 space-y-2">
                        <div className="text-2xl">☀️</div>
                        <div className="text-xs text-muted-foreground">Climate</div>
                        <div className="font-semibold text-lg">{stateData?.climate}</div>
                        {stateData?.avg_temp && (
                          <div className="text-xs text-muted-foreground">{stateData.avg_temp}</div>
                        )}
                      </div>
                      <div className="bg-card border rounded-lg p-4 space-y-2">
                        <div className="text-2xl">💼</div>
                        <div className="text-xs text-muted-foreground">Job Market</div>
                        <div className="font-semibold text-lg">{stateData?.job_market || "Good"}</div>
                        {stateData?.avg_salary && (
                          <div className="text-xs text-muted-foreground">{stateData.avg_salary}</div>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🗳️</span>
                          <div>
                            <div className="font-semibold text-sm">Politics</div>
                            <div className="text-sm text-muted-foreground">{stateData?.politics}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🏥</span>
                          <div>
                            <div className="font-semibold text-sm">Healthcare</div>
                            <div className="text-sm text-muted-foreground">{stateData?.healthcare_quality}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🔒</span>
                          <div>
                            <div className="font-semibold text-sm">Safety</div>
                            <div className="text-sm text-muted-foreground">Crime: {stateData?.crime_level}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🏞️</span>
                          <div>
                            <div className="font-semibold text-sm">Landscape</div>
                            <div className="text-sm text-muted-foreground">{stateData?.landscape}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-lg">👶</span>
                          <div>
                            <div className="font-semibold text-sm">Abortion Laws</div>
                            <div className="text-sm text-muted-foreground">{stateData?.abortion_laws}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🔫</span>
                          <div>
                            <div className="font-semibold text-sm">Gun Laws</div>
                            <div className="text-sm text-muted-foreground">{stateData?.gun_laws}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span>🎯</span> Why This Match?
                      </h4>
                      <div className="space-y-2">
                        {stateData?.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">✓</span>
                            <span className="text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            };

            return (
              <>
                {freeResult && (
                  <div className="mb-6">
                    <div className="text-center mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        Free Preview · Your #5 Match
                      </span>
                    </div>
                    {renderCard(freeResult, false)}
                  </div>
                )}

                <div className="relative">
                  <div className="space-y-6" aria-hidden="true">
                    {blurredResults.map((r) => renderCard(r, true))}
                  </div>

                  {/* Paywall overlay */}
                  <div className="absolute inset-0 flex items-start justify-center pt-12">
                    <Card className="max-w-md w-full mx-4 shadow-2xl border-2 border-primary/30 bg-card sticky top-12">
                      <CardContent className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                          <Lock className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Unlock Your Top 4 Matches</h2>
                        <p className="text-muted-foreground mb-6">
                          See your top 4 state matches with full details, best cities, and why each one fits you.
                        </p>
                        <div className="mb-6">
                          <div className="text-4xl font-bold text-primary">$6.99</div>
                          <div className="text-sm text-muted-foreground">One-time payment</div>
                        </div>
                        <Button
                          variant="hero"
                          size="lg"
                          className="w-full text-lg"
                          onClick={handleUnlock}
                          disabled={isLoading || results.length === 0}
                        >
                          {isLoading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...</>
                          ) : (
                            <>Unlock My Results</>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">🔒 Secure checkout via Stripe</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            );
          })()}

          {/* Blog Link */}
          <div className="mt-12 mb-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Learn More About Your Top States</h3>
              <p className="text-muted-foreground text-sm mb-4">Read our guides on relocation, cost of living, and finding your perfect fit.</p>
              <Link to="/blog">
                <Button variant="outline">Read the Blog →</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPreview;
