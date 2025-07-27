
"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { analyzeLostItem, AnalyzeLostItemOutput } from "@/ai/flows/analyze-lost-item"
import { Loader2, Search, Upload, Archive } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { addLostItem, getLostItems, LostItem } from "@/lib/firestore"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LostAndFound() {
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalyzeLostItemOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<LostItem[]>([])
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth();

  const fetchItems = async () => {
    if (user) {
      const fetchedItems = await getLostItems(user.uid);
      setItems(fetchedItems);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [user]);

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

  const resetForm = () => {
    setDescription("");
    setPhoto(null);
    setPhotoPreview(null);
    setAnalysis(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleAnalyze = async () => {
    if (!photo || !description || !user) {
      toast({
        title: "Missing Information",
        description: "Please provide both a photo and a description.",
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
        const result = await analyzeLostItem({
          photoDataUri: base64Photo,
          description: description,
        })
        setAnalysis(result)
        
        await addLostItem(user.uid, {
            description,
            photoUrl: base64Photo,
            ...result,
            foundAt: new Date().toISOString(),
        });
        
        toast({ title: "Item Logged", description: "The lost item has been successfully logged." });
        resetForm();
        fetchItems(); // Refresh the list
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to analyze the item. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card id="lost-found" className="h-full">
      <CardHeader>
        <CardTitle>AI-Powered Lost &amp; Found</CardTitle>
        <CardDescription>Log and categorize found items instantly.</CardDescription>
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
              <Image src={photoPreview} alt="Uploaded item" layout="fill" className="object-cover rounded-md" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="mx-auto h-8 w-8" />
                <p className="text-sm mt-1">Click to upload a photo</p>
              </div>
            )}
          </div>
          <Textarea
            placeholder="Describe the item, where it was found, and any identifying marks..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 text-xs"
          />
        </div>
        <Button onClick={handleAnalyze} disabled={isLoading || !photo || !description} className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          Analyze &amp; Log Item
        </Button>
        {items.length > 0 && (
            <div className="space-y-2 pt-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><Archive className="h-4 w-4"/> Logged Items</h4>
                <ScrollArea className="h-48">
                    <div className="space-y-3 pr-4">
                    {items.map(item => (
                        <div key={item.id} className="p-3 bg-muted rounded-md text-sm space-y-1">
                             <p><strong className="text-foreground">Category:</strong> {item.category}</p>
                             <p><strong className="text-foreground">Description:</strong> {item.description}</p>
                             <p><strong className="text-foreground">Action:</strong> {item.recommendedAction}</p>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
