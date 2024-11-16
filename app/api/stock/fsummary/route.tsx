import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return new Response(JSON.stringify({ error: 'Symbol is required' }), {
        status: 400,
      });
    }

    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['financialData'],
    });

    const metrics = {
      valuation: {
        targetHighPrice: result.financialData.targetHighPrice,
        targetLowPrice: result.financialData.targetLowPrice,
        targetMeanPrice: result.financialData.targetMeanPrice,
        recommendationKey: result.financialData.recommendationKey,
      },
      profitability: {
        returnOnAssets: result.financialData.returnOnAssets,
        returnOnEquity: result.financialData.returnOnEquity,
        profitMargins: result.financialData.profitMargins,
        grossMargins: result.financialData.grossMargins,
      },
      growth: {
        earningsGrowth: result.financialData.earningsGrowth,
        revenueGrowth: result.financialData.revenueGrowth,
      },
      liquidity: {
        quickRatio: result.financialData.quickRatio,
        debtToEquity: result.financialData.debtToEquity,
      },
      operational: {
        totalRevenue: result.financialData.totalRevenue,
        operatingMargins: result.financialData.operatingMargins,
      },
    };

    return new Response(JSON.stringify(metrics), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
    });
  }
}