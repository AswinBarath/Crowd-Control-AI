
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Loader2, Scan, UserCheck, Airplay, Send } from 'lucide-react';
import { analyzeCrowdFlow, AnalyzeCrowdFlowOutput } from '@/ai/flows/analyze-crowd-flow';
import { identifyStaffRoles, IdentifyStaffRolesOutput } from '@/ai/flows/identify-staff-roles';
import { deployDrone, DeployDroneOutput } from '@/ai/flows/deploy-drone';

export interface AnalysisLogEntry {
  id: string;
  timestamp: string;
  snapshot: string;
  analysis: AnalyzeCrowdFlowOutput;
}

interface CrowdMapProps {
  onNewAnalysis: (entry: Omit<AnalysisLogEntry, 'id'>) => void;
  initialTab?: 'venue-map' | 'density' | 'staff' | 'drones' | 'heatmap';
}

export type StaffMember = IdentifyStaffRolesOutput['staff'][0];

const initialDrones = [
  { id: 'DRN001', name: 'Alpha Drone', status: 'Standby' },
  { id: 'DRN002', name: 'Bravo Drone', status: 'Standby' },
  { id: 'DRN003', name: 'Charlie Drone', status: 'Charging' },
];

export function CrowdMap({ onNewAnalysis, initialTab = 'density' }: CrowdMapProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeCrowdFlowOutput | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [drones, setDrones] = useState(initialDrones);
  const [isLoading, setIsLoading] = useState(false);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [isDeployingDrone, setIsDeployingDrone] = useState<string | null>(null);
  
  const mapTabToValue = (tab: CrowdMapProps['initialTab']): string => {
    if (tab === 'heatmap' || tab === 'staff') return 'staff';
    if (tab === 'venue-map') return 'density';
    return tab || 'density';
  }
  const [activeTab, setActiveTab] = useState(mapTabToValue(initialTab));
  
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not available.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const captureFrame = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
      }
    }
    return null;
  };

  const handleAnalyzeCrowd = async () => {
    const frame = captureFrame();
    if (!frame) {
      toast({ title: "Error", description: "Could not capture frame from video.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeCrowdFlow({ videoFrame: frame });
      setAnalysis(result);
      onNewAnalysis({
        timestamp: new Date().toISOString(),
        snapshot: frame,
        analysis: result,
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to analyze crowd flow. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleIdentifyStaff = async () => {
    const frame = captureFrame();
    if (!frame) {
      toast({ title: "Error", description: "Could not capture frame from video.", variant: "destructive" });
      return;
    }

    setIsStaffLoading(true);
    setStaff([]);
    try {
      const result = await identifyStaffRoles({ videoFrame: frame });
      setStaff(result.staff);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to identify staff. Please try again.", variant: "destructive" });
    } finally {
      setIsStaffLoading(false);
    }
  };

  const handleDeployDrone = async (droneId: string, location: string) => {
    const frame = captureFrame();
    if (!frame) {
      toast({ title: "Error", description: "Could not capture frame for context.", variant: "destructive" });
      return;
    }
    setIsDeployingDrone(droneId);
    setDrones(drones.map(d => d.id === droneId ? { ...d, status: 'Deploying...' } : d));
    try {
      const result = await deployDrone({ droneId, location, contextImage: frame });
      setDrones(drones.map(d => d.id === droneId ? { ...d, status: `Deployed to ${location}` } : d));
      toast({ title: "Drone Deployed", description: `${result.confirmation}`});
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to deploy drone.", variant: "destructive" });
      setDrones(drones.map(d => d.id === droneId ? { ...d, status: 'Deployment Failed' } : d));
    } finally {
      setIsDeployingDrone(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'security': return 'border-blue-500';
      case 'volunteer': return 'border-green-500';
      case 'medical': return 'border-white';
      default: return 'border-yellow-500';
    }
  }

  const getStatusColor = (status: string) => {
    if (status.includes('Deployed')) return 'text-green-500';
    if (status === 'Charging' || status.includes('Failed')) return 'text-red-500';
    if (status.includes('Deploying')) return 'text-yellow-500';
    return 'text-muted-foreground';
  }

  return (
    <Card id="venue-map">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
                <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                    <CardTitle>Live Venue Map</CardTitle>
                    <CardDescription>Real-time crowd and staff analysis.</CardDescription>
                </div>
                <TabsList>
                    <TabsTrigger value="density">Density</TabsTrigger>
                    <TabsTrigger value="staff" id="heatmap">Staff Heatmap</TabsTrigger>
                    <TabsTrigger value="drones" id="drones">Drones</TabsTrigger>
                </TabsList>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="aspect-video relative bg-muted rounded-md flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                
                {activeTab === 'staff' && staff.length > 0 && (
                    <div className="absolute inset-0">
                    {staff.map((s, i) => (
                        <div key={i} className={`absolute border-2 ${getRoleColor(s.role)}`} style={{
                        left: `${s.location.x * 100}%`,
                        top: `${s.location.y * 100}%`,
                        width: `${s.location.width * 100}%`,
                        height: `${s.location.height * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        }}>
                        <span className="text-xs text-white bg-black/50 px-1">{s.role}</span>
                        </div>
                    ))}
                    </div>
                )}

                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>Please allow camera access.</AlertDescription>
                    </Alert>
                    </div>
                )}
                {hasCameraPermission === null && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                </div>
                
                <TabsContent value="density">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        {analysis && (
                            <div className="p-4 bg-muted rounded-md text-sm space-y-2">
                                <h4 className="font-semibold">Latest Crowd Analysis:</h4>
                                <p><strong>Density:</strong> {analysis.density}</p>
                                <p><strong>Flow:</strong> {analysis.flow}</p>
                                <p><strong>Bottlenecks:</strong> {analysis.bottlenecks}</p>
                            </div>
                        )}
                    </div>
                    <Button onClick={handleAnalyzeCrowd} disabled={isLoading || !hasCameraPermission} className="w-full md:col-span-1 self-start">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Scan className="w-4 h-4 mr-2" />}
                        Analyze Crowd
                    </Button>
                </div>
                </TabsContent>
                
                <TabsContent value="staff">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        {staff.length > 0 && (
                            <div className="p-4 bg-muted rounded-md text-sm space-y-2">
                                <h4 className="font-semibold">Staff Detected:</h4>
                                <ul className="list-disc list-inside">
                                    {staff.map((s, i) => (
                                    <li key={i}>{s.role} ({s.color})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {isStaffLoading && staff.length === 0 && <p className="text-sm text-muted-foreground">Identifying staff...</p>}
                    </div>
                    <Button onClick={handleIdentifyStaff} disabled={isStaffLoading || !hasCameraPermission} className="w-full md:col-span-1 self-start">
                        {isStaffLoading ? <Loader2 className="animate-spin" /> : <UserCheck className="w-4 h-4 mr-2" />}
                        Identify Staff
                    </Button>
                </div>
                </TabsContent>

                <TabsContent value="drones">
                <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Drone Fleet Status</h4>
                    {drones.map(drone => (
                    <div key={drone.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-3">
                        <Airplay className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-medium">{drone.name} <span className="text-xs text-muted-foreground">({drone.id})</span></p>
                            <p className={`text-sm font-semibold ${getStatusColor(drone.status)}`}>{drone.status}</p>
                        </div>
                        </div>
                        <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeployDrone(drone.id, 'Main Stage Area')}
                        disabled={isDeployingDrone === drone.id || drone.status === 'Charging' || !hasCameraPermission}
                        >
                        {isDeployingDrone === drone.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                        Deploy
                        </Button>
                    </div>
                    ))}
                </div>
                </TabsContent>
            </CardContent>
      </Tabs>
    </Card>
  );
}
