import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({
  head: () => seo("Sign in", "Sign in or create an account for your BLS Appointment Manager workspace."),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Could not sign in", { description: error.message });
      return;
    }
    toast.success("Signed in successfully");
    void navigate({ to: "/" });
  };

  const signUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, agency_name: agencyName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error("Could not create your account", { description: error.message });
      return;
    }
    if (!data.session) {
      toast.success("Check your email", { description: "Confirm your email address, then return here to sign in." });
      return;
    }
    toast.success("Account created");
    void navigate({ to: "/" });
  };

  const requestPasswordReset = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address first");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) toast.error("Could not send the reset email", { description: error.message });
    else toast.success("Password reset email sent", { description: "Check your inbox for a secure reset link." });
  };

  const signInSocial = async (provider: "google" | "lovable") => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    setLoading(false);
    if (result.error) toast.error("Sign-in could not start", { description: result.error.message });
    else if (!result.redirected) void navigate({ to: "/" });
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
            <TabsContent value="in">
              <form onSubmit={signIn} className="grid gap-4">
                <div className="grid gap-1.5"><Label htmlFor="signin-email" className="text-xs">Email</Label><Input id="signin-email" type="email" required autoComplete="email" placeholder="you@agency.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
                <div className="grid gap-1.5"><Label htmlFor="signin-password" className="text-xs">Password</Label><Input id="signin-password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
                <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
                <Button type="button" variant="ghost" disabled={loading} onClick={() => void requestPasswordReset()}>Forgot password?</Button>
              </form>
            </TabsContent>
            <TabsContent value="up">
              <form onSubmit={signUp} className="grid gap-4">
                <div className="grid gap-1.5"><Label htmlFor="signup-name" className="text-xs">Full name</Label><Input id="signup-name" required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} /></div>
                <div className="grid gap-1.5"><Label htmlFor="signup-agency" className="text-xs">Agency name</Label><Input id="signup-agency" required autoComplete="organization" value={agencyName} onChange={(event) => setAgencyName(event.target.value)} /></div>
                <div className="grid gap-1.5"><Label htmlFor="signup-email" className="text-xs">Email</Label><Input id="signup-email" type="email" required autoComplete="email" placeholder="you@agency.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
                <div className="grid gap-1.5"><Label htmlFor="signup-password" className="text-xs">Password</Label><Input id="signup-password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
                <Button type="submit" disabled={loading}>{loading ? "Creating account…" : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />Or continue with<span className="h-px flex-1 bg-border" /></div>
          <div className="grid gap-2">
            <Button type="button" variant="outline" className="w-full border-input bg-card text-foreground" disabled={loading} onClick={() => void signInSocial("google")}>
              <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
              Continue with Google
            </Button>
            <Button type="button" variant="secondary" className="w-full" disabled={loading} onClick={() => void signInSocial("lovable")}>Continue with Lovable</Button>
          </div>
        </div>
      </div>
    </div>
  );
}