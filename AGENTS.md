<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Use Lovable Cloud Auth and the generated Supabase client for account and organization-scoped data; keep database access protected by RLS because browser clients are user-controlled.
- Store roles separately from profiles and enforce organization membership and role permissions in database policies or authenticated server functions, not client-side state.
- The app targets Lovable's existing edge-hosted deployment; do not add VPS-specific infrastructure unless the user confirms a VPS hosting target.
- Do not present BLS, proxy, worker, or notification services as connected without provider documentation, authorized credentials, and a successful real connection check.
