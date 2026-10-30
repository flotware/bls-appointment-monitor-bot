import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({
  head: () => seo("Sign in", "Sign in to your BLS Appointment Manager workspace."),
  component: LoginPage,
});

// Auth UI placeholder — no real authentication is wired up yet.
function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { toast.info("Demo sign-in", { description: "Authentication isn't connected yet." }); nav({ to: "/" }); }, 500);
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-lg bg-sidebar-primary font-display text-sm font-bold text-sidebar-primary-foreground">BL</div><span className="font-display font-semibold">BLS Appointment Manager</span></div>
        <div>
          <h1 className="max-w-md font-display text-4xl font-semibold leading-tight">Never miss a visa appointment window again.</h1>
          <p className="mt-4 max-w-md text-sm text-sidebar-muted">Configure searches, organise applicant families and monitor BLS centres from one workspace built for consultants and agencies.</p>
        </div>
        <div className="text-xs text-sidebar-muted">© 2026 BLS Appointment Manager · Independent tool, not affiliated with BLS International.</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Tabs defaultValue="in">
            <TabsList className="mb-6 w-full"><TabsTrigger value="in" className="flex-1">Sign in</TabsTrigger><TabsTrigger value="up" className="flex-1">Create account</TabsTrigger></TabsList>
            <TabsContent value="in"><form onSubmit={submit} className="grid gap-4">
              <div className="grid gap-1.5"><Label className="text-xs">Email</Label><Input type="email" required placeholder="you@agency.com" /></div>
              <div className="grid gap-1.5"><Label className="text-xs">Password</Label><Input type="password" required /></div>
              <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
              <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => toast.info("Password reset isn't connected yet")}>Forgot password?</button>
            </form></TabsContent>
            <TabsContent value="up"><form onSubmit={submit} className="grid gap-4">
              <div className="grid gap-1.5"><Label className="text-xs">Full name</Label><Input required /></div>
              <div className="grid gap-1.5"><Label className="text-xs">Agency name</Label><Input /></div>
              <div className="grid gap-1.5"><Label className="text-xs">Email</Label><Input type="email" required /></div>
              <div className="grid gap-1.5"><Label className="text-xs">Password</Label><Input type="password" required minLength={8} /></div>
              <Button type="submit" disabled={loading}>Create account</Button>
            </form></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
