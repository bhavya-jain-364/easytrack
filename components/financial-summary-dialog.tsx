 "use client";

import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MagicCard } from "@/components/ui/magic-card";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { LoadingSpinner } from "@/components/ui/loader";

interface FinancialMetrics {
  valuation: {
    targetHighPrice: number;
    targetLowPrice: number;
    targetMeanPrice: number;
    recommendationKey: string;
  };
  profitability: {
    returnOnAssets: number;
    returnOnEquity: number;
    profitMargins: number;
    grossMargins: number;
  };
  growth: {
    earningsGrowth: number;
    revenueGrowth: number;
  };
  liquidity: {
    quickRatio: number;
    debtToEquity: number;
  };
  operational: {
    totalRevenue: number;
    operatingMargins: number;
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="absolute inset-0 z-0">
          <FlickeringGrid color="rgba(0,0,0,0.2)" />
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner className="w-8 h-8" />
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <MagicCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Valuation Metrics</h3>
              <div className="space-y-2">
                <p>Target High: ${metrics.valuation.targetHighPrice}</p>
                <p>Target Low: ${metrics.valuation.targetLowPrice}</p>
                <p>Target Mean: ${metrics.valuation.targetMeanPrice}</p>
                <p>Recommendation: {metrics.valuation.recommendationKey}</p>
              </div>
            </MagicCard>

            <MagicCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profitability</h3>
              <div className="space-y-2">
                <p>ROA: {(metrics.profitability.returnOnAssets * 100).toFixed(2)}%</p>
                <p>ROE: {(metrics.profitability.returnOnEquity * 100).toFixed(2)}%</p>
                <p>Profit Margins: {(metrics.profitability.profitMargins * 100).toFixed(2)}%</p>
                <p>Gross Margins: {(metrics.profitability.grossMargins * 100).toFixed(2)}%</p>
              </div>
            </MagicCard>

            <MagicCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Growth Metrics</h3>
              <div className="space-y-2">
                <p>Earnings Growth: {(metrics.growth.earningsGrowth * 100).toFixed(2)}%</p>
                <p>Revenue Growth: {(metrics.growth.revenueGrowth * 100).toFixed(2)}%</p>
              </div>
            </MagicCard>

            <MagicCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Liquidity & Solvency</h3>
              <div className="space-y-2">
                <p>Quick Ratio: {metrics.liquidity.quickRatio.toFixed(2)}</p>
                <p>Debt/Equity: {metrics.liquidity.debtToEquity.toFixed(2)}</p>
              </div>
            </MagicCard>

            <MagicCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Operational Metrics</h3>
              <div className="space-y-2">
                <p>Revenue: ${(metrics.operational.totalRevenue / 1e9).toFixed(2)}B</p>
                <p>Operating Margins: {(metrics.operational.operatingMargins * 100).toFixed(2)}%</p>
              </div>
            </MagicCard>

            <MagicCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Gauge</h3>
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">Gauge chart coming soon...</p>
              </div>
            </MagicCard>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}