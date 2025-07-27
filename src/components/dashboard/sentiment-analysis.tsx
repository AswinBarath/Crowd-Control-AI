"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { analyzeCrowdSentiment, AnalyzeCrowdSentimentOutput } from "@/ai/flows/crowd-sentiment-analysis"
import { useToast } from "@/hooks/use-toast"
import { Loader2, PieChart } from "lucide-react"

const placeholderChatter = "The lines for the main stage are insane! 😡 #EventFest\nLoving the vibes here at #EventFest, the sound system is epic! 🎶\nCan't find any water stations near Zone C, getting thirsty. #help\nSecurity is super friendly and helpful, great job! 👍"

export function SentimentAnalysis() {
  const [chatter, setChatter] = useState(placeholderChatter)
  const [analysis, setAnalysis] = useState<AnalyzeCrowdSentimentOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setIsLoading(true)
    setAnalysis(null)
    try {
      const result = await analyzeCrowdSentiment({ socialMediaChatter: chatter })
      setAnalysis(result)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to analyze sentiment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card id="sentiment" className="h-full flex flex-col min-h-[500px]">
      <CardHeader>
        <CardTitle>Crowd Sentiment</CardTitle>
        <CardDescription>Analyze social media chatter in real-time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-grow">
        <div className="flex-grow space-y-4">
            <Textarea
                placeholder="Paste social media chatter here..."
                value={chatter}
                onChange={(e) => setChatter(e.target.value)}
                className="h-40 text-xs"
                aria-label="Social media chatter input"
            />
            {analysis && (
            <div className="p-4 bg-muted rounded-md text-sm space-y-3">
                <div>
                    <h4 className="font-semibold">Overall Sentiment:</h4>
                    <p className="text-muted-foreground">{analysis.overallSentiment}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Key Issues:</h4>
                    <p className="text-muted-foreground">{analysis.keyIssues}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Breakdown:</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{analysis.sentimentBreakdown}</p>
                </div>
            </div>
            )}
        </div>
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full mt-auto">
          {isLoading ? <Loader2 className="animate-spin" /> : <PieChart />}
          Analyze Sentiment
        </Button>
      </CardContent>
    </Card>
  )
}
