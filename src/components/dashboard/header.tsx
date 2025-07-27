'use client';

import { Bell, Sun, Moon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
      <header className="flex h-16 items-center gap-4 px-4 md:px-6 justify-between">
        <div className="hidden md:block">
          <SidebarTrigger />
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search" 
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Time and Controls */}
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">12:30</div>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex h-12 items-center px-4 md:px-6">
          <div className="flex space-x-6">
            <button className="px-3 py-2 text-sm font-medium border-b-2 border-primary text-primary">
              AI Tools
            </button>
            <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Drones
            </button>
            <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Simulations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}