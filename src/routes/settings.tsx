import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Crown } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, StatusBadge, ConfirmAction } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => seo("General Settings", "Account, security, team permissions and workspace preferences."),
  component: SettingsPage,
});

const ROLES = ["Owner", "Administrator", "Manager", "Team Member", "Viewer"] as const;
type Role = (typeof ROLES)[number];
const PERMISSIONS = ["Manage configurations", "Manage applicants", "Control monitoring", "Confirm bookings", "Edit integrations"] as const;
const ROLE_DEFAULTS: Record<Role, string[]> = {
  Owner: [...PERMISSIONS],
  Administrator: [...PERMISSIONS],
  Manager: ["Manage configurations", "Manage applicants", "Control monitoring", "Confirm bookings"],
  "Team Member": ["Manage configurations", "Manage applicants", "Control monitoring"],
  Viewer: [],
};

interface Member { id: string; name: string; email: string; role: Role; status: "Active" | "Invited" | "Suspended"; perms: string[] }

const initialTeam: Member[] = [
  { id: "m1", name: "Miguel Obi", email: "miguel@horizontravels.ng", role: "Owner", status: "Active", perms: [...PERMISSIONS] },
  { id: "m2", name: "Segun Lawal", email: "segun@horizontravels.ng", role: "Team Member", status: "Active", perms: ROLE_DEFAULTS["Team Member"] },
  { id: "m3", name: "Ngozi Eze", email: "ngozi@horizontravels.ng", role: "Viewer", status: "Invited", perms: [] },
];

const blankMember: Member = { id: "", name: "", email: "", role: "Team Member", status: "Invited", perms: ROLE_DEFAULTS["Team Member"] };

