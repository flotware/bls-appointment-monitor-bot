import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Radar, CalendarCheck2, BellRing, BadgeCheck, TriangleAlert, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { activitySeries, activityLogs, initialApplicants, initialTasks, reviewQueue } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => seo("Overview", "At-a-glance view of applicants, monitoring tasks, detected slots and confirmed BLS appointments."),
  component: Overview,
});

const health = [
  { name: "BLS portal / API", status: "Not connected" },
  { name: "Proxy pool", status: "Not connected" },
  { name: "Cloud worker", status: "Not connected" },
  { name: "Notification channels", status: "Not connected" },
];

function Overview() {
  const detected = activitySeries.reduce((a, d) => a + d.detected, 0);
  const confirmed = activitySeries.reduce((a, d) => a + d.confirmed, 0);
  return (
    <>
      <PageHeader title="Good evening, Amaka" description="Here's what's happening across your BLS monitoring workspace."
        actions={<><Button variant="outline" asChild><Link to="/analytics">View analytics</Link></Button><Button asChild><Link to="/configuration">New configuration</Link></Button></>} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total applicants" value={initialApplicants.length} icon={Users} hint="3 family groups" />
        <StatCard label="Active monitoring" value={initialTasks.filter((t) => t.status === "running").length} icon={Radar} tone="success" hint={`${initialTasks.length} tasks total`} />
        <StatCard label="Slots detected" value={detected} icon={CalendarCheck2} tone="info" hint="Last 14 days" />
        <StatCard label="Notifications delivered" value={0} icon={BellRing} hint="No channel connected" />
        <StatCard label="Confirmed appointments" value={confirmed} icon={BadgeCheck} tone="success" hint="Manually reviewed" />
        <StatCard label="Failed tasks" value={initialTasks.filter((t) => t.status === "error").length} icon={TriangleAlert} tone="danger" hint="Needs attention" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Monitoring activity" description="Slots detected vs. confirmed bookings — detection does not mean booked." className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={activitySeries} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="detected" name="Slots detected" stroke="var(--chart-1)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="confirmed" name="Confirmed bookings" stroke="var(--chart-2)" fill="transparent" strokeWidth={2} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="System health" description="Live connection status of required services">
          <ul className="divide-y">
            {health.map((h) => (
              <li key={h.name} className="flex items-center justify-between py-3 text-sm"><span>{h.name}</span><StatusBadge status={h.status} /></li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-3 w-full" asChild><Link to="/developer">Configure connections</Link></Button>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Monitoring tasks" actions={<Link to="/monitoring" className="text-xs font-semibold text-accent-foreground">Open <ArrowUpRight className="inline size-3" /></Link>}>
          <ul className="space-y-3">
            {initialTasks.map((t) => (
              <li key={t.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{t.label}</span><StatusBadge status={t.status} /></div>
                <div className="mt-1 text-xs text-muted-foreground">{t.location} · checked {t.lastCheck} · {t.slotsDetected} slots</div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Recent activity">
          <ul className="space-y-3">
            {activityLogs.slice(0, 6).map((l) => (
              <li key={l.id} className="flex gap-3 text-sm">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${l.level === "error" ? "bg-destructive" : l.level === "warning" ? "bg-warning" : "bg-success"}`} />
                <div><div className="leading-snug">{l.message}</div><div className="text-xs text-muted-foreground">{l.time.slice(11)} · {l.actor}</div></div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Awaiting manual review" description="Detected slots that need a human to confirm">
          <ul className="space-y-3">
            {reviewQueue.map((r) => (
              <li key={r.id} className="rounded-lg border p-3 text-sm">
                <div className="flex justify-between"><span className="font-medium">{r.slot}</span><StatusBadge status="detected" /></div>
                <div className="mt-1 text-xs text-muted-foreground">{r.applicant} · {r.centre} · {r.detected}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">Recent notifications: none delivered — connect Telegram, Discord, Email or WhatsApp to receive alerts.</div>
        </Panel>
      </div>
    </>
  );
}
