import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stockSymbol = searchParams.get('symbol');

    if (!stockSymbol) {
      return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
    }

    const queryOptions = { modules: ['summaryDetail', 'price'] };
    const result = await yahooFinance.quoteSummary(stockSymbol, queryOptions);

    const { fiftyTwoWeekHigh, fiftyTwoWeekLow, marketCap, volume, trailingPE } = result.summaryDetail;
    const { regularMarketPrice, shortName, currencySymbol } = result.price;

    return NextResponse.json({
      symbol: stockSymbol,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      marketCap,
      volume,
      trailingPE,
      regularMarketPrice,
      name: shortName,
      currencySymbol
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stock details:', error);
    return NextResponse.json({ error: 'Error fetching stock details' }, { status: 500 });
  }
} 