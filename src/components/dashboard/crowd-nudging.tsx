
"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { generateNudge, GenerateNudgeOutput } from "@/ai/flows/generate-nudge"
import { Loader2, MessageSquareQuote, Send } from "lucide-react"

export function CrowdNudging() {
  const [incentive, setIncentive] = useState<GenerateNudgeOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGenerateNudge = async () => {
    setIsLoading(true)
    setIncentive(null)
    try {
        const result = await generateNudge({
            congestedZone: "Main Stage",
            targetZone: "Chill Zone C",
            incentiveType: "discount",
        })
        setIncentive(result)
    } catch (error) {
        console.error(error)
        toast({
            title: "Error",
            description: "Failed to generate nudge message.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false)
    }
  }

  const handleSendNudge = () => {
    toast({
        title: "Nudge Sent (Simulated)",
        description: "The incentive has been broadcast to visitors near the Main Stage."
    })
  }

  return (
    <Card id="nudging" className="w-full">
      <CardHeader>
        <CardTitle>Gamified Crowd Nudging</CardTitle>
        <CardDescription>Promote movement to low-traffic zones.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateNudge} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : <MessageSquareQuote />}
          Generate Nudge Incentive
        </Button>
        {incentive && (
          <div className="p-3 bg-muted rounded-md text-sm space-y-3">
            <div>
                <h4 className="font-semibold text-foreground">Generated Message:</h4>
                <p className="text-muted-foreground italic">"{incentive.message}"</p>
            </div>
             <p><strong className="text-foreground">Target Audience:</strong> {incentive.targetAudience}</p>
             <Button size="sm" className="w-full" onClick={handleSendNudge}><Send className="mr-2 h-4 w-4"/> Send Nudge</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
