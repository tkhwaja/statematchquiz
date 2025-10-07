import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Home, Sparkles, Star, HelpCircle } from "lucide-react";
import { usePostHog } from "@/contexts/PostHogContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroLandscape from "@/assets/hero-landscape.jpg";
import CustomerSupportChat from "@/components/CustomerSupportChat";
import CloudBackground from "@/components/CloudBackground";

const Landing = () => {
  const navigate = useNavigate();
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('page_view', { page: 'landing' });
  }, []);

  const handleStartQuiz = () => {
    posthog.capture('quiz_started');
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen relative">
      <CloudBackground />
      
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroLandscape})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Find Your Perfect Place</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Discover Where You
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(207,89%,70%)] to-[hsl(14,100%,75%)]">
              Truly Belong
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            30 quick questions → your best states & cities, backed by data and your values.
          </p>

          <Button
            size="lg"
            variant="hero"
            onClick={handleStartQuiz}
            className="text-lg px-12 py-6 h-auto"
          >
            Start Quiz
          </Button>

          <p className="text-sm text-white/80 mt-4 drop-shadow">
            Takes about 5 minutes • Get personalized recommendations
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center bg-black/40 backdrop-blur-sm p-6 rounded-lg">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Data-Driven Matches</h3>
            <p className="text-white/80">
              Our algorithm considers climate, cost of living, politics, and 20+ other factors
            </p>
          </div>

          <div className="text-center bg-black/40 backdrop-blur-sm p-6 rounded-lg">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-4">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Values-Aligned</h3>
            <p className="text-white/80">
              Find places that match your lifestyle, politics, and what matters most to you
            </p>
          </div>

          <div className="text-center bg-black/40 backdrop-blur-sm p-6 rounded-lg">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <Home className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">Detailed Reports</h3>
            <p className="text-white/80">
              Get ranked recommendations with insights on each location's best features
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-32 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-white/80 text-lg">Real people, real results</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-white/90 mb-4">
                "StateMatch helped me find the perfect state for my remote work lifestyle. The recommendations were spot-on and the detailed report gave me confidence in my decision to move to Colorado!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div>
                  <p className="text-white font-semibold">Jennifer Davis</p>
                  <p className="text-white/60 text-sm">Moved to Colorado</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-white/90 mb-4">
                "As someone considering a career change and relocation, this quiz was incredibly helpful. It matched my political views, climate preferences, and budget perfectly. Worth every penny!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-white font-semibold">
                  MC
                </div>
                <div>
                  <p className="text-white font-semibold">Michael Chen</p>
                  <p className="text-white/60 text-sm">Moved to North Carolina</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-white/90 mb-4">
                "I was torn between three different states. This report narrowed it down and gave me actionable insights about each location. The city recommendations were especially helpful!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-white font-semibold">
                  SR
                </div>
                <div>
                  <p className="text-white font-semibold">Sarah Rodriguez</p>
                  <p className="text-white/60 text-sm">Moved to Oregon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Got Questions?</h2>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/90">
                  How does the quiz work?
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  Our quiz consists of 30 questions covering your preferences on climate, cost of living, politics, lifestyle, outdoor activities, and more. Your answers are weighted and analyzed against comprehensive data for all 50 U.S. states to generate personalized recommendations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/90">
                  What's included in the full report?
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  The full report ($7) includes your top 10 state matches with detailed scores, top city recommendations for each state, insights on politics, climate, cost of living, healthcare quality, crime levels, and more. You also get a downloadable PDF and email delivery.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/90">
                  Can I get a refund?
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  Yes! We offer a 30-day money-back guarantee. If you're not satisfied with your report for any reason, contact us at support@statematch.com within 30 days for a full refund.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/90">
                  How accurate are the recommendations?
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  Our algorithm considers 20+ data points including official government statistics, climate data, cost of living indices, and quality of life metrics. While we strive for accuracy, we recommend using our report as one of several resources in your decision-making process.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/90">
                  How long does the quiz take?
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  The quiz takes approximately 5 minutes to complete. You can see your top 3 matches immediately for free, and purchase the full report with your top 10 matches and detailed insights.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/90">
                  Is my data secure?
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  Absolutely. We use industry-standard encryption and secure payment processing through Stripe. We never sell your data and only use your email to deliver your report. See our Privacy Policy for full details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-white/10 pt-12 pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-white font-semibold mb-4">StateMatch</h3>
                <p className="text-white/70 text-sm">
                  Find your perfect place to live with our data-driven location recommendation service.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/terms" className="text-white/70 hover:text-white text-sm transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-white/70 hover:text-white text-sm transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="mailto:support@statematchquiz.com" className="text-white/70 hover:text-white text-sm transition-colors">
                      support@statematchquiz.com
                    </a>
                  </li>
                  <li>
                    <span className="text-white/70 text-sm">
                      30-Day Money-Back Guarantee
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center text-white/60 text-sm">
              <p>© {new Date().getFullYear()} StateMatch. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Customer Support Chat Widget */}
      <CustomerSupportChat />
    </div>
  );
};

export default Landing;
