
"use client"
import Link from "next/link"
import { Bot, FileText, LayoutDashboard, PieChart, Settings, Siren, Users, Airplay, Search, BookImage, ShieldAlert, Zap, AlertTriangle, MessageSquareQuote } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import type { View } from '@/app/page';

const navItems: { id: View, label: string, icon: React.ElementType, category?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    
    // AI Tools
    { id: "assistant", label: "AI Assistant", icon: Bot, category: "AI Tools" },
    { id: "summary", label: "Situational Summary", icon: FileText, category: "AI Tools" },
    { id: "sentiment", label: "Sentiment Analysis", icon: PieChart, category: "AI Tools" },
    { id: "anomaly-detection", label: "Anomaly Detection", icon: ShieldAlert, category: "AI Tools" },
    { id: "forecasting", label: "Bottleneck Forecasting", icon: Zap, category: "AI Tools" },
    { id: "nudging", label: "Crowd Nudging", icon: MessageSquareQuote, category: "AI Tools" },
    
    // Monitoring & Analysis
    { id: "venue-map", label: "Live Venue Map", icon: Airplay, category: "Monitoring" },
    { id: "heatmap", label: "Incident Heatmap", icon: Users, category: "Monitoring" },
    { id: "incidents", label: "Critical Alerts", icon: Siren, category: "Monitoring" },
    { id: "analysis-log", label: "Firebase Logs", icon: BookImage, category: "Monitoring" },
    
    // Simulations & Control
    { id: "evacuation", label: "Evacuation Simulator", icon: AlertTriangle, category: "Simulations" },
    { id: "drones", label: "Drone Control", icon: Airplay, category: "Drones" },
    { id: "lost-found", label: "Lost & Found", icon: Search, category: "Tools" },
]

interface NavProps {
    currentView: View;
    setView: (view: View) => void;
}

export function Nav({ currentView, setView }: NavProps) {

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: View) => {
    e.preventDefault();
    setView(id);
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Group items by category
  const groupedItems = navItems.reduce((acc, item) => {
    const category = item.category || 'Main';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <SidebarMenu>
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category}>
          {category !== 'Main' && (
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {category}
            </div>
          )}
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                href={`#${item.id}`}
                isActive={currentView === item.id}
                onClick={(e: any) => handleNav(e, item.id)}
                tooltip={item.label}
              >
                <Link href={`#${item.id}`}>
                    <item.icon />
                    <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>
      ))}
    </SidebarMenu>
  )
}
