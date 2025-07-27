
"use client";

import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Nav } from '@/components/dashboard/nav';
import { Header } from '@/components/dashboard/header';
import { KeyMetrics } from '@/components/dashboard/key-metrics';
import { CrowdMap, AnalysisLogEntry } from '@/components/dashboard/crowd-map';
import { Incidents } from '@/components/dashboard/incidents';
import { SituationalSummary } from '@/components/dashboard/situational-summary';
import { SentimentAnalysis } from '@/components/dashboard/sentiment-analysis';
import { AiAssistant } from '@/components/dashboard/ai-assistant';
import { LostAndFound } from '@/components/dashboard/lost-and-found';
import { AnalysisLog } from '@/components/dashboard/analysis-log';
import { AnomalyDetection } from '@/components/dashboard/anomaly-detection';
import { BottleneckForecasting } from '@/components/dashboard/bottleneck-forecasting';
import { EvacuationSimulator } from '@/components/dashboard/evacuation-simulator';
import { CrowdNudging } from '@/components/dashboard/crowd-nudging';
import { CriticalAlerts } from '@/components/dashboard/critical-alerts';
import { CrowdIntelligence } from '@/components/dashboard/crowd-intelligence';
import { ExecutiveTools } from '@/components/dashboard/executive-tools';
import { IncidentHeatmap } from '@/components/dashboard/incident-heatmap';
import { Logo } from '@/components/icons';
import { addAnalysisLogEntry } from '@/lib/firestore';
import { useAuth } from '@/hooks/use-auth';


export type View = 
  | 'dashboard' | 'venue-map' | 'summary' | 'sentiment' | 'assistant' 
  | 'incidents' | 'heatmap' | 'anomaly-detection' | 'lost-found' 
  | 'analysis-log' | 'forecasting' | 'evacuation' | 'nudging' | 'drones';

export default function Dashboard() {
  const [view, setView] = useState<View>('dashboard');
  const { user } = useAuth();
  
  const handleNewAnalysis = async (entry: Omit<AnalysisLogEntry, 'id'>) => {
    if (user) {
      await addAnalysisLogEntry(user.uid, entry);
    }
  };

  const renderContent = () => {
    switch(view) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Critical Alerts */}
            <CriticalAlerts />

            {/* Crowd Intelligence */}
            <CrowdIntelligence />

            {/* Executive Tools */}
            <ExecutiveTools />

            {/* Incident Heatmap */}
            <IncidentHeatmap />

            {/* AI Command */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
              <CardHeader>
                <CardTitle>AI Command</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">Gemini Situational Summary</div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-4/5"></div>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => setView('evacuation')}>
                  Smart Evacuation
                </Button>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 h-24">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded opacity-50"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Resource Dispatch</span>
                  <div className="text-sm">—</div>
                </div>
              </CardContent>
            </Card>

            {/* Firebase Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Firebase Logs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 h-20">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 rounded opacity-30"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google Maps</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-gray-400 rounded"></div>
                    <div className="w-1 h-4 bg-gray-400 rounded"></div>
                    <div className="w-1 h-4 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Evacuation Simulator */}
            <Card>
              <CardHeader>
                <CardTitle>Smart Evacuation Simulator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-1 h-20">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="border border-gray-300 dark:border-gray-600 rounded-sm"></div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => setView('evacuation')}
                >
                  Open Full Simulator
                </Button>
              </CardContent>
            </Card>

            {/* Firebase Logs Bottom */}
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-4/5"></div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => setView('analysis-log')}
                >
                  View Full Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'venue-map':
      case 'heatmap':
      case 'drones':
        return <CrowdMap onNewAnalysis={handleNewAnalysis} initialTab={view} />;
      case 'summary':
        return <SituationalSummary />;
      case 'sentiment':
        return <SentimentAnalysis />;
      case 'assistant':
        return <AiAssistant />;
      case 'incidents':
        return <CriticalAlerts />;
      case 'anomaly-detection':
        return <AnomalyDetection />;
      case 'lost-found':
        return <LostAndFound />;
      case 'analysis-log':
        return <AnalysisLog />;
      case 'forecasting':
        return <BottleneckForecasting />;
      case 'evacuation':
        return <EvacuationSimulator />;
      case 'nudging':
        return <CrowdNudging />;
      default:
        return <p>Select a view</p>;
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar>
          <SidebarHeader className="p-4 flex items-center justify-between">
            <Logo />
            <SidebarTrigger className="md:hidden" />
          </SidebarHeader>
          <SidebarContent>
            <Nav currentView={view} setView={setView} />
          </SidebarContent>
          <SidebarFooter>
            {/* User profile removed */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 lg:p-6 space-y-6">
              {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
