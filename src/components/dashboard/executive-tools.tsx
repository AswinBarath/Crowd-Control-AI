"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Globe, BarChart3, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function ExecutiveTools() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' }
  ];

  const handleTranslation = () => {
    setIsTranslating(true);
    toast({
      title: "Translation Started",
      description: `Translating interface to ${languages.find(l => l.code === selectedLanguage)?.name}...`,
    });
    
    setTimeout(() => {
      setIsTranslating(false);
      toast({
        title: "Translation Complete",
        description: "Interface has been translated successfully.",
      });
    }, 1500);
  };

  const handleReportGeneration = () => {
    toast({
      title: "Generating Report",
      description: "Executive summary report is being prepared...",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Executive Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multilingual AI Assistant */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Multilingual AI Assistant</span>
            </div>
            
            <div className="space-y-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                size="sm" 
                className="w-full h-8"
                onClick={handleTranslation}
                disabled={isTranslating}
              >
                {isTranslating ? 'Translating...' : 'Apply Translation'}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReportGeneration}
            className="flex flex-col gap-1 h-16"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs">Executive Report</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex flex-col gap-1 h-16"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Analytics</span>
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span>System Status</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Operational</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span>AI Processing</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