function MemberDialog({ member, onClose, onSave }: { member: Member | null; onClose: () => void; onSave: (m: Member) => void }) {
  const [draft, setDraft] = useState<Member | null>(null);
  const m = draft ?? member;
  if (!member || !m) return null;
  const isOwner = m.role === "Owner";
  const set = (patch: Partial<Member>) => setDraft({ ...m, ...patch });
  return (
    <Dialog open onOpenChange={(o) => { if (!o) { setDraft(null); onClose(); } }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{m.id ? "Edit team member" : "Add team member"}</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5"><Label className="text-xs">Full name</Label><Input value={m.name} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label className="text-xs">Email address</Label><Input type="email" value={m.email} onChange={(e) => set({ email: e.target.value })} /></div>
          <div className="grid gap-1.5"><Label className="text-xs">Role</Label>
            <Select value={m.role} disabled={isOwner} onValueChange={(v) => { const role = v as Role; set({ role, perms: ROLE_DEFAULTS[role] }); }}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            {isOwner && <p className="text-xs text-muted-foreground">The Owner role can't be changed.</p>}
          </div>
          <div className="grid gap-2">
            <Label className="text-xs">Permissions</Label>
            {PERMISSIONS.map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <Checkbox checked={m.perms.includes(p)} disabled={isOwner}
                  onCheckedChange={(c) => set({ perms: c ? [...m.perms, p] : m.perms.filter((x) => x !== p) })} />
                {p}
              </label>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => { setDraft(null); onClose(); }}>Cancel</Button>
          <Button onClick={() => {
            if (!m.name.trim() || !m.email.trim()) { toast.error("Name and email are required"); return; }
            onSave(m); setDraft(null);
          }}>{m.id ? "Save changes" : "Add member"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SettingsPage() {
  const [team, setTeam] = useState(initialTeam);
  const [editing, setEditing] = useState<Member | null>(null);

  const saveMember = (m: Member) => {
    setTeam((t) => (m.id ? t.map((x) => (x.id === m.id ? m : x)) : [...t, { ...m, id: `m-${Date.now()}` }]));
    toast.success(m.id ? "Team member updated" : "Team member invited");
    setEditing(null);
  };

  return (
    <>
      <PageHeader title="General Settings" />
      <Tabs defaultValue="account">
        <TabsList className="mb-4"><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="team">Team & permissions</TabsTrigger><TabsTrigger value="workspace">Workspace</TabsTrigger></TabsList>
        <TabsContent value="account"><Panel title="Profile" className="max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5"><Label className="text-xs">Full name</Label><Input defaultValue="Miguel Obi" /></div>
            <div className="grid gap-1.5"><Label className="text-xs">Email</Label><Input defaultValue="miguel@horizontravels.ng" /></div>
            <div className="grid gap-1.5"><Label className="text-xs">Agency</Label><Input defaultValue="Horizon Travels Ltd" /></div>
            <div className="grid gap-1.5"><Label className="text-xs">Phone</Label><Input defaultValue="+971 50 555 0100" /></div>
          </div>
          <Button className="mt-4" onClick={() => toast.success("Profile saved")}>Save changes</Button>
        </Panel></TabsContent>
        <TabsContent value="security"><Panel title="Security" className="max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5"><Label className="text-xs">Current password</Label><Input type="password" /></div>
            <div className="grid gap-1.5"><Label className="text-xs">New password</Label><Input type="password" /></div>
          </div>
          <div className="mt-4 space-y-3">
            {["Two-factor authentication", "Email me on new sign-in", "Auto sign-out after 30 min idle"].map((s, i) => (
              <div key={s} className="flex items-center justify-between rounded-lg border p-3 text-sm">{s}<Switch defaultChecked={i !== 0} /></div>
            ))}
          </div>
          <div className="mt-4 flex gap-2"><Button onClick={() => toast.success("Security settings updated")}>Update</Button>
            <ConfirmAction destructive title="Sign out all devices?" description="All active sessions, including this one, will be ended." confirmLabel="Sign out all" onConfirm={() => toast.success("All sessions ended")} trigger={<Button variant="outline">Sign out all devices</Button>} /></div>
        </Panel></TabsContent>
        <TabsContent value="team">
          <Panel title="Team members" description="Manage who can access this workspace and what they can do."
            actions={<Button size="sm" onClick={() => setEditing(blankMember)}><Plus className="size-4" /> Add team member</Button>}>
            <ul className="divide-y">
              {team.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">{m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-sm font-medium">{m.name}{m.role === "Owner" && <Crown className="size-3.5 text-warning" />}</div>
                      <div className="truncate text-xs text-muted-foreground">{m.email}</div>
                      <div className="mt-1 flex flex-wrap gap-1">{m.perms.length ? m.perms.map((p) => <span key={p} className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem]">{p}</span>) : <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem]">View only</span>}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={m.status} />
                    <span className="w-28">
                      <Select value={m.role} disabled={m.role === "Owner"} onValueChange={(v) => { const role = v as Role; setTeam((t) => t.map((x) => (x.id === m.id ? { ...x, role, perms: ROLE_DEFAULTS[role] } : x))); toast.success(`${m.name} is now ${role}`); }}>
                        <SelectTrigger className="h-8 w-full text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </span>
                    <Button size="icon" variant="ghost" className="size-8" aria-label={`Edit ${m.name}`} onClick={() => setEditing(m)}><Pencil className="size-3.5" /></Button>
                    {m.role !== "Owner" ? (
                      <ConfirmAction destructive title={`Remove ${m.name}?`} description={`${m.email} will lose access to this workspace immediately.`} confirmLabel="Remove member"
                        onConfirm={() => { setTeam((t) => t.filter((x) => x.id !== m.id)); toast.success(`${m.name} removed from the team`); }}
                        trigger={<Button size="icon" variant="ghost" className="size-8 text-destructive" aria-label={`Remove ${m.name}`}><Trash2 className="size-3.5" /></Button>} />
                    ) : (
                      <span className="grid size-8 place-items-center text-xs text-muted-foreground" title="The owner account can't be removed">—</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">The Owner account can't be removed or demoted by other team members.</p>
          </Panel>
          {editing && <MemberDialog member={editing} onClose={() => setEditing(null)} onSave={saveMember} />}
        </TabsContent>
        <TabsContent value="workspace"><Panel title="Workspace preferences" className="max-w-2xl">
          <div className="space-y-3">
            {["Require manual review before confirming bookings", "Pause tasks automatically after 5 consecutive errors", "Include applicant names in notifications"].map((s, i) => (
              <div key={s} className="flex items-center justify-between rounded-lg border p-3 text-sm">{s}<Switch defaultChecked={i < 2} /></div>
            ))}
          </div>
        </Panel></TabsContent>
      </Tabs>
    </>
  );
}
