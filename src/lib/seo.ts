export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} · BLS Appointment Manager` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · BLS Appointment Manager` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
