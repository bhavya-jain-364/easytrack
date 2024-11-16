import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  try {
    const quote = await yahooFinance.quoteSummary(symbol, { modules: ['financialData'] });
    const data = quote.financialData;

    const formattedData = {
      valuation: {
        targetHighPrice: data.targetHighPrice,
        targetLowPrice: data.targetLowPrice,
        targetMeanPrice: data.targetMeanPrice,
        recommendationKey: data.recommendationKey,
        recommendationMean: data.recommendationMean,
        currentPrice: data.currentPrice,
        numberOfAnalystOpinions: data.numberOfAnalystOpinions,
      },
      profitability: {
        returnOnAssets: data.returnOnAssets,
        returnOnEquity: data.returnOnEquity,
        profitMargins: data.profitMargins,
        grossMargins: data.grossMargins,
        ebitdaMargins: data.ebitdaMargins,
      },
      growth: {
        earningsGrowth: data.earningsGrowth,
        revenueGrowth: data.revenueGrowth,
      },
      liquidity: {
        quickRatio: data.quickRatio,
        debtToEquity: data.debtToEquity,
        currentRatio: data.currentRatio,
      },
      operational: {
        totalRevenue: data.totalRevenue,
        operatingMargins: data.operatingMargins,
        freeCashflow: data.freeCashflow,
        totalCashPerShare: data.totalCashPerShare,
        revenuePerShare: data.revenuePerShare,
      },
    };

    return Response.json(formattedData);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return Response.error();
  }
}