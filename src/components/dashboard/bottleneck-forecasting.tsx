
"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { predictBottlenecks, PredictBottlenecksInput, PredictBottlenecksOutput } from "@/ai/flows/predict-bottlenecks"
import { Loader2, Zap } from "lucide-react"

const placeholderInput: PredictBottlenecksInput = {
    currentDensity: "High traffic between Zone A and B. Main Stage at 90% capacity.",
    historicalData: "Historically, 30 minutes before the main act, the area between the main stage and food court becomes a bottleneck.",
    eventSchedule: "Main act starts in 45 minutes. A smaller act just finished on Stage 2."
}

export function BottleneckForecasting() {
  const [input, setInput] = useState<string>(JSON.stringify(placeholderInput, null, 2))
  const [forecast, setForecast] = useState<PredictBottlenecksOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleForecast = async () => {
    setIsLoading(true)
    setForecast(null)
    try {
        const parsedInput: PredictBottlenecksInput = JSON.parse(input)
        const result = await predictBottlenecks(parsedInput)
        setForecast(result)
    } catch (error) {
        console.error(error)
        toast({
            title: "Error",
            description: "Failed to generate forecast. Please check the input format.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Card id="forecasting" className="w-full">
      <CardHeader>
        <CardTitle>Predictive Bottleneck Forecasting</CardTitle>
        <CardDescription>Anticipate crowd congestion points.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-code text-xs h-32"
            aria-label="Forecasting data input"
        />
        <Button onClick={handleForecast} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : <Zap />}
          Generate Forecast
        </Button>
        {forecast && (
          <div className="p-3 bg-muted rounded-md text-sm space-y-2">
            <h4 className="font-semibold text-foreground">Forecast Result:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {forecast.predictions.map((p, i) => (
                    <li key={i}>
                        <strong className="text-foreground">{p.location}:</strong> Risk is {p.riskLevel}. Expected in {p.timeframe}.
                    </li>
                ))}
            </ul>
             <p className="pt-2"><strong className="text-foreground">Recommendation:</strong> {forecast.recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
