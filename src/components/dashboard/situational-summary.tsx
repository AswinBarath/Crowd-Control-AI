"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generateSituationalSummary, GenerateSituationalSummaryInput } from "@/ai/flows/generate-situational-summary"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Wand2 } from "lucide-react"

const placeholderInput: GenerateSituationalSummaryInput = {
    crowdDensity: "High density in Zone A near main stage, moderate in food courts (Zone B), low density in outer perimeter (Zone C).",
    crowdFlow: "Slow movement from main entrance towards Zone A. High traffic between Zone A and B. Free flow in Zone C.",
    incidentReports: "One minor medical incident in Zone A (resolved). Two reports of lost items near main stage.",
    socialMediaSentiment: "Overall positive (78%). Some complaints about long queues for restrooms in Zone A."
}

export function SituationalSummary() {
  const [input, setInput] = useState<string>(JSON.stringify(placeholderInput, null, 2))
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    setIsLoading(true)
    setSummary("")
    try {
        const parsedInput: GenerateSituationalSummaryInput = JSON.parse(input)
        const result = await generateSituationalSummary(parsedInput)
        setSummary(result.summary)
    } catch (error) {
        console.error(error)
        toast({
            title: "Error",
            description: "Failed to generate summary. Please check the input format and try again.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Card id="summary" className="h-full flex flex-col min-h-[500px]">
      <CardHeader>
        <CardTitle>AI Situational Summary</CardTitle>
        <CardDescription>Generate a concise briefing from live data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-grow">
        <div className="flex-grow space-y-4">
            <Textarea
            placeholder="Crowd data in JSON format..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-code text-xs h-40 flex-grow"
            aria-label="Situational data input"
            />
            {summary && (
            <div className="p-4 bg-muted rounded-md text-sm space-y-2">
                <h4 className="font-semibold">Latest Briefing:</h4>
                <p className="text-muted-foreground">{summary}</p>
            </div>
            )}
        </div>
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full mt-auto">
          {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
          Generate Summary
        </Button>
      </CardContent>
    </Card>
  )
}
