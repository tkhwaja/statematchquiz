import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePostHog } from "@/contexts/PostHogContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CloudBackground from "@/components/CloudBackground";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailCapture = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const posthog = usePostHog();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    posthog.capture("page_view", { page: "email_capture" });

    const savedAnswers = localStorage.getItem("quizAnswers");
    if (!savedAnswers) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const quizAnswers = localStorage.getItem("quizAnswers");
      const utmSource = searchParams.get("utm_source");
      const utmMedium = searchParams.get("utm_medium");
      const utmCampaign = searchParams.get("utm_campaign");

      await supabase.from("email_captures").insert({
        email: email.trim(),
        quiz_answers: quizAnswers ? JSON.parse(quizAnswers) : null,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

      localStorage.setItem("capturedEmail", email.trim());
      posthog.capture("email_captured");
      navigate("/result/preview");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    posthog.capture("email_capture_skipped");
    navigate("/result/preview");
  };

  return (
    <div className="min-h-screen">
      <CloudBackground />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Your results are ready!
              </h1>
              <p className="text-muted-foreground mb-8">
                Enter your email to see your personalized state matches.
              </p>

              <div className="text-left mb-6">
                <Label htmlFor="email" className="mb-2 block">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "See My Results"}
              </Button>

              <p className="text-muted-foreground text-xs mt-4">
                We'll also send a copy to your inbox. No spam, unsubscribe
                anytime.
              </p>

              <button
                onClick={handleSkip}
                className="mt-4 text-sm text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;
