import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePostHog } from "@/contexts/PostHogContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CloudBackground from "@/components/CloudBackground";

const Checkout = () => {
  const posthog = usePostHog();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    posthog.capture('page_view', { page: 'checkout' });
    posthog.capture('waitlist_page_viewed');

    const capturedEmail = localStorage.getItem("capturedEmail");
    if (capturedEmail && !email) {
      setEmail(capturedEmail);
    }

    const capturedName = localStorage.getItem("capturedName");
    if (capturedName) {
      const parts = capturedName.split(" ");
      if (parts.length >= 2) {
        setFirstName(parts[0]);
        setLastName(parts.slice(1).join(" "));
      } else {
        setFirstName(parts[0]);
      }
    }
  }, []);

  const handleJoinWaitlist = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your first and last name");
      return;
    }

    setIsLoading(true);
    try {
      const savedAnswers = localStorage.getItem("quizAnswers");
      const answers = savedAnswers ? JSON.parse(savedAnswers) : null;
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const { error } = await supabase.from("tier2_waitlist").insert({
        name: fullName,
        email: email.trim(),
        quiz_answers: answers,
      });

      if (error) throw error;

      posthog.capture('waitlist_joined', { email: email.trim() });
      toast.success("You're on the list! We'll notify you when the report launches.");
      setIsJoined(true);
    } catch (error: any) {
      console.error("Waitlist error:", error);
      toast.error(error.message || "Failed to join waitlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <CloudBackground />
      
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Join the Waitlist — Personalized Relocation Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isJoined ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">You're on the waitlist!</h3>
                  <p className="text-muted-foreground">
                    We'll email you as soon as the relocation report is ready.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-primary/10 p-6 rounded-lg text-center">
                    <h3 className="text-lg font-bold mb-2">We're building something special</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Our premium relocation report will include a personalized cost of living analysis, tax impact calculator, neighborhood recommendations, job market insights, and a step-by-step moving checklist — all tailored to your quiz results.
                    </p>
                    <p className="text-sm text-muted-foreground">Be the first to know when it launches.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="First"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Last"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll notify you when the report launches
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      variant="hero"
                      onClick={handleJoinWaitlist}
                      disabled={!email || !firstName || !lastName || isLoading}
                    >
                      {isLoading ? "Joining..." : "Join the Waitlist"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>✓ Cost of living comparison for your income</p>
                    <p>✓ State-by-state tax impact breakdown</p>
                    <p>✓ Neighborhood-level recommendations</p>
                    <p>✓ Step-by-step moving checklist</p>
                    <p>✓ Job market analysis for your field</p>
                    <p>✓ Downloadable PDF report</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
