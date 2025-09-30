import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import CloudBackground from "@/components/CloudBackground";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    // TODO: Integrate Stripe Checkout
    // For now, just simulate the checkout process
    setTimeout(() => {
      alert("Checkout integration coming soon! For demo, proceeding to full report.");
      window.location.href = "/result/full";
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12">
      <CloudBackground />
      
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Unlock Your Full Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 p-6 rounded-lg text-center">
                <Lock className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">$9.99</div>
                <p className="text-sm text-muted-foreground">One-time purchase</p>
              </div>

              <div className="space-y-4">
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
                    Your report will be sent to this email
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  variant="hero"
                  onClick={handleCheckout}
                  disabled={!email || isLoading}
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>✓ Instant access to your Top 3 matches</p>
                <p>✓ Detailed AI-powered insights</p>
                <p>✓ Downloadable PDF report</p>
                <p>✓ Delivered to your email</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
