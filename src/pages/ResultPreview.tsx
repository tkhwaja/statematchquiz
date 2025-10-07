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

          {/* Unlocked Results - Full Details */}
          <div className="space-y-6 mb-8">
            {unlockedResults.map((result, index) => {
              const stateData = getStateData(result.state);
              return (
                <Card key={result.state} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-4xl font-bold mb-1">#{5 - index}</div>
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

                    {/* Key Stats Grid */}
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

                    {/* Detailed Information */}
                    <div className="space-y-4">
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
                            <span className="text-lg">🎓</span>
                            <div>
                              <div className="font-semibold text-sm">Education</div>
                              <div className="text-sm text-muted-foreground">{stateData?.education_quality || "Good"}</div>
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
                          <div className="flex items-start gap-2">
                            <span className="text-lg">🏞️</span>
                            <div>
                              <div className="font-semibold text-sm">Landscape</div>
                              <div className="text-sm text-muted-foreground">{stateData?.landscape}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-lg">🎨</span>
                            <div>
                              <div className="font-semibold text-sm">Culture</div>
                              <div className="text-sm text-muted-foreground">{stateData?.culture || "Diverse"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Major Industries */}
                    {stateData?.major_industries && (
                      <div className="bg-accent/5 rounded-lg p-4">
                        <div className="font-semibold mb-2 flex items-center gap-2">
                          <span>🏭</span> Major Industries
                        </div>
                        <div className="text-sm text-muted-foreground">{stateData.major_industries}</div>
                      </div>
                    )}

                    {/* Why This Match Section */}
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

                    {/* Fun Fact */}
                    {stateData?.fun_fact && (
                      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4">
                        <div className="font-semibold mb-2 flex items-center gap-2">
                          <span>💡</span> Did You Know?
                        </div>
                        <p className="text-sm text-muted-foreground italic">{stateData.fun_fact}</p>
                      </div>
                    )}

                    {/* What to Expect */}
                    {stateData?.lifestyle && (
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span>🌟</span> What to Expect
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{stateData.lifestyle}</p>
                      </div>
                    )}

                    {/* Summary Box */}
                    <div className="pt-4 border-t bg-gradient-to-br from-primary/5 to-accent/5 -mx-6 px-6 py-4 -mb-6 rounded-b-lg">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">Perfect Match Summary:</span> This location ranks <span className="font-bold text-primary">#{5 - index}</span> because it strongly aligns with your preferences for <span className="font-semibold">{stateData?.politics.toLowerCase()}</span> values, <span className="font-semibold">{stateData?.climate.toLowerCase()}</span> climate, and <span className="font-semibold">{stateData?.cost_of_living.toLowerCase()}</span> cost of living. {result.city} represents the optimal balance of your priorities within {stateData?.state_name}, offering an ideal environment for your lifestyle and values.
                      </p>
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

          {/* Locked Results */}
          <div className="space-y-6">
            {lockedResults.map((result, index) => {
              const stateData = getStateData(result.state);
              return (
                <Card key={result.state} className="relative overflow-hidden">
                  <div className="absolute inset-0 blur-card bg-muted/50 backdrop-blur-md z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-primary mx-auto mb-3" />
                      <p className="text-lg font-semibold">Rank #{3 - index}</p>
                      <p className="text-sm text-muted-foreground">Unlock to see details</p>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1">#{3 - index}</div>
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
