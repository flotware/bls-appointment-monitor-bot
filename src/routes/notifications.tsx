import { createFileRoute } from "@tanstack/react-router";
import { Send, MessageSquare, Mail, Phone } from "lucide-react";
import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/app/ui-bits";
import { IntegrationCard } from "@/components/app/integration-card";

export const Route = createFileRoute("/notifications")({
  head: () => seo("Notifications", "Connect Telegram, Discord, Email and WhatsApp to receive appointment slot alerts."),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <>
      <PageHeader title="Notifications" description="Choose where slot alerts are delivered. No channel is connected yet." />
      <div className="grid gap-4 md:grid-cols-2">
        <IntegrationCard name="Telegram" description="Instant alerts to a chat or group" icon={Send} placeholderId="notify-telegram"
          fields={[{ key: "token", label: "Bot token", placeholder: "123456:ABC-…", secret: true }, { key: "chat", label: "Chat ID", placeholder: "-100123456789" }]} testLabel="Send test notification" />
        <IntegrationCard name="Discord" description="Post alerts to a server channel" icon={MessageSquare} placeholderId="notify-discord"
          fields={[{ key: "webhook", label: "Webhook URL", placeholder: "https://discord.com/api/webhooks/…", secret: true }]} testLabel="Send test notification" />
        <IntegrationCard name="Email" description="Send alerts to your team inbox" icon={Mail} placeholderId="notify-email"
          fields={[{ key: "to", label: "Recipient addresses", placeholder: "ops@agency.com, amaka@agency.com" }, { key: "from", label: "Sender name", placeholder: "BLS Monitor" }]} testLabel="Send test notification" />
        <IntegrationCard name="WhatsApp" description="Alerts via WhatsApp Business" icon={Phone} placeholderId="notify-whatsapp"
          fields={[{ key: "phone", label: "Recipient number", placeholder: "+234 803 000 0000" }, { key: "key", label: "API key", placeholder: "••••••••", secret: true }]} testLabel="Send test notification" />
      </div>
    </>
  );
}
