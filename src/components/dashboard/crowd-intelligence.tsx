"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function CrowdIntelligence() {
  const [crowdDensity, setCrowdDensity] = useState(65);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = (type: string) => {
    setIsAnalyzing(true);
    toast({
      title: "Analysis Started",
      description: `Running ${type} analysis...`,
    });
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: `${type} analysis finished successfully.`,
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crowd Intelligence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-12"
            onClick={() => handleAnalysis('Crowd Flow')}
            disabled={isAnalyzing}
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-12"
            onClick={() => handleAnalysis('Density Mapping')}
            disabled={isAnalyzing}
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-12"
            onClick={() => handleAnalysis('Movement Patterns')}
            disabled={isAnalyzing}
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>
        <div>
          <label className="text-sm font-medium">Crowd Density</label>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>30</span>
              <span>60</span>
              <span>100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${crowdDensity}%` }}
              ></div>
            </div>
            <div className="text-center text-sm font-medium">{crowdDensity}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
