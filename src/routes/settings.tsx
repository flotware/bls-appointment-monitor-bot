import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, ConfirmAction } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => seo("General Settings", "Account, security, team permissions and workspace preferences."),
  component: SettingsPage,
});

const team = [
  { name: "Amaka Obi", email: "amaka@horizontravels.ng", role: "Admin" },
  { name: "Segun Lawal", email: "segun@horizontravels.ng", role: "Agent" },
  { name: "Ngozi Eze", email: "ngozi@horizontravels.ng", role: "Viewer" },
];
const perms = ["Manage configurations", "Manage applicants", "Control monitoring", "Confirm bookings", "Edit integrations"];
const matrix: Record<string, boolean[]> = { Admin: [true, true, true, true, true], Agent: [true, true, true, true, false], Viewer: [false, false, false, false, false] };

function SettingsPage() {
  const [roles, setRoles] = useState(team);
  return (
    <>
      <PageHeader title="General Settings" />
      <Tabs defaultValue="account">
        <TabsList className="mb-4"><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="team">Team & permissions</TabsTrigger><TabsTrigger value="workspace">Workspace</TabsTrigger></TabsList>
        <TabsContent value="account"><Panel title="Profile" className="max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5"><Label className="text-xs">Full name</Label><Input defaultValue="Amaka Obi" /></div>
            <div className="grid gap-1.5"><Label className="text-xs">Email</Label><Input defaultValue="amaka@horizontravels.ng" /></div>
            <div className="grid gap-1.5"><Label className="text-xs">Agency</Label><Input defaultValue="Horizon Travels Ltd" /></div>
            <div className="grid gap-1.5"><Label className="text-xs">Phone</Label><Input defaultValue="+234 802 555 0100" /></div>
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
        <TabsContent value="team"><div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Team members">
            <ul className="divide-y">{roles.map((m, i) => (
              <li key={m.email} className="flex items-center justify-between gap-3 py-3">
                <div><div className="text-sm font-medium">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}</div></div>
                <Select value={m.role} onValueChange={(v) => { setRoles((r) => r.map((x, j) => (j === i ? { ...x, role: v } : x))); toast.success(`${m.name} is now ${v}`); }}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger><SelectContent>{Object.keys(matrix).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </li>))}</ul>
          </Panel>
          <Panel title="Role permissions">
            <table className="w-full text-sm"><thead><tr className="text-xs text-muted-foreground"><th className="py-2 text-left font-medium">Permission</th>{Object.keys(matrix).map((r) => <th key={r} className="font-medium">{r}</th>)}</tr></thead>
              <tbody>{perms.map((p, i) => <tr key={p} className="border-t"><td className="py-2.5">{p}</td>{Object.values(matrix).map((v, j) => <td key={j} className="text-center">{v[i] ? "✓" : "—"}</td>)}</tr>)}</tbody></table>
          </Panel>
        </div></TabsContent>
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
