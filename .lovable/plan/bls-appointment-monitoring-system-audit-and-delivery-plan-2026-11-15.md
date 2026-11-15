# BLS Appointment Monitoring System — Audit and Delivery Plan

## Audit findings
- The existing app is a frontend-only prototype. Applicant records, appointment configurations, monitoring tasks, review items, logs, analytics, and team settings are hardcoded or kept in page state.
- Sign-in is a demo flow. No Lovable Cloud database/auth integration, migrations, server functions, background worker, deployment setup, or persistent service connections are present.
- Integration cards collect values only in browser memory and always report disconnected; no real BLS, proxy, or notification checks exist. No usable third-party connections or API documentation/credentials are available in this project.
- The dashboard and analytics contain sample metrics and status indicators, so they must not be presented as live results.
- The current project targets an edge-hosted runtime, not a VPS. A VPS deployment target would require a separate architecture decision and may mean changing the hosting approach.
- No live BLS appointment API/worker can responsibly be implemented without official integration documentation and authorized access. Monitoring must honor published limits, leave CAPTCHA/OTP and other verification to the user, and never claim a booking without confirmation.

## Staged implementation
1. **Enable the built-in backend and authentication** — connect Lovable Cloud; enable email/password authentication; implement signup, sign-in, sign-out, and account recovery. Create user profiles because profile details are required. Show email-confirmation state correctly.
2. **Add secure persistent data** — create additive migrations for profiles, organizations/memberships, separately stored roles, applicants, appointment configurations, monitoring task state, detected-slot review, activity logs, notification preferences/history, and integration status. Include explicit grants and RLS so each organization sees only its permitted data. Do not seed the current fabricated demo records as live business data or delete existing data.
3. **Connect existing screens** — replace sample/local state on applicants, configuration, team/settings, monitoring/review, logs, overview, and analytics with authenticated persistent data. Add real loading, empty, success, and error states; statistics must derive only from actual records.
4. **Integrations, only where support is documented** — handle provider secrets server-side; add truthful connection tests and health timestamps only for providers with official endpoints and authorized credentials/docs. Keep the BLS workflow manual-verification-safe. Do not build CAPTCHA/OTP bypass, rate-limit evasion, or unsupported appointment-booking automation. Report missing provider inputs rather than inventing endpoints or success.
5. **Deployment and readiness materials** — prepare the existing edge-hosted deployment, health reporting, operational configuration, and installation guide. If a VPS is required, settle the hosting target before writing VPS-specific files; the current runtime is not a conventional VPS server.
6. **Verification and report** — run focused tests and verify signed-in create/edit/read flows plus real configured integration checks where credentials/docs exist. Deliver a readiness report listing tested outcomes and every remaining external dependency. Do not claim live BLS, proxy, email, worker, or production deployment readiness unless actually verified.

## Technical details
- Use the project's TanStack Start server-function patterns and Lovable Cloud's generated clients; do not add a separate framework or Supabase Edge Functions.
- Keep private credentials out of browser code. Use organization-scoped RLS and a separate roles table; migrations grant the Data API roles explicitly.
- Start with non-destructive migrations and preserve the existing UI and features.

## Decisions and dependencies
- User profile storage: **Yes**, including profile details beyond login email.
- Hosting target: **Needs confirmation** — continue the existing edge-hosted deployment, or specifically require a VPS.
- Third-party connectivity: no provider connections, credentials, or official API documentation were found. Actual integration work beyond documented, testable endpoints remains gated on these inputs.
