import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge, PlaceholderNote } from "./ui-bits";

export interface IntegrationField { key: string; label: string; placeholder: string; secret?: boolean }

// Integration placeholder: nothing here talks to a real service yet.
// Status stays "Not connected" until a real backend connection is implemented.
export function IntegrationCard({ name, description, icon: Icon, fields, testLabel = "Send test", steps, placeholderId }: {
  name: string; description: string; icon: LucideIcon; fields: IntegrationField[]; testLabel?: string; steps?: string[]; placeholderId: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const filled = fields.every((f) => values[f.key]?.trim());

  return (
    <div className="panel flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-5" /></span>
          <div>
            <h3 className="text-sm font-semibold">{name}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <StatusBadge status="Not connected" />
      </div>
      <div className="mt-4 grid gap-3">
        {fields.map((f) => (
          <div key={f.key} className="grid gap-1.5">
            <Label className="text-xs">{f.label}</Label>
            <Input type={f.secret ? "password" : "text"} placeholder={f.placeholder} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
          </div>
        ))}
      </div>
      {steps && (
        <ol className="mt-4 list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
          {steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
      )}
      <div className="mt-4"><PlaceholderNote>INTEGRATION_PLACEHOLDER: {placeholderId}</PlaceholderNote></div>
      <div className="mt-4 flex gap-2 pt-1">
        <Button size="sm" variant="outline" disabled={!filled} onClick={() => toast.info(`${name} credentials saved locally`, { description: "Connection will activate once the backend integration is implemented." })}>Save</Button>
        <Button size="sm" onClick={() => toast.error(`${name}: ${testLabel.toLowerCase()} failed`, { description: "Not connected — this integration hasn't been implemented yet." })}>{testLabel}</Button>
      </div>
    </div>
  );
}
