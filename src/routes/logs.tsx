import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Bug } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, StatusBadge, downloadCsv } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { activityLogs } from "@/lib/demo-data";

export const Route = createFileRoute("/logs")({
  head: () => seo("Activity Logs", "Audit trail of monitoring, configuration, applicant and account activity."),
  component: LogsPage,
});

function LogsPage() {
  const [cat, setCat] = useState("all");
  const [level, setLevel] = useState("all");
  const rows = activityLogs.filter((l) => (cat === "all" || l.category === cat) && (level === "all" || l.level === level));
  return (
    <>
      <PageHeader title="Activity Logs" description="Every action by your team and the system."
        actions={<><Button variant="outline" onClick={() => toast.success("Error report submitted", { description: "Demo only — reports will be sent once support is connected." })}><Bug className="size-4" /> Report an error</Button>
          <Button variant="outline" onClick={() => downloadCsv("activity-logs.csv", rows as unknown as Record<string, unknown>[])}><Download className="size-4" /> Export</Button></>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <Select value={cat} onValueChange={setCat}><SelectTrigger className="w-44 bg-card"><SelectValue /></SelectTrigger><SelectContent>{["all", "monitoring", "config", "applicant", "auth", "system"].map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All categories" : c}</SelectItem>)}</SelectContent></Select>
        <Select value={level} onValueChange={setLevel}><SelectTrigger className="w-36 bg-card"><SelectValue /></SelectTrigger><SelectContent>{["all", "info", "warning", "error"].map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All levels" : c}</SelectItem>)}</SelectContent></Select>
      </div>
      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto"><Table>
          <TableHeader><TableRow><TableHead className="pl-5">Time</TableHead><TableHead>Level</TableHead><TableHead>Category</TableHead><TableHead>Actor</TableHead><TableHead className="pr-5">Event</TableHead></TableRow></TableHeader>
          <TableBody>{rows.map((l) => (
            <TableRow key={l.id}><TableCell className="whitespace-nowrap pl-5 font-mono text-xs">{l.time}</TableCell><TableCell><StatusBadge status={l.level} /></TableCell><TableCell className="text-xs capitalize">{l.category}</TableCell><TableCell className="whitespace-nowrap text-sm">{l.actor}</TableCell><TableCell className="pr-5 text-sm">{l.message}</TableCell></TableRow>
          ))}</TableBody>
        </Table></div>
      </Panel>
    </>
  );
}
