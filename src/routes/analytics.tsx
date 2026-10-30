import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, downloadCsv } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activitySeries, errorStats, notificationChannels, initialTasks } from "@/lib/demo-data";

export const Route = createFileRoute("/analytics")({
  head: () => seo("Analytics", "Charts for slot availability, monitoring activity, notification delivery, bookings and errors."),
  component: AnalyticsPage,
});

const axis = { tick: { fontSize: 11, fill: "var(--muted-foreground)" }, tickLine: false, axisLine: false } as const;
const tip = { contentStyle: { borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 } };

function AnalyticsPage() {
  const [range, setRange] = useState("14");
  const data = activitySeries.slice(-Number(range));
  const bookings = data.map((d) => ({ day: d.day, successful: d.confirmed, unsuccessful: d.failed }));
  return (
    <>
      <PageHeader title="Analytics" description="Detected slots are availability seen on the portal. Confirmed bookings are manually verified."
        actions={<>
          <Tabs value={range} onValueChange={setRange}><TabsList><TabsTrigger value="7">7d</TabsTrigger><TabsTrigger value="14">14d</TabsTrigger></TabsList></Tabs>
          <Button variant="outline" onClick={() => downloadCsv("bls-report.csv", data)}><Download className="size-4" /> Export report</Button>
        </>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Availability detected vs. confirmed">
          <div className="h-64"><ResponsiveContainer><BarChart data={data} margin={{ left: -20 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="day" {...axis} /><YAxis {...axis} /><Tooltip {...tip} /><Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="detected" name="Slots detected" fill="var(--chart-1)" radius={[4, 4, 0, 0]} /><Bar dataKey="confirmed" name="Confirmed bookings" fill="var(--chart-2)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Monitoring activity" description="Portal checks per day">
          <div className="h-64"><ResponsiveContainer><LineChart data={data} margin={{ left: -10 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="day" {...axis} /><YAxis {...axis} /><Tooltip {...tip} />
            <Line dataKey="checks" name="Checks" stroke="var(--chart-2)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Booking attempts" description="Successful vs. unsuccessful">
          <div className="h-64"><ResponsiveContainer><BarChart data={bookings} margin={{ left: -20 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="day" {...axis} /><YAxis {...axis} /><Tooltip {...tip} /><Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="successful" stackId="a" fill="var(--success)" name="Successful" /><Bar dataKey="unsuccessful" stackId="a" fill="var(--chart-4)" name="Unsuccessful" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Error statistics">
          <div className="h-64"><ResponsiveContainer><BarChart data={errorStats} layout="vertical" margin={{ left: 30 }}><CartesianGrid stroke="var(--border)" horizontal={false} /><XAxis type="number" {...axis} /><YAxis type="category" dataKey="type" width={110} {...axis} /><Tooltip {...tip} />
            <Bar dataKey="count" fill="var(--chart-3)" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Notification delivery" description="No channels connected — nothing delivered yet">
          <ul className="divide-y text-sm">{notificationChannels.map((c) => <li key={c.channel} className="flex justify-between py-2.5"><span>{c.channel}</span><span className="tabular-nums text-muted-foreground">{c.sent} sent · {c.failed} failed</span></li>)}</ul>
        </Panel>
        <Panel title="Task performance">
          <ul className="space-y-3 text-sm">{initialTasks.map((t, i) => { const rate = [96, 88, 41][i]; return (
            <li key={t.id}><div className="mb-1 flex justify-between"><span className="truncate">{t.label}</span><span className="tabular-nums text-muted-foreground">{rate}% uptime</span></div>
              <div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${rate > 80 ? "bg-success" : "bg-destructive"}`} style={{ width: `${rate}%` }} /></div></li>); })}</ul>
        </Panel>
      </div>
    </>
  );
}
