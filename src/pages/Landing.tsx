import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Home, Sparkles } from "lucide-react";
import CloudBackground from "@/components/CloudBackground";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <CloudBackground />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Find Your Perfect Place</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Discover Where You
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Truly Belong
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            30 quick questions → your best states & cities, backed by data and your values.
          </p>

          <Button
            size="lg"
            variant="hero"
            onClick={() => navigate("/quiz")}
            className="text-lg px-12 py-6 h-auto"
          >
            Start Quiz
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            Takes about 5 minutes • Get personalized recommendations
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Data-Driven Matches</h3>
            <p className="text-muted-foreground">
              Our algorithm considers climate, cost of living, politics, and 20+ other factors
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-4">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Values-Aligned</h3>
            <p className="text-muted-foreground">
              Find places that match your lifestyle, politics, and what matters most to you
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <Home className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Detailed Reports</h3>
            <p className="text-muted-foreground">
              Get ranked recommendations with insights on each location's best features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
