import ExpandableChartCard from "@/components/ui/ExpandableChartCard"

export default function StockPage() {
  const stockLineChartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
    { name: "Jun", value: 239 },
  ]

  const stockBarChartData = [
    { name: "A", value: -20 },
    { name: "B", value: -30 },
    { name: "C", value: -40 },
    { name: "D", value: -25 },
    { name: "E", value: -35 },
  ]

  const attributes = [
    { label: "Stock Name", value: "Tesla" },
    { label: "Stock Price", value: "$700" },
  ]

  const bottomAttributes = ["Volume: 1000", "Market Cap: $1T", "P/E Ratio: 30"]

  return (
    <div>
      <ExpandableChartCard
        title="Tesla Stock Overview"
        attributes={attributes}
        bottomAttributes={bottomAttributes}
        lineChartData={stockLineChartData}
        barChartData={stockBarChartData}
      />
    </div>
  )
}
