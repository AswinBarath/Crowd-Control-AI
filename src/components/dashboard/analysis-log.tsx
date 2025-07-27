
"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { AnalysisLogEntry } from './crowd-map'
import { useAuth } from "@/hooks/use-auth"
import { onAnalysisLogUpdate } from "@/lib/firestore"

export function AnalysisLog() {
    const { user } = useAuth();
    const [log, setLog] = useState<AnalysisLogEntry[]>([]);

    useEffect(() => {
        if (user) {
            const unsubscribe = onAnalysisLogUpdate(user.uid, (newLog) => {
                setLog(newLog);
            });
            return () => unsubscribe();
        }
    }, [user]);

    if (log.length === 0) {
        return (
            <Card id="analysis-log">
                <CardHeader>
                    <CardTitle>Crowd Analysis Log</CardTitle>
                    <CardDescription>A log of all crowd analysis snapshots.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-12">
                        <p>No analysis has been performed yet.</p>
                        <p className="text-sm">Click "Analyze Crowd" on the venue map to start.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card id="analysis-log">
            <CardHeader>
                <CardTitle>Crowd Analysis Log</CardTitle>
                <CardDescription>A log of all crowd analysis snapshots.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                        {log.map((entry) => (
                            <div key={entry.id} className="p-4 border rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-2 flex-grow">
                                    <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                                    <div className="text-sm">
                                        <p><strong>Density:</strong> {entry.analysis.density}</p>
                                        <p><strong>Flow:</strong> {entry.analysis.flow}</p>
                                        <p><strong>Bottlenecks:</strong> {entry.analysis.bottlenecks}</p>
                                    </div>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">View Snapshot</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Analysis Snapshot - {new Date(entry.timestamp).toLocaleString()}</DialogTitle>
                                        </DialogHeader>
                                        <div className="relative aspect-video">
                                            <Image src={entry.snapshot} alt={`Snapshot at ${entry.timestamp}`} layout="fill" className="rounded-md object-contain" />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
