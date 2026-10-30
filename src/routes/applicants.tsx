import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, StatusBadge, ConfirmAction, downloadCsv } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initialApplicants, type Applicant } from "@/lib/demo-data";

export const Route = createFileRoute("/applicants")({
  head: () => seo("Applicants", "Add, edit and organise visa applicants into family and company groups."),
  component: ApplicantsPage,
});

const blank: Applicant = { id: "", firstName: "", lastName: "", email: "", phone: "", passport: "", nationality: "Nigerian", dob: "", group: "Individual", status: "incomplete" };
const mask = (p: string) => (p.length > 4 && !p.includes("•") ? `${p.slice(0, 2)}•••••${p.slice(-2)}` : p);

function ApplicantsPage() {
  const [list, setList] = useState(initialApplicants);
  const [group, setGroup] = useState("All");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Applicant | null>(null);
  const groups = useMemo(() => ["All", ...new Set(list.map((a) => a.group))], [list]);
  const shown = list.filter((a) => (group === "All" || a.group === group) && `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!editing) return;
    if (!editing.firstName || !editing.lastName) { toast.error("First and last name are required"); return; }
    const rec = { ...editing, passport: mask(editing.passport), status: editing.passport && editing.dob ? editing.status === "booked" ? "booked" : "ready" : "incomplete" } as Applicant;
    setList((l) => (rec.id ? l.map((a) => (a.id === rec.id ? rec : a)) : [...l, { ...rec, id: `ap-${Date.now()}` }]));
    toast.success(rec.id ? "Applicant updated" : "Applicant added");
    setEditing(null);
  };

  return (
    <>
      <PageHeader title="Applicants" description="Manage applicants and family groups. Passport numbers are masked after entry."
        actions={<><Button variant="outline" onClick={() => downloadCsv("applicants.csv", list as unknown as Record<string, unknown>[])}><Download className="size-4" /> Export</Button><Button onClick={() => setEditing(blank)}><Plus className="size-4" /> Add applicant</Button></>} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {groups.map((g) => (
          <button key={g} onClick={() => setGroup(g)} className={`rounded-full border px-3 py-1 text-xs font-medium ${group === g ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {g} {g !== "All" && <span className="opacity-60">· {list.filter((a) => a.group === g).length}</span>}
          </button>
        ))}
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="ml-auto h-8 w-full bg-card sm:w-56" />
      </div>
      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Contact</TableHead><TableHead>Passport</TableHead><TableHead>Group</TableHead><TableHead>Status</TableHead><TableHead className="pr-5 text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {shown.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="pl-5"><div className="font-medium">{a.firstName} {a.lastName}</div><div className="text-xs text-muted-foreground">{a.nationality} · {a.dob}</div></TableCell>
                  <TableCell><div className="text-sm">{a.email}</div><div className="text-xs text-muted-foreground">{a.phone}</div></TableCell>
                  <TableCell><span className="inline-flex items-center gap-1 font-mono text-xs"><ShieldCheck className="size-3 text-success" />{a.passport || "—"}</span></TableCell>
                  <TableCell className="text-sm">{a.group}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button size="icon" variant="ghost" className="size-8" aria-label="Edit" onClick={() => setEditing(a)}><Pencil className="size-3.5" /></Button>
                    <ConfirmAction destructive title="Remove applicant?" description={`${a.firstName} ${a.lastName} will be removed from all groups and configurations.`} confirmLabel="Remove"
                      onConfirm={() => { setList((l) => l.filter((x) => x.id !== a.id)); toast.success("Applicant removed"); }}
                      trigger={<Button size="icon" variant="ghost" className="size-8 text-destructive" aria-label="Delete"><Trash2 className="size-3.5" /></Button>} />
                  </TableCell>
                </TableRow>
              ))}
              {!shown.length && <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">No applicants match.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit applicant" : "Add applicant"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              {([["firstName", "First name"], ["lastName", "Last name"], ["email", "Email"], ["phone", "Phone"], ["nationality", "Nationality"], ["dob", "Date of birth"], ["passport", "Passport number"], ["group", "Family / group"]] as const).map(([k, l]) => (
                <div key={k} className="grid gap-1.5"><Label className="text-xs">{l}</Label>
                  <Input type={k === "dob" ? "date" : k === "passport" ? "password" : "text"} value={editing[k]} placeholder={k === "passport" ? "Stored masked" : ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} />
                </div>
              ))}
              <p className="col-span-2 text-xs text-muted-foreground">Sensitive fields are placeholders in this demo — encrypted storage will be added with the backend.</p>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save applicant</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
