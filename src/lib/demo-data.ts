// Frontend-only demo data. Replace with real API calls when backend integrations are connected.

export type TaskStatus = "running" | "paused" | "stopped" | "error";

export interface AppointmentConfig {
  id: string;
  name: string;
  country: string;
  city: string;
  centre: string;
  zip: string;
  address: string;
  visaCategory: string;
  appointmentType: string;
  applicants: number;
  slots: number;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  flightDate: string;
  flightTime: string;
  departureAirport: string;
  destinationAirport: string;
  notes: string;
}

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passport: string;
  nationality: string;
  dob: string;
  group: string;
  status: "ready" | "incomplete" | "booked";
}

export interface MonitorTask {
  id: string;
  configId: string;
  label: string;
  country: string;
  location: string;
  applicants: number;
  window: string;
  status: TaskStatus;
  lastCheck: string;
  slotsDetected: number;
  errors: string[];
}

export const COUNTRIES: Record<string, Record<string, string[]>> = {
  Spain: {
    Lagos: ["BLS Spain Visa Centre – Victoria Island"],
    Abuja: ["BLS Spain Visa Centre – Wuse 2"],
    London: ["BLS Spain Visa Centre – Kensington"],
  },
  Portugal: {
    Lagos: ["BLS Portugal Visa Centre – Ikoyi"],
    Accra: ["BLS Portugal Visa Centre – Airport City"],
  },
  Italy: {
    Lagos: ["BLS Italy Visa Centre – Lekki"],
    Abuja: ["BLS Italy Visa Centre – Maitama"],
  },
  Hungary: { Lagos: ["BLS Hungary Visa Centre – Ikeja"] },
};

export const VISA_CATEGORIES = ["Schengen – Tourism", "Schengen – Business", "Student (National D)", "Work Permit", "Family Reunion", "Transit"];
export const APPOINTMENT_TYPES = ["Individual", "Family", "Premium Lounge", "Prime Time"];
export const AIRPORTS = ["LOS – Lagos", "ABV – Abuja", "ACC – Accra", "LHR – London", "MAD – Madrid", "LIS – Lisbon", "FCO – Rome", "BUD – Budapest"];

export const initialConfigs: AppointmentConfig[] = [
  { id: "cfg-1", name: "Adeyemi family – Spain tourism", country: "Spain", city: "Lagos", centre: "BLS Spain Visa Centre – Victoria Island", zip: "101241", address: "14 Adeola Odeku St, Victoria Island", visaCategory: "Schengen – Tourism", appointmentType: "Family", applicants: 4, slots: 4, dateFrom: "2026-11-10", dateTo: "2026-11-28", timeFrom: "08:00", timeTo: "13:00", flightDate: "2026-12-18", flightTime: "22:40", departureAirport: "LOS – Lagos", destinationAirport: "MAD – Madrid", notes: "Christmas holiday trip. Two minors." },
  { id: "cfg-2", name: "Okafor – Portugal study", country: "Portugal", city: "Lagos", centre: "BLS Portugal Visa Centre – Ikoyi", zip: "106104", address: "3 Bourdillon Rd, Ikoyi", visaCategory: "Student (National D)", appointmentType: "Individual", applicants: 1, slots: 1, dateFrom: "2026-11-03", dateTo: "2026-12-05", timeFrom: "09:00", timeTo: "16:00", flightDate: "2027-01-12", flightTime: "10:15", departureAirport: "LOS – Lagos", destinationAirport: "LIS – Lisbon", notes: "University of Porto, term starts Feb." },
  { id: "cfg-3", name: "Bello & Co – Italy business", country: "Italy", city: "Abuja", centre: "BLS Italy Visa Centre – Maitama", zip: "904101", address: "22 Gana St, Maitama", visaCategory: "Schengen – Business", appointmentType: "Premium Lounge", applicants: 2, slots: 2, dateFrom: "2026-11-05", dateTo: "2026-11-20", timeFrom: "10:00", timeTo: "15:00", flightDate: "2026-12-02", flightTime: "14:30", departureAirport: "ABV – Abuja", destinationAirport: "FCO – Rome", notes: "Trade fair in Milan." },
];

export const initialApplicants: Applicant[] = [
  { id: "ap-1", firstName: "Tunde", lastName: "Adeyemi", email: "tunde.adeyemi@mail.com", phone: "+234 803 555 0142", passport: "A0•••••21", nationality: "Nigerian", dob: "1984-03-12", group: "Adeyemi family", status: "ready" },
  { id: "ap-2", firstName: "Funke", lastName: "Adeyemi", email: "funke.adeyemi@mail.com", phone: "+234 803 555 0187", passport: "A0•••••58", nationality: "Nigerian", dob: "1987-07-30", group: "Adeyemi family", status: "ready" },
  { id: "ap-3", firstName: "Tobi", lastName: "Adeyemi", email: "—", phone: "—", passport: "A1•••••04", nationality: "Nigerian", dob: "2014-01-09", group: "Adeyemi family", status: "incomplete" },
  { id: "ap-4", firstName: "Ife", lastName: "Adeyemi", email: "—", phone: "—", passport: "A1•••••77", nationality: "Nigerian", dob: "2017-11-22", group: "Adeyemi family", status: "ready" },
  { id: "ap-5", firstName: "Chiamaka", lastName: "Okafor", email: "chiamaka.o@uni.edu", phone: "+234 816 555 0391", passport: "B2•••••13", nationality: "Nigerian", dob: "2002-05-17", group: "Individual", status: "booked" },
  { id: "ap-6", firstName: "Ibrahim", lastName: "Bello", email: "i.bello@belloandco.ng", phone: "+234 809 555 0110", passport: "A3•••••90", nationality: "Nigerian", dob: "1979-09-02", group: "Bello & Co", status: "ready" },
  { id: "ap-7", firstName: "Hauwa", lastName: "Bello", email: "h.bello@belloandco.ng", phone: "+234 809 555 0144", passport: "A3•••••36", nationality: "Nigerian", dob: "1990-12-14", group: "Bello & Co", status: "incomplete" },
];

