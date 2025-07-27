
"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { multilingualAssistant } from "@/ai/flows/multilingual-ai-assistant"
import { textToSpeech } from "@/ai/flows/text-to-speech"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Send, User, Bot, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { addChatMessage, getChatHistory } from "@/lib/firestore"

interface Message {
  text: string
  isUser: boolean
  audioDataUri?: string
}

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today? I can answer in multiple languages.", isUser: false }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth();
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
        getChatHistory(user.uid).then(history => {
            if (history.length > 0) {
                setMessages(history);
            }
        });
    }
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) return
    const userMessage = { text: input, isUser: true }
    
    // Optimistically update UI
    setMessages(prev => [...prev, userMessage])
    await addChatMessage(user.uid, userMessage);
    
    setInput("")
    setIsLoading(true)

    try {
      const result = await multilingualAssistant({ query: input })
      const aiMessage: Message = { text: result.answer, isUser: false, audioDataUri: "" };
      
      setMessages(prev => [...prev, aiMessage]);
      await addChatMessage(user.uid, aiMessage);

      // Generate speech after getting text response
      const audioResult = await textToSpeech(result.answer)
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && !lastMessage.isUser) {
          lastMessage.audioDataUri = audioResult.media;
        }
        return newMessages
      })

    } catch (error) {
      console.error(error)
      const errorMessage = { text: "Sorry, I couldn't process that. Please try again.", isUser: false};
      setMessages(prev => [...prev, errorMessage]);
      await addChatMessage(user.uid, errorMessage);
      toast({
        title: "Error",
        description: "The AI assistant is currently unavailable.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages])

  return (
    <Card id="assistant" className="h-full flex flex-col min-h-[500px]">
      <CardHeader>
        <CardTitle>Multilingual AI Assistant</CardTitle>
        <CardDescription>Instant answers for staff and visitors, with voice.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <ScrollArea className="flex-grow pr-4 -mr-4">
            <div ref={viewportRef} className="h-full space-y-4">
                {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.isUser ? "justify-end" : "justify-start")}>
                    {!message.isUser && <Avatar className="w-8 h-8"><AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback></Avatar>}
                    <div className="flex flex-col gap-2">
                      <div className={cn("max-w-[75%] rounded-lg p-3 text-sm shadow-sm", message.isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        {message.text}
                      </div>
                      {!message.isUser && message.audioDataUri && (
                        <audio src={message.audioDataUri} controls className="h-8 max-w-[75%]"/>
                      )}
                    </div>
                    {message.isUser && <Avatar className="w-8 h-8"><AvatarFallback><User className="w-4 h-4" /></AvatarFallback></Avatar>}
                </div>
                ))}
                {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="w-8 h-8"><AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback></Avatar>
                    <div className="max-w-[75%] rounded-lg p-3 text-sm bg-muted flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                </div>
                )}
            </div>
        </ScrollArea>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 pt-2 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={authLoading ? "Authenticating..." : (user ? "Ask a question..." : "Please log in to use the assistant.")}
            disabled={isLoading || authLoading || !user}
            aria-label="AI Assistant Input"
          />
          <Button type="submit" size="icon" disabled={isLoading || authLoading || !user || !input.trim()} aria-label="Send message">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
