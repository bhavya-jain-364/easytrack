"use client";

import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MagicCard } from "@/components/ui/magic-card";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { LoadingSpinner } from "@/components/ui/loader";
import { formatBigNumber, formatNumberToCurrency, formatBigNumberToCurrency } from "@/lib/utils"
import { StockRecommendationGauge } from '@/components/StockRecommendationGauge';

interface FinancialMetrics {
  valuation: {
    targetHighPrice: number;
    targetLowPrice: number;
    targetMeanPrice: number;
    recommendationKey: string;
    recommendationMean: number;
    currentPrice: number;
    numberOfAnalystOpinions: number;
    CurrencyName: string;
  };
  profitability: {
    returnOnAssets: number;
    returnOnEquity: number;
    profitMargins: number;
    grossMargins: number;
    ebitdaMargins: number;
  };
  growth: {
    earningsGrowth: number;
    revenueGrowth: number;
  };
  liquidity: {
    quickRatio: number;
    debtToEquity: number;
    currentRatio: number;
  };
  operational: {
    totalRevenue: number;
    operatingMargins: number;
    freeCashflow: number;
    totalCashPerShare: number;
    revenuePerShare: number;
  };
}

interface FinancialSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
}

export function FinancialSummaryDialog({
  isOpen,
  onClose,
  symbol,
}: FinancialSummaryDialogProps) {
  const [metrics, setMetrics] = React.useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && symbol) {
      setLoading(true);
      fetch(`/api/stock/fsummary?symbol=${symbol}`)
        .then((res) => res.json())
        .then((data) => {
          setMetrics(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch metrics:', error);
          setLoading(false);
        });
    }
  }, [isOpen, symbol]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80%] w-[80%] pt-8">
        <div className="absolute inset-0 z-0">
          <FlickeringGrid color="rgba(130,0,0,1)" />
        </div>
        
        <h2 className="text-xl font-semibold mb-4 text-left relative z-10">Financial Summary</h2>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner className="w-8 h-8" />
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-5 gap-6 relative z-10 mt-4">
            {/* Row 1 */}
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Current Price</p>
              <p className="text-xl ">${formatNumberToCurrency(metrics.valuation.currentPrice, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Target High</p>
              <p className="text-xl ">${formatNumberToCurrency(metrics.valuation.targetHighPrice, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Target Low</p>
              <p className="text-xl ">${formatNumberToCurrency(metrics.valuation.targetLowPrice, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Target Mean</p>
              <p className="text-xl ">${formatNumberToCurrency(metrics.valuation.targetMeanPrice, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Revenue Growth</p>
              <p className="text-xl ">{formatBigNumber(metrics.growth.revenueGrowth * 100)}%</p>
            </MagicCard>

            {/* Row 2 */}
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">ROA</p>
              <p className="text-xl ">{formatBigNumber(metrics.profitability.returnOnAssets * 100)}%</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">ROE</p>
              <p className="text-xl ">{formatBigNumber(metrics.profitability.returnOnEquity * 100)}%</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Earnings Growth</p>
              <p className="text-xl ">{formatBigNumber(metrics.growth.earningsGrowth * 100)}%</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Analyst Count</p>
              <p className="text-xl ">{metrics.valuation.numberOfAnalystOpinions}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Recommendation</p>
              <p className="text-xl  capitalize">{metrics.valuation.recommendationKey}</p>
            </MagicCard>

            {/* Row 3 */}
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Debt/Equity</p>
              <p className="text-xl ">{formatBigNumber(metrics.liquidity.debtToEquity)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Revenue</p>
              <p className="text-xl ">${formatBigNumberToCurrency(metrics.operational.totalRevenue, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Operating Margins</p>
              <p className="text-xl ">{formatBigNumberToCurrency(metrics.operational.operatingMargins * 100, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            
            {/* Gauge Chart Card spanning multiple rows and columns */}
            <MagicCard className="p-6 row-span-3 col-span-2 flex flex-col justify-center">
              <StockRecommendationGauge 
                recommendationMean={metrics.valuation.recommendationMean} 
                symbol={symbol}
              />
            </MagicCard>

            {/* Row 4 */}
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Current Ratio</p>
              <p className="text-xl ">{formatBigNumberToCurrency(metrics.liquidity.currentRatio, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Free Cash Flow</p>
              <p className="text-xl ">${formatBigNumberToCurrency(metrics.operational.freeCashflow, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Cash Per Share</p>
              <p className="text-xl ">${formatBigNumberToCurrency(metrics.operational.totalCashPerShare, metrics.valuation.CurrencyName)}</p>
            </MagicCard>

            {/* Row 5 */}
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Quick Ratio</p>
              <p className="text-xl ">{formatBigNumber(metrics.liquidity.quickRatio)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">EBITDA Margin</p>
              <p className="text-xl ">{formatBigNumberToCurrency(metrics.profitability.ebitdaMargins * 100, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
            <MagicCard className="p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">Revenue Per Share</p>
              <p className="text-xl ">${formatBigNumberToCurrency(metrics.operational.revenuePerShare, metrics.valuation.CurrencyName)}</p>
            </MagicCard>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}