
"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { simulateEvacuation, SimulateEvacuationOutput } from "@/ai/flows/simulate-evacuation"
import { Loader2, AlertTriangle } from "lucide-react"

export function EvacuationSimulator() {
  const [scenario, setScenario] = useState("fire-main-stage")
  const [plan, setPlan] = useState<SimulateEvacuationOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSimulate = async () => {
    if (!scenario) {
      toast({ title: "No Scenario Selected", description: "Please choose a scenario to simulate.", variant: "destructive"})
      return;
    }
    setIsLoading(true)
    setPlan(null)
    try {
        const result = await simulateEvacuation({ scenario, crowdData: "Main Stage at 90% capacity, Food Court at 50%." })
        setPlan(result)
    } catch (error) {
        console.error(error)
        toast({
            title: "Error",
            description: "Failed to run simulation.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Card id="evacuation" className="w-full">
      <CardHeader>
        <CardTitle>Smart Evacuation Simulator</CardTitle>
        <CardDescription>Plan emergency responses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger>
                <SelectValue placeholder="Select a scenario" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="fire-main-stage">Fire at Main Stage</SelectItem>
                <SelectItem value="disturbance-gate-b">Disturbance at Gate B</SelectItem>
                <SelectItem value="power-outage-all-zones">Power Outage (All Zones)</SelectItem>
            </SelectContent>
        </Select>

        <Button onClick={handleSimulate} disabled={isLoading || !scenario} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : <AlertTriangle />}
          Run Simulation
        </Button>
        {plan && (
          <div className="p-3 bg-muted rounded-md text-sm space-y-2">
            <h4 className="font-semibold text-foreground">Evacuation Plan: {plan.planTitle}</h4>
            <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                {plan.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                ))}
            </ol>
             <p className="pt-2 text-xs"><strong className="text-foreground">Estimated Time:</strong> {plan.estimatedTimeToEvacuate}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
