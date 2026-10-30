import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Play, Pause, Square, RotateCcw, MapPin, Users, CalendarRange, Clock, AlertCircle, Check, X } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, StatusBadge, ConfirmAction, PlaceholderNote } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { initialTasks, reviewQueue, activityLogs, type MonitorTask, type TaskStatus } from "@/lib/demo-data";

export const Route = createFileRoute("/monitoring")({
  head: () => seo("Appointment Monitoring", "Start, pause, resume and stop BLS appointment monitoring tasks and review detected slots."),
  component: MonitoringPage,
});

function MonitoringPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [review, setReview] = useState(reviewQueue);
  const setStatus = (id: string, status: TaskStatus, msg: string) => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, status, lastCheck: "just now", errors: status === "running" ? [] : x.errors } : x)));
    toast.success(msg, { description: "Demo only — the monitoring worker is not connected yet." });
  };

  return (
    <>
      <PageHeader title="Appointment Monitoring" description="Control monitoring tasks. Detected slots require manual review before they count as confirmed." />
      <div className="mb-4"><PlaceholderNote>INTEGRATION_PLACEHOLDER: monitoring-worker — task controls update local state only.</PlaceholderNote></div>
      <div className="grid gap-4 lg:grid-cols-3">
        {tasks.map((t) => <TaskCard key={t.id} t={t} setStatus={setStatus} />)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Manual appointment review" description="Confirm only after verifying the booking on the BLS portal.">
          {review.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Nothing waiting for review.</p>}
          <ul className="space-y-3">
            {review.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                <div><div className="text-sm font-semibold">{r.slot}</div><div className="text-xs text-muted-foreground">{r.applicant} · {r.centre}</div></div>
                <div className="flex gap-2">
                  <ConfirmAction title="Mark as confirmed booking?" description="Only confirm if this appointment has actually been booked on the BLS portal." confirmLabel="Confirm booking"
                    onConfirm={() => { setReview((x) => x.filter((y) => y.id !== r.id)); toast.success("Marked as confirmed booking"); }}
                    trigger={<Button size="sm"><Check className="size-3.5" /> Confirm</Button>} />
                  <Button size="sm" variant="outline" onClick={() => { setReview((x) => x.filter((y) => y.id !== r.id)); toast("Slot dismissed"); }}><X className="size-3.5" /> Dismiss</Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Task history">
          <ol className="relative space-y-4 border-l pl-5">
            {activityLogs.filter((l) => l.category === "monitoring").map((l) => (
              <li key={l.id} className="text-sm">
                <span className={`absolute -left-[5px] mt-1.5 size-2.5 rounded-full border-2 border-card ${l.level === "error" ? "bg-destructive" : l.level === "warning" ? "bg-warning" : "bg-success"}`} />
                <div>{l.message}</div><div className="text-xs text-muted-foreground">{l.time} · {l.actor}</div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}

function TaskCard({ t, setStatus }: { t: MonitorTask; setStatus: (id: string, s: TaskStatus, m: string) => void }) {
  return (
    <div className="panel flex flex-col p-5">
      <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold">{t.label}</h3><StatusBadge status={t.status} /></div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="flex gap-2"><MapPin className="size-3.5 text-muted-foreground" /><div><dt className="text-muted-foreground">{t.country}</dt><dd className="font-medium">{t.location}</dd></div></div>
        <div className="flex gap-2"><Users className="size-3.5 text-muted-foreground" /><div><dt className="text-muted-foreground">Applicants</dt><dd className="font-medium">{t.applicants}</dd></div></div>
        <div className="flex gap-2"><CalendarRange className="size-3.5 text-muted-foreground" /><div><dt className="text-muted-foreground">Window</dt><dd className="font-medium">{t.window}</dd></div></div>
        <div className="flex gap-2"><Clock className="size-3.5 text-muted-foreground" /><div><dt className="text-muted-foreground">Last check</dt><dd className="font-medium">{t.lastCheck}</dd></div></div>
      </dl>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-xs"><span className="text-muted-foreground">Slots detected</span><span className="font-display text-lg font-semibold">{t.slotsDetected}</span></div>
      {t.errors.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-lg bg-danger-soft p-3 text-xs text-destructive">
          {t.errors.map((e) => <li key={e} className="flex gap-1.5"><AlertCircle className="mt-0.5 size-3 shrink-0" />{e}</li>)}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {t.status === "stopped" || t.status === "error" ? (
          <Button size="sm" onClick={() => setStatus(t.id, "running", "Monitoring started")}>{t.status === "error" ? <RotateCcw className="size-3.5" /> : <Play className="size-3.5" />}{t.status === "error" ? "Retry" : "Start"}</Button>
        ) : t.status === "paused" ? (
          <Button size="sm" onClick={() => setStatus(t.id, "running", "Monitoring resumed")}><Play className="size-3.5" /> Resume</Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setStatus(t.id, "paused", "Monitoring paused")}><Pause className="size-3.5" /> Pause</Button>
        )}
        {t.status !== "stopped" && (
          <ConfirmAction destructive title="Stop this monitoring task?" description="The task will stop checking for appointments. You can start it again later." confirmLabel="Stop task"
            onConfirm={() => setStatus(t.id, "stopped", "Monitoring stopped")}
            trigger={<Button size="sm" variant="ghost" className="text-destructive"><Square className="size-3.5" /> Stop</Button>} />
        )}
      </div>
    </div>
  );
}
