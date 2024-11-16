'use client'
import React, { useEffect, useState } from "react";
import ExpandableChartCard from "@/components/ExpandableChartCard";
import { DateRange } from "react-day-picker";
interface ChartData {
  name: string;
  value: number;
}

interface Attribute {
  label: string;
  value: string;
}


export default function StockPage() {
  const [stockLineChartData, setStockLineChartData] = useState<ChartData[]>([]);
  const [stockBarChartData, setStockBarChartData] = useState<ChartData[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [bottomAttributes, setBottomAttributes] = useState<string[]>([]);
  const [period, setPeriod] = useState<string>('1Y'); 
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const formatNumber = (num: number) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };

  async function fetchStockData(symbol = 'TSLA', period?: string, dateRange?: DateRange) {
    let period1, period2;

    if (dateRange) {
      period1 = dateRange.from?.toISOString().split('T')[0];
      period2 = dateRange.to?.toISOString().split('T')[0];
    } else {
      const currentDate = new Date();
      switch (period) {
        case '1M':
          period1 = new Date(currentDate.setMonth(currentDate.getMonth() - 1)).toISOString().split('T')[0];
          break;
        case '6M':
          period1 = new Date(currentDate.setMonth(currentDate.getMonth() - 6)).toISOString().split('T')[0];
          break;
        case '1Y':
          period1 = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)).toISOString().split('T')[0];
          break;
        case '5Y':
          period1 = new Date(currentDate.setFullYear(currentDate.getFullYear() - 5)).toISOString().split('T')[0];
          break;
        case 'Max':
          period1 = '1970-01-01';
          break;
        default:
          period1 = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)).toISOString().split('T')[0];
      }
      period2 = new Date().toISOString().split('T')[0];
    }

    try {
      const chartResponse = await fetch(`/api/stock/chart?symbol=${symbol}&period1=${period1}&period2=${period2}`);
      const detailsResponse = await fetch(`/api/stock/details?symbol=${symbol}`);

      if (chartResponse.ok && detailsResponse.ok) {
        const chartData = await chartResponse.json();
        const detailsData = await detailsResponse.json();

        const formattedChartData: ChartData[] = chartData.chartData.map((item: any) => ({
          name: new Date(item.date).toLocaleDateString(),
          value: item.close,
        }));

        setStockLineChartData(formattedChartData);
        setAttributes([
          { label: "Stock Name", value: detailsData.symbol },
          { label: "Stock Price", value: `$${formatNumber(formattedChartData[formattedChartData.length - 1].value)}` },
        ]);

        setBottomAttributes([
          `52-wk High: ${formatNumber(detailsData.fiftyTwoWeekHigh)}`,
          `52-wk Low: ${formatNumber(detailsData.fiftyTwoWeekLow)}`,
          `Market Cap: ${formatNumber(detailsData.marketCap)}`,
          `Volume: ${formatNumber(detailsData.volume)}`,
          `P/E Ratio: ${formatNumber(detailsData.trailingPE)}`,
        ]);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }

  useEffect(() => {
    fetchStockData('TSLA', period);
  }, [period]);

  useEffect(() => {
    if (dateRange) {
      fetchStockData('TSLA', undefined, dateRange);
    }
  }, [dateRange]);

  return (
    <div>
      <ExpandableChartCard
        title="Tesla Stock Overview"
        attributes={attributes}
        bottomAttributes={bottomAttributes}
        lineChartData={stockLineChartData}
        barChartData={stockBarChartData}
        symbol="TSLA"
        period={period}
        onPeriodChange={setPeriod}
        onDateChange={setDateRange}
      />
    </div>
  );
}
