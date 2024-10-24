import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(req: NextRequest) {
  try {
    // Parse the stock symbol from the query params
    const { searchParams } = new URL(req.url);
    const stockSymbol = searchParams.get('symbol');

    if (!stockSymbol) {
      return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
    }

    // Use yahoo-finance2 to fetch the stock data
    const quote = await yahooFinance.quote(stockSymbol);

    // Extract the current price from the fetched data
    const currentPrice = quote.regularMarketPrice;

    return NextResponse.json({ symbol: stockSymbol, price: currentPrice }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Error fetching stock data' }, { status: 500 });
  }
}
