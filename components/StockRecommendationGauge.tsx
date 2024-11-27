import GaugeChart from 'react-gauge-chart';

export function StockRecommendationGauge({ recommendationMean, symbol }: { recommendationMean: number, symbol: string }) {
  const normalizedValue = 1 - ((recommendationMean - 1) / 4);

  const chartStyle = {
    height: 200,
    width: '100%'
  };

  const getRecommendation = (mean: number) => {
    if (mean >= 4.2) return 'Strong Sell';
    if (mean >= 3.4) return 'Sell';
    if (mean >= 2.4) return 'Hold';
    if (mean >= 1.8) return 'Buy';
    return 'Strong Buy';
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2 text-center">Analyst Recommendation</h3>
      <GaugeChart
        id={`gauge-chart-${symbol}`}
        style={chartStyle}
        nrOfLevels={5}
        colors={["#FF4444", "#FF8C42", "#FFCD29", "#6BCB77", "#4CAF50"]}
        arcWidth={0.25}
        percent={normalizedValue}
        formatTextValue={() => getRecommendation(recommendationMean)}
        needleColor="hsl(var(--muted-foreground))"
        needleBaseColor="hsl(var(--muted-foreground))"
        textColor="hsl(var(--foreground))"
      />
      <div className="flex justify-between text-md px-10">
        <span>Bearish</span>
        <span>Bullish</span>
      </div>
    </div>
  );
}

export default StockRecommendationGauge; 