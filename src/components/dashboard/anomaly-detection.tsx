
"use client"
import { useState, useRef } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { detectAnomalies, DetectAnomaliesOutput } from "@/ai/flows/detect-anomalies"
import { Loader2, ShieldAlert, Upload } from "lucide-react"

export function AnomalyDetection() {
  const [sensorData, setSensorData] = useState("Loud noise detected at 110dB. Temperature spike to 45°C in Zone B.")
  const [socialChatter, setSocialChatter] = useState("Is that smoke near the stage?! #EventFest\nEveryone started running, what's happening? #panic")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DetectAnomaliesOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!photo) {
      toast({
        title: "Missing Information",
        description: "Please provide a photo for anomaly detection.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setAnalysis(null)
    try {
      const reader = new FileReader()
      reader.readAsDataURL(photo)
      reader.onloadend = async () => {
        const base64Photo = reader.result as string
        const result = await detectAnomalies({
          image: base64Photo,
          sensorData,
          socialChatter,
        })
        setAnalysis(result)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to detect anomalies. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card id="anomaly-detection" className="h-full">
      <CardHeader>
        <CardTitle>Multimodal Anomaly Detection</CardTitle>
        <CardDescription>Detect incidents using combined data sources.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <div 
                className="aspect-video w-full bg-muted rounded-md flex items-center justify-center cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
            >
                <Input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                />
                {photoPreview ? (
                <Image src={photoPreview} alt="Anomaly evidence" layout="fill" className="object-cover rounded-md" />
                ) : (
                <div className="text-center text-muted-foreground">
                    <Upload className="mx-auto h-8 w-8" />
                    <p className="text-sm mt-1">Upload an image</p>
                </div>
                )}
            </div>
            <Textarea
                placeholder="Simulated sensor data (e.g., temperature, noise levels)..."
                value={sensorData}
                onChange={(e) => setSensorData(e.target.value)}
                className="h-20 text-xs font-code"
                aria-label="Sensor data input"
            />
            <Textarea
                placeholder="Related social media chatter..."
                value={socialChatter}
                onChange={(e) => setSocialChatter(e.target.value)}
                className="h-20 text-xs"
                aria-label="Social media chatter input"
            />
        </div>
        <Button onClick={handleAnalyze} disabled={isLoading || !photo} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : <ShieldAlert />}
          Detect Anomalies
        </Button>
        {analysis && (
          <div className="p-3 bg-muted rounded-md text-sm space-y-2 text-muted-foreground">
            <p><strong className="text-foreground">Anomaly Type:</strong> {analysis.anomalyType}</p>
            <p><strong className="text-foreground">Severity:</strong> {analysis.severity}</p>
            <p><strong className="text-foreground">Action:</strong> {analysis.recommendedAction}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
