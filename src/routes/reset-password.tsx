import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => seo("Reset password", "Set a new password for your BLS Appointment Manager account."),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (window.location.hash && !window.location.hash.includes("type=recovery")) {
      toast.error("This password reset link is not valid. Request a new one.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Could not update your password", { description: error.message });
      return;
    }
    toast.success("Password updated");
    await supabase.auth.signOut();
    void navigate({ to: "/login", replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <section className="w-full max-w-sm space-y-5">
        <div><h1 className="font-display text-2xl font-semibold">Set a new password</h1><p className="mt-1 text-sm text-muted-foreground">Choose a secure password for your account.</p></div>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" minLength={8} required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
          <Button type="submit" disabled={loading}>{loading ? "Updating…" : "Update password"}</Button>
        </form>
      </section>
    </main>
  );
}