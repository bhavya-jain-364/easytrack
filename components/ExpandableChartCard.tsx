"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, X, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DatePickerWithRange } from "@/components/ui/daterange"
import React from "react"
import { DateRange } from "react-day-picker"
import { FinancialSummaryDialog } from "@/components/FinancialSummaryDialog"
import { formatNumber } from "@/lib/utils"
import { LoadingSpinner } from "./ui/loader"  

interface ChartData {
  name: string;
  value: number;
}

interface Attribute {
  label: string;
  value: string;
}

interface ExpandableChartCardProps {
  title?: string;
  symbol: string;
  defaultPeriod?: string;
}

export default function ExpandableChartCard({
  title = "Card Title",
  symbol,
  defaultPeriod = '5Y'
}: ExpandableChartCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFinancialSummary, setShowFinancialSummary] = useState(false)
  const [stockLineChartData, setStockLineChartData] = useState<ChartData[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [bottomAttributes, setBottomAttributes] = useState<string[]>([])
  const [period, setPeriod] = useState<string>(defaultPeriod)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const onPeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    // setDateRange(undefined); // Reset date range when period changes
  };

  const onDateChange = (range: DateRange) => {
    setDateRange(range);
    // setPeriod(''); // Reset period when date range changes
  };

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const detailsResponse = await fetch(`/api/stock/details?symbol=${symbol}`);
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          setAttributes([
            { label: "Stock Name", value: detailsData.name },
            { 
              label: "Stock Price", 
              value: `${detailsData.currencySymbol}${formatNumber(detailsData.regularMarketPrice)}` 
            },
          ]);

          setBottomAttributes([
            `52-wk High: ${detailsData.currencySymbol}${formatNumber(detailsData.fiftyTwoWeekHigh)}`,
            `52-wk Low: ${detailsData.currencySymbol}${formatNumber(detailsData.fiftyTwoWeekLow)}`,
            `Market Cap: ${detailsData.currencySymbol}${formatNumber(detailsData.marketCap)}`,
            `Volume: ${formatNumber(detailsData.volume)}`,
            `P/E Ratio: ${formatNumber(detailsData.trailingPE)}`,
          ]);
        }
      } catch (error) {
        console.error("Error fetching stock details:", error);
      }
    };

    fetchStockDetails();
    setIsLoading(false);
  }, [symbol]); // Only run once when component mounts or symbol changes

  const fetchChartByPeriod = useCallback(async (period: string) => {
    // setIsLoading(true);
    const currentDate = new Date();
    let period1;

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
    const period2 = new Date().toISOString().split('T')[0];

    try {
      const chartResponse = await fetch(`/api/stock/chart?symbol=${symbol}&period1=${period1}&period2=${period2}`);
      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        const formattedChartData: ChartData[] = chartData.chartData.map((item: any) => ({
          name: new Date(item.date).toLocaleDateString(),
          value: item.close,
        }));
        setStockLineChartData(formattedChartData);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      // setIsLoading(false);
    }
  }, [symbol]);

  const fetchChartByDateRange = useCallback(async (dateRange: DateRange) => {
    if (!dateRange.from || !dateRange.to) return;
    
    // setIsLoading(true);
    const period1 = dateRange.from.toISOString().split('T')[0];
    const period2 = dateRange.to.toISOString().split('T')[0];

    try {
      const chartResponse = await fetch(`/api/stock/chart?symbol=${symbol}&period1=${period1}&period2=${period2}`);
      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        const formattedChartData: ChartData[] = chartData.chartData.map((item: any) => ({
          name: new Date(item.date).toLocaleDateString(),
          value: item.close,
        }));
        setStockLineChartData(formattedChartData);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      // setIsLoading(false);
    }
  }, [symbol]);

  // Initial load effect
  useEffect(() => {
    if (!symbol) return;
    fetchChartByPeriod(defaultPeriod);
  }, [defaultPeriod]);

  // Period change effect
  useEffect(() => {
    if (!symbol || !period || !isExpanded) return;
    
    fetchChartByPeriod(period);
  }, [period]);

  // Date range change effect
  useEffect(() => {
    if (!symbol || !dateRange || !isExpanded) return;
    fetchChartByDateRange(dateRange);
  }, [dateRange]);

  return (
    <Card className="w-[90%] mx-auto relative bg-stockCard mb-4 text-foreground">
      <CardHeader className="flex justify-between items-start !flex-row">
        <h2 className="text-2xl font-bold">{title}</h2>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            <div className="flex justify-between font-bold mb-4">
              {attributes.map((attr, index) => (
                <React.Fragment key={index}>
                  <span>{attr.label}: {attr.value}</span>
                  {index < attributes.length - 1 && <Separator orientation="vertical" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between font-bold mb-4">
              {bottomAttributes.map((attr, index) => (
                <React.Fragment key={index}>
                  <span>{attr}</span>
                  {index < bottomAttributes.length - 1 && <Separator orientation="vertical" />}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pb-0 mb-2">
        <Button
          variant="ringHover"
          size="default"
          className="mr-2"
          onClick={() => setShowFinancialSummary(true)}
        >
          Financial Summary
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse card" : "Expand card"}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          )}
        </Button>
      </CardFooter>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden pt-1.5"
      >
        <Separator className="mb-4 bg-gray-400" />
        <CardContent>
        <div className="flex items-start space-x-4">
          <div className="flex space-x-2">
            {['1M', '6M', '1Y', '5Y', 'Max'].map((period, index) => ( //TODO: while mapping periods, useffect triggers the api call
              <React.Fragment key={period}>
                <Button variant="linkHover2" onClick={() => onPeriodChange(period)}>
                  {period}
                </Button>
                {index < 4 && <Separator orientation="vertical" />}
              </React.Fragment>
            ))}
          </div>
          <DatePickerWithRange onDateChange={onDateChange} />
        </div>
        <br />
          {stockLineChartData.length > 0 && (
            <ChartContainer
              config={{
                value: {
                  label: "Price",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="w-full h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockLineChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-color)" />
                  <YAxis
                    stroke="var(--text-color)"
                    domain={[
                      (dataMin: number) => dataMin * 0.9, // Set base to 10% below the minimum value
                      'auto'
                    ]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </motion.div>

      <FinancialSummaryDialog 
        isOpen={showFinancialSummary}
        onClose={() => setShowFinancialSummary(false)}
        symbol={symbol}
      />
    </Card>
  )
}
