"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface ExpandableChartCardProps {
  title?: string
  attributes?: { label: string; value: string }[]
  bottomAttributes?: string[]
  lineChartData?: { name: string; value: number }[]
  barChartData?: { name: string; value: number }[]
}

export default function ExpandableChartCard({
  title = "Card Title",
  attributes = [
    { label: "Attribute 1", value: "Value 1" },
    { label: "Attribute 2", value: "Value 2" },
  ],
  bottomAttributes = ["Bottom Attribute 1", "Bottom Attribute 2", "Bottom Attribute 3"],
  lineChartData = [],
  barChartData = [],
}: ExpandableChartCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="w-[90%] mx-auto relative bg-card text-foreground">
      <CardHeader className="flex justify-between items-start !flex-row">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-start space-x-4">
          {/* Attributes Block */}
          <div className="space-y-1 text-right flex-row flex">
            {attributes.map((attr, index) => (
              <div key={index} className="p-2 flex items-center justify-between">
                <Label className="text-muted-foreground text-base">{attr.label}:</Label>
                <span className="ml-2 text-base">{attr.value}</span>
              </div>
            ))}
          </div>

          {/* Cross Button Positioned */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete stock"
                className="self-start" // Ensure alignment at the top right
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Stock</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this stock? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="default" onClick={() => {/* logic for cancel */}}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {/* logic for delete action */}}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between font-bold mb-4">
          {bottomAttributes.map((attr, index) => (
            <span key={index}>{attr}</span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
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
        className="overflow-hidden"
      >
        <Separator className="my-4" />
        <CardContent>
          {lineChartData.length > 0 && (
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-color)" />
                  <YAxis stroke="var(--text-color)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
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
