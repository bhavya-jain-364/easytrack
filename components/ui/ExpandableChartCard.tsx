"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, X, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DatePickerWithRange } from "@/components/ui/daterange"
import React from "react"
import { DateRange } from "react-day-picker"

interface ExpandableChartCardProps {
  title?: string
  attributes?: { label: string; value: string }[]
  bottomAttributes?: string[]
  lineChartData?: { name: string; value: number }[]
  barChartData?: { name: string; value: number }[]
  symbol: string
  period?: string
}


export default function ExpandableChartCard({
  title = "Card Title",
  attributes = [],
  bottomAttributes = [],
  lineChartData = [],
  barChartData = [],
  onPeriodChange,
  onDateChange,
}: ExpandableChartCardProps & { onPeriodChange: (period: string) => void, onDateChange: (range: DateRange) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="w-[90%] mx-auto relative bg-card text-foreground">
      <CardHeader className="flex justify-between items-start !flex-row">
        <h2 className="text-2xl font-bold">{title}</h2>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex justify-end pb-0">
        <Button
          variant="ringHover"
          size="default"
          onClick={() => console.log("Button clicked")}
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
            {['1M', '6M', '1Y', '5Y', 'Max'].map((period, index) => (
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
          {lineChartData.length > 0 && (
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="w-full h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
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
          {barChartData.length > 0 && (
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[150px] mt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-color)" />
                  <YAxis stroke="var(--text-color)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </motion.div>
    </Card>
  )
}
