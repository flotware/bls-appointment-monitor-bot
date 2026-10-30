import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { PageHeader, Panel } from "@/components/app/ui-bits";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/help")({
  head: () => seo("Help and Support", "Guides, FAQs and support for BLS Appointment Manager."),
  component: HelpPage,
});

const faqs = [
  ["What's the difference between a detected slot and a confirmed booking?", "A detected slot is availability seen on the BLS portal. It only becomes a confirmed booking after your team books it and marks it confirmed in Manual review."],
  ["Why do all integrations say Not connected?", "Live connections to the BLS portal, proxies, cloud worker and notification channels haven't been set up yet. Add credentials in Developer Settings once they're available."],
  ["How do I group a family?", "When adding or editing an applicant, type the same family/group name for each member. Use the filter chips on the Applicants page to view a group."],
  ["Can I export data?", "Yes — Applicants, Activity Logs and Analytics each have an Export button that downloads a CSV file."],
];

function HelpPage() {
  return (
    <>
      <PageHeader title="Help and Support" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Panel title="Frequently asked questions">
          <Accordion type="single" collapsible>{faqs.map(([q, a]) => <AccordionItem key={q} value={q}><AccordionTrigger className="text-sm">{q}</AccordionTrigger><AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion>
        </Panel>
        <Panel title="Contact support" description="We usually reply within one business day.">
          <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); (e.target as HTMLFormElement).reset(); toast.success("Message sent", { description: "Demo only — support inbox not connected yet." }); }}>
            <Input required placeholder="Subject" />
            <Textarea required rows={5} placeholder="Describe the issue…" />
            <Button type="submit">Send message</Button>
          </form>
        </Panel>
      </div>
    </>
  );
}