export const initialTasks: MonitorTask[] = [
  { id: "tsk-1", configId: "cfg-1", label: "Adeyemi family – Spain tourism", country: "Spain", location: "Lagos · Victoria Island", applicants: 4, window: "10 – 28 Nov, 08:00–13:00", status: "running", lastCheck: "12s ago", slotsDetected: 3, errors: [] },
  { id: "tsk-2", configId: "cfg-2", label: "Okafor – Portugal study", country: "Portugal", location: "Lagos · Ikoyi", applicants: 1, window: "3 Nov – 5 Dec, 09:00–16:00", status: "paused", lastCheck: "2h ago", slotsDetected: 1, errors: [] },
  { id: "tsk-3", configId: "cfg-3", label: "Bello & Co – Italy business", country: "Italy", location: "Abuja · Maitama", applicants: 2, window: "5 – 20 Nov, 10:00–15:00", status: "error", lastCheck: "18m ago", slotsDetected: 0, errors: ["Portal returned HTTP 429 (rate limited)", "Captcha challenge not solved within 30s"] },
];

export const activitySeries = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 9, 17 + i);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    checks: 380 + Math.round(Math.sin(i / 2) * 90 + i * 12),
    detected: Math.max(0, Math.round(4 + Math.sin(i) * 3 + (i % 4))),
    confirmed: Math.max(0, Math.round(1 + Math.cos(i / 1.5) * 1.2)),
    notifications: 20 + Math.round(Math.cos(i / 3) * 8 + i),
    failed: Math.max(0, Math.round(2 + Math.sin(i * 1.3) * 2)),
  };
});

export const errorStats = [
  { type: "Rate limited (429)", count: 42 },
  { type: "Captcha timeout", count: 27 },
  { type: "Session expired", count: 18 },
  { type: "Proxy unreachable", count: 9 },
  { type: "Unexpected layout", count: 5 },
];

export const notificationChannels = [
  { channel: "Email", sent: 0, failed: 0 },
  { channel: "Telegram", sent: 0, failed: 0 },
  { channel: "Discord", sent: 0, failed: 0 },
  { channel: "WhatsApp", sent: 0, failed: 0 },
];

export interface LogEntry { id: string; time: string; actor: string; category: "monitoring" | "config" | "applicant" | "auth" | "system"; level: "info" | "warning" | "error"; message: string }

export const activityLogs: LogEntry[] = [
  { id: "l1", time: "2026-10-30 17:52", actor: "System", category: "monitoring", level: "info", message: "Slot detected: Spain · Lagos · 14 Nov 09:30 (Family)" },
  { id: "l2", time: "2026-10-30 17:41", actor: "System", category: "monitoring", level: "error", message: "Italy · Abuja task failed: HTTP 429 rate limited" },
  { id: "l3", time: "2026-10-30 17:20", actor: "Amaka (Admin)", category: "config", level: "info", message: "Edited configuration “Bello & Co – Italy business”" },
  { id: "l4", time: "2026-10-30 16:58", actor: "Amaka (Admin)", category: "applicant", level: "info", message: "Added applicant Hauwa Bello to group Bello & Co" },
  { id: "l5", time: "2026-10-30 15:12", actor: "Segun (Agent)", category: "monitoring", level: "warning", message: "Paused task “Okafor – Portugal study”" },
  { id: "l6", time: "2026-10-30 14:03", actor: "System", category: "system", level: "warning", message: "Notification not sent: no channel connected" },
  { id: "l7", time: "2026-10-30 09:15", actor: "Amaka (Admin)", category: "auth", level: "info", message: "Signed in from Lagos, NG" },
  { id: "l8", time: "2026-10-29 21:47", actor: "System", category: "monitoring", level: "info", message: "Slot detected: Portugal · Lagos · 19 Nov 11:00" },
  { id: "l9", time: "2026-10-29 18:30", actor: "Segun (Agent)", category: "monitoring", level: "info", message: "Manual review: confirmed booking for Chiamaka Okafor" },
  { id: "l10", time: "2026-10-29 11:02", actor: "System", category: "system", level: "error", message: "Captcha challenge not solved within 30s" },
];

export const reviewQueue = [
  { id: "r1", applicant: "Adeyemi family (4)", centre: "Spain · Lagos VI", slot: "14 Nov 2026, 09:30", detected: "5m ago" },
  { id: "r2", applicant: "Adeyemi family (4)", centre: "Spain · Lagos VI", slot: "17 Nov 2026, 11:00", detected: "22m ago" },
];
