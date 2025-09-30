import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">
            Question {current} of {total}
          </p>
          <p className="text-sm font-bold text-primary">
            {Math.round(percentage)}%
          </p>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </div>
  );
};

export default ProgressBar;
