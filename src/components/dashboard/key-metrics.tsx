import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wind, PieChart, Siren } from "lucide-react"

const metrics = [
  { title: "Crowd Density", value: "High", change: "Sector 4", icon: Users },
  { title: "Flow Speed", value: "0.8 m/s", change: "-12% from avg", icon: Wind },
  { title: "Sentiment", value: "Positive", change: "78% score", icon: PieChart },
  { title: "Active Incidents", value: "3", change: "+1 in last hour", icon: Siren },
]

export function KeyMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {metrics.map((metric) => (
        <Card key={metric.title}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.change}</p>
        </CardContent>
        </Card>
    ))}
    </div>
  )
}
