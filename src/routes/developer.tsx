import { createFileRoute } from "@tanstack/react-router";
import { Globe, Shield, Cloud, Send, Mail, Phone } from "lucide-react";
import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/app/ui-bits";
import { IntegrationCard } from "@/components/app/integration-card";

export const Route = createFileRoute("/developer")({
  head: () => seo("Developer Settings", "Configure BLS portal, proxy, cloud server and messaging API connections."),
  component: DeveloperPage,
});

function DeveloperPage() {
  return (
    <>
      <PageHeader title="Developer Settings" description="Service connections required for live monitoring. All show Not connected until implemented." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <IntegrationCard name="BLS portal / API" description="Session and availability access" icon={Globe} testLabel="Test connection" placeholderId="bls-portal"
          fields={[{ key: "url", label: "Portal base URL", placeholder: "https://…blsspainvisa.com" }, { key: "user", label: "Account email", placeholder: "agent@agency.com" }, { key: "pass", label: "Password", placeholder: "••••••••", secret: true }]}
          steps={["Create a dedicated BLS account per centre", "Enter credentials here", "Run test connection to verify login"]} />
        <IntegrationCard name="Proxy connection" description="Rotating residential proxies" icon={Shield} testLabel="Test connection" placeholderId="proxy-pool"
          fields={[{ key: "host", label: "Host:port", placeholder: "proxy.example.com:8000" }, { key: "auth", label: "Username:password", placeholder: "user:pass", secret: true }]}
          steps={["Use proxies in the visa centre's country", "Set rotation interval with your provider"]} />
        <IntegrationCard name="Cloud server" description="Worker that runs monitoring tasks" icon={Cloud} testLabel="Test connection" placeholderId="cloud-worker"
          fields={[{ key: "endpoint", label: "Worker endpoint", placeholder: "https://worker.example.com" }, { key: "key", label: "Worker secret", placeholder: "••••••••", secret: true }]}
          steps={["Deploy the monitoring worker", "Paste its endpoint and shared secret"]} />
        <IntegrationCard name="Telegram API" description="Bot API for alerts" icon={Send} testLabel="Test connection" placeholderId="telegram-api"
          fields={[{ key: "token", label: "Bot token", placeholder: "123456:ABC-…", secret: true }]} steps={["Create a bot with @BotFather", "Paste the token"]} />
        <IntegrationCard name="Email service" description="Transactional email provider" icon={Mail} testLabel="Test connection" placeholderId="email-service"
          fields={[{ key: "domain", label: "Sender domain", placeholder: "notify.agency.com" }, { key: "key", label: "API key", placeholder: "••••••••", secret: true }]} steps={["Verify your sender domain", "Add the API key"]} />
        <IntegrationCard name="WhatsApp API" description="WhatsApp Business Cloud API" icon={Phone} testLabel="Test connection" placeholderId="whatsapp-api"
          fields={[{ key: "phoneId", label: "Phone number ID", placeholder: "1029384756" }, { key: "token", label: "Access token", placeholder: "••••••••", secret: true }]} steps={["Register a Meta business app", "Add a phone number and token"]} />
      </div>
    </>
  );
}
