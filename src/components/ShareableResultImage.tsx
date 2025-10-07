import { StateScore } from "@/lib/types";
import statesData from "@/data/states.json";

interface ShareableResultImageProps {
  results: StateScore[];
}

const ShareableResultImage = ({ results }: ShareableResultImageProps) => {
  const topThree = results.slice(0, 3);
  
  const getStateData = (stateCode: string) => {
    return statesData.find(s => s.state_code === stateCode);
  };

  return (
    <div 
      className="w-[1080px] h-[1920px] bg-gradient-to-br from-primary via-primary/90 to-accent p-16 flex flex-col"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-7xl font-bold text-white mb-4">
          My StateMatch Results
        </h1>
        <p className="text-3xl text-white/90">
          Top 3 Perfect States For Me
        </p>
      </div>

      {/* Results Cards */}
      <div className="flex-1 flex flex-col gap-8 justify-center">
        {topThree.map((result, index) => {
          const stateData = getStateData(result.state);
          const maxScore = results[0].score;
          const percentage = Math.round((result.score / maxScore) * 100);
          
          return (
            <div 
              key={result.state} 
              className="bg-white rounded-3xl p-10 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-8xl font-bold text-primary/20">
                    #{index + 1}
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold text-foreground mb-2">
                      {stateData?.state_name}
                    </h2>
                    <p className="text-3xl text-muted-foreground flex items-center gap-2">
                      📍 {result.city}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-bold text-primary">
                    {percentage}%
                  </div>
                  <div className="text-2xl text-muted-foreground">Match</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-accent/10 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">☀️</div>
                  <div className="text-xl font-semibold text-foreground">
                    {stateData?.climate}
                  </div>
                </div>
                <div className="bg-accent/10 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🏠</div>
                  <div className="text-xl font-semibold text-foreground">
                    {stateData?.cost_of_living}
                  </div>
                </div>
                <div className="bg-accent/10 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🗳️</div>
                  <div className="text-xl font-semibold text-foreground">
                    {stateData?.politics}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-12">
        <div className="bg-white rounded-3xl p-10 shadow-2xl">
          <p className="text-4xl font-bold text-foreground mb-4">
            Find YOUR Perfect State
          </p>
          <p className="text-3xl text-primary font-bold">
            statematchquiz.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareableResultImage;
