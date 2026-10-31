import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, CalendarCog, Users, Radar, Bell, BarChart3, ScrollText, Code2, Settings, LifeBuoy, Menu, X, Search, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/configuration", label: "Appointment Configuration", icon: CalendarCog },
  { to: "/applicants", label: "Applicants", icon: Users },
  { to: "/monitoring", label: "Appointment Monitoring", icon: Radar },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/logs", label: "Activity Logs", icon: ScrollText },
  { to: "/developer", label: "Developer Settings", icon: Code2 },
  { to: "/settings", label: "General Settings", icon: Settings },
  { to: "/help", label: "Help and Support", icon: LifeBuoy },
] as const;

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid size-9 place-items-center rounded-lg bg-sidebar-primary font-display text-sm font-bold text-sidebar-primary-foreground">BL</div>
        <div>
          <div className="font-display text-sm font-semibold leading-tight">BLS Appointment</div>
          <div className="text-[0.7rem] text-sidebar-muted">Manager · Agency</div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {nav.map((item) => {
          const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to} onClick={onNavigate}
              className={cn("group flex items-center gap-3 rounded-lg px-3 py-2 text-[0.82rem] font-medium transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")}>
              <item.icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
              <span className="truncate">{item.label}</span>
              {active && <span className="ml-auto h-4 w-0.5 rounded-full bg-sidebar-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold">MO</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold">Miguel Obi</div>
            <div className="truncate text-[0.7rem] text-sidebar-muted">Admin · Horizon Travels</div>
          </div>
          <Link to="/login" aria-label="Sign out" className="text-sidebar-muted hover:text-sidebar-foreground"><LogOut className="size-4" /></Link>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block"><SidebarBody /></aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-xl">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-3 top-5 text-sidebar-muted"><X className="size-5" /></button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <button aria-label="Open menu" className="lg:hidden" onClick={() => setOpen(true)}><Menu className="size-5" /></button>
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search applicants, tasks, logs…" className="h-9 bg-card pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 md:inline-flex">
              <span className="size-1.5 rounded-full bg-warning" /> Demo data · integrations not connected
            </span>
            <Link to="/notifications" aria-label="Notifications" className="relative grid size-9 place-items-center rounded-lg border bg-card text-foreground">
              <Bell className="size-4" />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive" />
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
