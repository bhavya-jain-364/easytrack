import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stockSymbol = searchParams.get('symbol');
    const period = searchParams.get('period');
    let period1 = searchParams.get('period1');
    const period2 = searchParams.get('period2') || new Date().toISOString().split('T')[0];

    if (!stockSymbol) {
      return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
    }

    if (!period1 && period) {
      const currentDate = new Date();
      let period1Date;

      switch (period) {
        case '1M':
          period1Date = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
          break;
        case '6M':
          period1Date = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
          break;
        case '1Y':
          period1Date = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
          break;
        case '5Y':
          period1Date = new Date(currentDate.setFullYear(currentDate.getFullYear() - 5));
          break;
        case 'Max':
          period1Date = new Date('1970-01-01');
          break;
        default:
          period1Date = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
      }

      period1 = period1Date.toISOString().split('T')[0];
    }

    const chartOptions = { period1, period2 };
    const result = await yahooFinance.chart(stockSymbol, chartOptions);

    const chartData = result.quotes.map((quote: { date: any; open: any; high: any; low: any; close: any; volume: any; }) => ({
      date: quote.date,
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      volume: quote.volume,
    }));

    return NextResponse.json({ symbol: stockSymbol, chartData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stock chart data:', error);
    return NextResponse.json({ error: 'Error fetching stock chart data' }, { status: 500 });
  }
}
