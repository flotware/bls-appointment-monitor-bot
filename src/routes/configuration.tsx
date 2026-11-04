import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, Plane, MapPin } from "lucide-react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel, ConfirmAction } from "@/components/app/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIRPORTS, APPOINTMENT_TYPES, COUNTRIES, VISA_CATEGORIES, initialConfigs, type AppointmentConfig } from "@/lib/demo-data";

export const Route = createFileRoute("/configuration")({
  head: () => seo("Appointment Configuration", "Create and manage BLS appointment search configurations: centre, visa type, dates and travel details."),
  component: ConfigurationPage,
});

const empty: AppointmentConfig = { id: "", name: "", country: "", city: "", centre: "", zip: "", address: "", visaCategory: "", appointmentType: "", applicants: 1, slots: 1, dateFrom: "", dateTo: "", timeFrom: "08:00", timeTo: "16:00", flightDate: "", flightTime: "", departureAirport: "", destinationAirport: "", notes: "" };

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`grid gap-1.5 ${className ?? ""}`}><Label className="text-xs">{label}</Label>{children}</div>;
}

function Pick({ value, onChange, options, placeholder, disabled }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string; disabled?: boolean }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled ?? false}>
      <SelectTrigger className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function ConfigurationPage() {
  const [configs, setConfigs] = useState(initialConfigs);
  const [form, setForm] = useState<AppointmentConfig>(empty);
  const set = <K extends keyof AppointmentConfig>(k: K, v: AppointmentConfig[K]) => setForm((f) => ({ ...f, [k]: v }));
  const cities = form.country ? Object.keys(COUNTRIES[form.country] ?? {}) : [];
  const centres = form.country && form.city ? (COUNTRIES[form.country]?.[form.city] ?? []) : [];

  const save = () => {
    if (!form.name || !form.country || !form.city || !form.centre || !form.visaCategory) {
      toast.error("Please complete name, location, centre and visa category"); return;
    }
    if (form.id) { setConfigs((c) => c.map((x) => (x.id === form.id ? form : x))); toast.success("Configuration updated"); }
    else { setConfigs((c) => [{ ...form, id: `cfg-${Date.now()}` }, ...c]); toast.success("Configuration saved"); }
    setForm(empty);
  };

  return (
    <>
      <PageHeader title="Appointment Configuration" description="Define where, when and for whom to look for BLS appointments."
        actions={<Button variant="outline" onClick={() => setForm(empty)}><Plus className="size-4" /> New configuration</Button>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel title={form.id ? "Edit configuration" : "New configuration"} description="All fields are stored locally in this demo.">
          <div className="space-y-6">
            <Field label="Configuration name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Adeyemi family – Spain tourism" /></Field>
            <fieldset className="grid gap-4 sm:grid-cols-3">
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</legend>
              <Field label="Country"><Pick value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v, city: "", centre: "" }))} options={Object.keys(COUNTRIES)} placeholder="Select country" /></Field>
              <Field label="City"><Pick value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v, centre: "" }))} options={cities} placeholder="Select city" disabled={!form.country} /></Field>
              <Field label="BLS application centre"><Pick value={form.centre} onChange={(v) => set("centre", v)} options={centres} placeholder="Select centre" disabled={!form.city} /></Field>
              <Field label="ZIP / postal code"><Input value={form.zip} onChange={(e) => set("zip", e.target.value)} /></Field>
              <Field label="Address" className="sm:col-span-2"><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
            </fieldset>
            <fieldset className="grid gap-4 sm:grid-cols-4">
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appointment</legend>
              <Field label="Visa category" className="sm:col-span-2"><Pick value={form.visaCategory} onChange={(v) => set("visaCategory", v)} options={VISA_CATEGORIES} placeholder="Select category" /></Field>
              <Field label="Appointment type" className="sm:col-span-2"><Pick value={form.appointmentType} onChange={(v) => set("appointmentType", v)} options={APPOINTMENT_TYPES} placeholder="Select type" /></Field>
              <Field label="Applicants"><Input type="number" min={1} value={form.applicants} onChange={(e) => set("applicants", +e.target.value)} /></Field>
              <Field label="Slots requested"><Input type="number" min={1} value={form.slots} onChange={(e) => set("slots", +e.target.value)} /></Field>
              <Field label="Preferred from"><Input type="date" value={form.dateFrom} onChange={(e) => set("dateFrom", e.target.value)} /></Field>
              <Field label="Preferred to"><Input type="date" value={form.dateTo} onChange={(e) => set("dateTo", e.target.value)} /></Field>
              <Field label="Earliest time"><Input type="time" value={form.timeFrom} onChange={(e) => set("timeFrom", e.target.value)} /></Field>
              <Field label="Latest time"><Input type="time" value={form.timeTo} onChange={(e) => set("timeTo", e.target.value)} /></Field>
            </fieldset>
            <fieldset className="grid gap-4 sm:grid-cols-4">
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Travel</legend>
              <Field label="Flight date"><Input type="date" value={form.flightDate} onChange={(e) => set("flightDate", e.target.value)} /></Field>
              <Field label="Flight time"><Input type="time" value={form.flightTime} onChange={(e) => set("flightTime", e.target.value)} /></Field>
              <Field label="Departure airport"><Pick value={form.departureAirport} onChange={(v) => set("departureAirport", v)} options={AIRPORTS} placeholder="From" /></Field>
              <Field label="Destination airport"><Pick value={form.destinationAirport} onChange={(v) => set("destinationAirport", v)} options={AIRPORTS} placeholder="To" /></Field>
              <Field label="Additional travel information" className="sm:col-span-4"><Textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
            </fieldset>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button variant="ghost" onClick={() => setForm(empty)}>Reset</Button>
              <Button onClick={save}>{form.id ? "Update configuration" : "Save configuration"}</Button>
            </div>
          </div>
        </Panel>
        <Panel title="Saved configurations" description={`${configs.length} configurations`}>
          <ul className="space-y-3">
            {configs.map((c) => (
              <li key={c.id} className={`rounded-lg border p-3 ${form.id === c.id ? "border-ring bg-accent/40" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{c.name}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{c.centre}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Plane className="size-3" />{c.departureAirport.split(" ")[0]} → {c.destinationAirport.split(" ")[0]} · {c.flightDate}</div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" className="size-8" aria-label="Edit" onClick={() => setForm(c)}><Pencil className="size-3.5" /></Button>
                    <ConfirmAction destructive title="Delete configuration?" description={`“${c.name}” will be removed. Monitoring tasks using it will stop.`} confirmLabel="Delete"
                      onConfirm={() => { setConfigs((x) => x.filter((y) => y.id !== c.id)); toast.success("Configuration deleted"); }}
                      trigger={<Button size="icon" variant="ghost" className="size-8 text-destructive" aria-label="Delete"><Trash2 className="size-3.5" /></Button>} />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[0.7rem]">
                  <span className="rounded bg-muted px-1.5 py-0.5">{c.visaCategory}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5">{c.applicants} applicants</span>
                  <span className="rounded bg-muted px-1.5 py-0.5">{c.dateFrom} → {c.dateTo}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
