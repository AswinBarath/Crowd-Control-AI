"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer, RefreshCw, MapPin } from 'lucide-react';

interface HeatmapCell {
  id: string;
  intensity: number; // 0-100
  incidents: number;
  zone: string;
}

export function IncidentHeatmap() {
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [timeRange, setTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateHeatmapData = () => {
    const zones = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
    return Array.from({ length: 30 }, (_, i) => ({
      id: `cell-${i}`,
      intensity: Math.floor(Math.random() * 100),
      incidents: Math.floor(Math.random() * 5),
      zone: zones[Math.floor(i / 3.33)] || 'A1'
    }));
  };

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setHeatmapData(generateHeatmapData());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    setHeatmapData(generateHeatmapData());
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setHeatmapData(generateHeatmapData());
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const getHeatColor = (intensity: number) => {
    if (intensity < 20) return 'bg-green-200 dark:bg-green-900/30';
    if (intensity < 40) return 'bg-yellow-200 dark:bg-yellow-900/30';
    if (intensity < 60) return 'bg-orange-300 dark:bg-orange-900/40';
    if (intensity < 80) return 'bg-red-300 dark:bg-red-900/40';
    return 'bg-red-500 dark:bg-red-700/60';
  };

  const maxIncidents = Math.max(...heatmapData.map(cell => cell.incidents));
  const avgIntensity = heatmapData.reduce((sum, cell) => sum + cell.intensity, 0) / heatmapData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          Incident Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">15m</SelectItem>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="6h">6h</SelectItem>
              <SelectItem value="24h">24h</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Heatmap Grid */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <div className="grid grid-cols-6 gap-1 h-32">
            {heatmapData.map((cell) => (
              <div
                key={cell.id}
                className={`rounded-sm relative group cursor-pointer transition-all hover:scale-110 ${getHeatColor(cell.intensity)}`}
                title={`Zone ${cell.zone}: ${cell.incidents} incidents, ${cell.intensity}% intensity`}
              >
                {cell.incidents > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 bg-black dark:bg-white rounded-full opacity-70"></div>
                  </div>
                )}
                
                {/* Tooltip on hover */}
                <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                  Zone {cell.zone}: {cell.incidents} incidents
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 dark:bg-green-900/30 rounded"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-900/30 rounded"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 dark:bg-red-700/60 rounded"></div>
            <span>High</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">{maxIncidents}</div>
            <div className="text-xs text-muted-foreground">Max Incidents</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{Math.round(avgIntensity)}%</div>
            <div className="text-xs text-muted-foreground">Avg Intensity</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
