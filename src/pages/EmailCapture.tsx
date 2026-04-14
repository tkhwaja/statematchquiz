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
import { calculateScores } from "@/lib/scoring";
import { AnswerMap } from "@/lib/types";
import statesData from "@/data/states.json";

const EmailCapture = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const posthog = usePostHog();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your first and last name");
      return;
    }

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
      const fullName = firstName.trim() + " " + lastName.trim();

      await supabase.from("email_captures").insert({
        email: email.trim(),
        name: fullName,
        quiz_answers: quizAnswers ? JSON.parse(quizAnswers) : null,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

      localStorage.setItem("capturedEmail", email.trim());
      localStorage.setItem("capturedName", fullName);
      posthog.capture("email_captured", {
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      // Calculate scores and send report email in background
      if (quizAnswers) {
        const answers: AnswerMap = JSON.parse(quizAnswers);
        const scores = calculateScores(answers);

        supabase.functions
          .invoke("send-report", {
            body: { email: email.trim(), results: scores, statesData },
          })
          .catch((error) => {
            console.error("Failed to send report email:", error);
          });
      }

      navigate("/result/preview");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || !firstName.trim() || !lastName.trim() || !email.trim();

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
                Enter your name and email to get your personalized results — we'll send a copy to your inbox too.
              </p>

              <div className="grid grid-cols-2 gap-4 text-left mb-4">
                <div>
                  <Label htmlFor="firstName" className="mb-2 block">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

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
                disabled={isDisabled}
              >
                {isLoading ? "Loading..." : "See My Results"}
              </Button>

              <p className="text-muted-foreground text-xs mt-4">
                We'll also send a copy to your inbox. No spam, unsubscribe
                anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;
