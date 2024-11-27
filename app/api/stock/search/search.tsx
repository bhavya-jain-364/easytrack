// app/api/stock/search/search.tsx
// This API route is used to search for stocks on Yahoo Finance to provide suggestions in the search bar
import yahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

// Define the type for Yahoo Finance quote response
interface YahooFinanceQuote {
  exchange?: string;
  shortname?: string;
  quoteType?: string;
  symbol: string;
  index?: string;
  score?: number;
  typeDisp?: string;
  longname?: string;
  isYahooFinance: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const result = await yahooFinance.search(query, {
      newsCount: 0,           // We don't need news
      quotesCount: 5,         // Limit to 5 suggestions
      enableFuzzyQuery: true, // Enable fuzzy matching
      enableNavLinks: false,  // Don't need nav links
      enableCb: false,        // Don't need Crunchbase data
    });

    // Filter and transform the quotes to only include what we need
    const filteredResults = result.quotes
      .filter((quote: YahooFinanceQuote) => 
        // Only include equity types and Yahoo Finance listings
        quote.quoteType === 'EQUITY' && 
        quote.isYahooFinance
      )
      .map((quote: YahooFinanceQuote) => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || 'Unknown'
      }));

    return NextResponse.json({ results: filteredResults });

  } catch (error) {
    console.error('Yahoo Finance search error:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
