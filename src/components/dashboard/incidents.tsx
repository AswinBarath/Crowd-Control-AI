
"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { intelligentDispatch } from "@/ai/flows/intelligent-dispatch"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { onIncidentsUpdate, updateIncidentStatus, Incident } from "@/lib/firestore"

export function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dispatching, setDispatching] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        const unsubscribe = onIncidentsUpdate(user.uid, setIncidents);
        return () => unsubscribe();
    }
  }, [user]);

  const handleDispatch = async (incident: Incident) => {
    if (!user) return;
    setDispatching(incident.id);
    try {
      const result = await intelligentDispatch({ incidentType: incident.type, location: incident.location });
      toast({
        title: "Dispatch Successful",
        description: `${result.unit} dispatched to ${incident.location}. ETA: ${result.eta}.`,
      });
      await updateIncidentStatus(user.uid, incident.id, "Dispatched");
    } catch (error) {
      console.error(error);
      toast({
        title: "Dispatch Failed",
        description: "Could not dispatch a unit. Please try again manually.",
        variant: "destructive",
      });
    } finally {
      setDispatching(null);
    }
  };

  const getBadgeVariant = (severity: string) => {
    if (severity === 'High') return 'destructive';
    if (severity === 'Medium') return 'secondary';
    return 'outline';
  };

  return (
    <Card id="incidents" className="h-full">
      <CardHeader>
        <CardTitle>Incidents &amp; Alerts</CardTitle>
        <CardDescription>Live feed of reported events with automated dispatch.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px]">
          <div className="space-y-6">
            {incidents.map((incident) => (
              <div key={incident.id} className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{incident.type}</p>
                  <p className="text-sm text-muted-foreground">{incident.location}</p>
                  <p className="text-xs text-muted-foreground">{new Date(incident.time).toLocaleTimeString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <Badge variant={getBadgeVariant(incident.severity)} className="capitalize">{incident.severity}</Badge>
                   {incident.status === "New" && (
                     <Button 
                       size="sm" 
                       variant="outline"
                       onClick={() => handleDispatch(incident)}
                       disabled={dispatching === incident.id}
                     >
                       {dispatching === incident.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Dispatch"}
                     </Button>
                   )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
