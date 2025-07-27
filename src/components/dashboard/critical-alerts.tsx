"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Flame, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
}

export function CriticalAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'High Density Alert',
      description: 'Main stage area exceeding safe capacity',
      timestamp: '2 min ago',
      icon: Users
    }
  ]);
  const [autonomousDeployment, setAutonomousDeployment] = useState(false);
  const { toast } = useToast();

  const toggleAutonomousDeployment = () => {
    setAutonomousDeployment(!autonomousDeployment);
    toast({
      title: autonomousDeployment ? "Autonomous Deployment Disabled" : "Autonomous Deployment Enabled",
      description: autonomousDeployment 
        ? "Manual intervention required for deployments" 
        : "System will automatically deploy resources when needed",
      variant: autonomousDeployment ? "destructive" : "default"
    });
  };

  useEffect(() => {
    // Simulate real-time alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? 'warning' : 'info',
          title: 'System Update',
          description: 'Crowd flow parameters updated',
          timestamp: 'Just now',
          icon: Shield
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Critical Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">●●●</div>
          </div>
        </div>
        
        {/* Recent Alerts */}
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className="flex items-start gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <Icon className="w-4 h-4 mt-0.5 text-red-600" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{alert.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{alert.description}</div>
                  <div className="text-xs text-gray-500">{alert.timestamp}</div>
                </div>
                <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                  {alert.type}
                </Badge>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Autonomous Deployment</span>
            <button 
              onClick={toggleAutonomousDeployment}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                autonomousDeployment 
                  ? 'bg-green-500' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                autonomousDeployment ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
