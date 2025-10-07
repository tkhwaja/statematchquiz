import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostHog } from "@/contexts/PostHogContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ProgressBar from "@/components/ProgressBar";
import CloudBackground from "@/components/CloudBackground";
import { ChevronLeft, ChevronRight } from "lucide-react";
import questionsData from "@/data/questions.json";
import { AnswerMap } from "@/lib/types";

const Quiz = () => {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    posthog.capture('page_view', { page: 'quiz' });
  }, []);

  const question = questionsData[currentQuestion];
  const isLastQuestion = currentQuestion === questionsData.length - 1;
  const canGoNext = answers[question.id] !== undefined;
  const canGoBack = currentQuestion > 0;

  const handleAnswer = (choiceId: string) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: choiceId
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Store answers and navigate to results
      localStorage.setItem("quizAnswers", JSON.stringify(answers));
      posthog.capture('quiz_completed');
      navigate("/result/preview");
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen">
      <CloudBackground />
      <ProgressBar current={currentQuestion + 1} total={questionsData.length} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {question.prompt}
              </h2>

              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {question.choices.map((choice) => (
                  <div
                    key={choice.id}
                    className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={choice.id} id={choice.id} />
                    <Label
                      htmlFor={choice.id}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {choice.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-8 gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={!canGoBack}
                  className="w-32"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="w-32"
                  variant="default"
                >
                  {isLastQuestion ? "See Results" : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
