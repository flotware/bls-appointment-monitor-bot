import { supabase } from "@/integrations/supabase/client";

export async function getCurrentWorkspaceId(): Promise<string> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new Error("Sign in to access your workspace.");
  }

  const { data, error } = await supabase
    .from("organization_memberships")
    .select("organization_id")
    .eq("user_id", authData.user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error("Unable to load your workspace.");
  if (!data?.organization_id) throw new Error("Your account does not have a workspace yet.");
  return data.organization_id;
}

export async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Sign in to continue.");
  return data.user.id;
}