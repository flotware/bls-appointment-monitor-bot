import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, description, actions, children, className }: { title?: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("panel p-5", className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-[0.95rem] font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, icon: Icon, hint, tone = "default" }: { label: string; value: string | number; icon: LucideIcon; hint?: string; tone?: "default" | "success" | "warning" | "danger" | "info" }) {
  const tones = {
    default: "bg-secondary text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-destructive",
    info: "bg-info-soft text-info",
  };
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={cn("grid size-8 place-items-center rounded-lg", tones[tone])}><Icon className="size-4" /></span>
      </div>
      <div className="mt-3 font-display text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  running: "bg-success-soft text-success",
  connected: "bg-success-soft text-success",
  ready: "bg-success-soft text-success",
  booked: "bg-info-soft text-info",
  confirmed: "bg-info-soft text-info",
  info: "bg-info-soft text-info",
  paused: "bg-warning-soft text-warning",
  incomplete: "bg-warning-soft text-warning",
  warning: "bg-warning-soft text-warning",
  detected: "bg-accent text-accent-foreground",
  error: "bg-danger-soft text-destructive",
  stopped: "bg-muted text-muted-foreground",
  "not connected": "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase();
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide", statusStyles[key] ?? "bg-muted text-muted-foreground", className)}>
      <span className={cn("size-1.5 rounded-full bg-current", key === "running" && "pulse-dot")} />
      {status}
    </span>
  );
}

export function ConfirmAction({ trigger, title, description, confirmLabel = "Confirm", onConfirm, destructive }: { trigger: ReactNode; title: string; description: string; confirmLabel?: string; onConfirm: () => void; destructive?: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-input bg-muted/60 px-3 py-2 font-mono text-[0.72rem] text-muted-foreground">
      {children}
    </div>
  );
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]!);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
