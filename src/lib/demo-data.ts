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

// Structured country → city → BLS centre dataset. Add countries/cities here;
// the configuration form derives its selectors from this map automatically.
export const COUNTRIES: Record<string, Record<string, string[]>> = {
  "United Arab Emirates": {
    Dubai: ["BLS Visa Application Centre – Dubai (Wafi Mall)", "BLS Visa Application Centre – Dubai (Deira)"],
    "Abu Dhabi": ["BLS Visa Application Centre – Abu Dhabi"],
    Sharjah: ["BLS Visa Application Centre – Sharjah"],
    Ajman: ["BLS Visa Application Centre – Ajman"],
  },
  Pakistan: {
    Islamabad: ["BLS Visa Application Centre – Islamabad"],
    Karachi: ["BLS Visa Application Centre – Karachi"],
    Lahore: ["BLS Visa Application Centre – Lahore"],
    Faisalabad: ["BLS Visa Application Centre – Faisalabad"],
    Multan: ["BLS Visa Application Centre – Multan"],
    Peshawar: ["BLS Visa Application Centre – Peshawar"],
  },
  Turkey: {
    Istanbul: ["BLS Visa Application Centre – Istanbul (European Side)", "BLS Visa Application Centre – Istanbul (Asian Side)"],
    Ankara: ["BLS Visa Application Centre – Ankara"],
    Izmir: ["BLS Visa Application Centre – Izmir"],
    Antalya: ["BLS Visa Application Centre – Antalya"],
  },
  Israel: {
    Jerusalem: ["BLS Visa Application Centre – Jerusalem"],
    "Tel Aviv": ["BLS Visa Application Centre – Tel Aviv"],
    Haifa: ["BLS Visa Application Centre – Haifa"],
  },
  Spain: {
    Madrid: ["BLS Visa Application Centre – Madrid", "BLS Visa Application Centre – Madrid (Alcalá)"],
    Barcelona: ["BLS Visa Application Centre – Barcelona"],
    Malaga: ["BLS Visa Application Centre – Malaga"],
    Valencia: ["BLS Visa Application Centre – Valencia"],
  },
  Nigeria: {
    Lagos: ["BLS Visa Application Centre – Lagos (Victoria Island)", "BLS Visa Application Centre – Lagos (Ikeja)"],
    Abuja: ["BLS Visa Application Centre – Abuja"],
    "Port Harcourt": ["BLS Visa Application Centre – Port Harcourt"],
  },
  India: {
    "New Delhi": ["BLS Visa Application Centre – New Delhi"],
    Mumbai: ["BLS Visa Application Centre – Mumbai"],
    Chennai: ["BLS Visa Application Centre – Chennai"],
    Kolkata: ["BLS Visa Application Centre – Kolkata"],
    Bangalore: ["BLS Visa Application Centre – Bangalore"],
    Hyderabad: ["BLS Visa Application Centre – Hyderabad"],
    Ahmedabad: ["BLS Visa Application Centre – Ahmedabad"],
    Pune: ["BLS Visa Application Centre – Pune"],
  },
  Ghana: {
    Accra: ["BLS Visa Application Centre – Accra"],
  },
  Egypt: {
    Cairo: ["BLS Visa Application Centre – Cairo", "BLS Visa Application Centre – Cairo (Heliopolis)"],
    Alexandria: ["BLS Visa Application Centre – Alexandria"],
  },
  Morocco: {
    Casablanca: ["BLS Visa Application Centre – Casablanca"],
    Rabat: ["BLS Visa Application Centre – Rabat"],
    Tangier: ["BLS Visa Application Centre – Tangier"],
    Marrakesh: ["BLS Visa Application Centre – Marrakesh"],
  },
  Kenya: {
    Nairobi: ["BLS Visa Application Centre – Nairobi"],
    Mombasa: ["BLS Visa Application Centre – Mombasa"],
  },
  Philippines: {
    Manila: ["BLS Visa Application Centre – Manila", "BLS Visa Application Centre – Manila (Makati)"],
    Cebu: ["BLS Visa Application Centre – Cebu"],
  },
  Indonesia: {
    Jakarta: ["BLS Visa Application Centre – Jakarta"],
    Surabaya: ["BLS Visa Application Centre – Surabaya"],
    Denpasar: ["BLS Visa Application Centre – Denpasar (Bali)"],
  },
  Bangladesh: {
    Dhaka: ["BLS Visa Application Centre – Dhaka", "BLS Visa Application Centre – Dhaka (Gulshan)"],
    Chattogram: ["BLS Visa Application Centre – Chattogram"],
  },
  Algeria: {
    Algiers: ["BLS Visa Application Centre – Algiers"],
    Oran: ["BLS Visa Application Centre – Oran"],
  },
};

export const VISA_CATEGORIES = ["Schengen – Tourism", "Schengen – Business", "Student (National D)", "Work Permit", "Family Reunion", "Transit"];
export const APPOINTMENT_TYPES = ["Individual", "Family", "Premium Lounge", "Prime Time"];
export const AIRPORTS = ["DXB – Dubai", "AUH – Abu Dhabi", "KHI – Karachi", "ISB – Islamabad", "LHE – Lahore", "IST – Istanbul", "AYT – Antalya", "TLV – Tel Aviv", "MAD – Madrid", "LIS – Lisbon", "FCO – Rome", "BUD – Budapest", "BCN – Barcelona", "LOS – Lagos", "ABV – Abuja", "DEL – New Delhi", "BOM – Mumbai", "MAA – Chennai", "ACC – Accra", "CAI – Cairo", "CMN – Casablanca", "RAK – Marrakesh", "NBO – Nairobi", "MBA – Mombasa", "MNL – Manila", "CEB – Cebu", "CGK – Jakarta", "SUB – Surabaya", "DPS – Denpasar", "DAC – Dhaka", "ALG – Algiers", "ORN – Oran"];

export const initialConfigs: AppointmentConfig[] = [
  { id: "cfg-1", name: "Adeyemi family – Spain tourism", country: "United Arab Emirates", city: "Dubai", centre: "BLS Visa Application Centre – Dubai (Wafi Mall)", zip: "00000", address: "Office 1204, Sheikh Zayed Rd, Dubai", visaCategory: "Schengen – Tourism", appointmentType: "Family", applicants: 4, slots: 4, dateFrom: "2026-11-10", dateTo: "2026-11-28", timeFrom: "08:00", timeTo: "13:00", flightDate: "2026-12-18", flightTime: "22:40", departureAirport: "DXB – Dubai", destinationAirport: "MAD – Madrid", notes: "Christmas holiday trip. Two minors." },
  { id: "cfg-2", name: "Okafor – Portugal study", country: "Pakistan", city: "Karachi", centre: "BLS Visa Application Centre – Karachi", zip: "75500", address: "Suite 8, Clifton Block 5, Karachi", visaCategory: "Student (National D)", appointmentType: "Individual", applicants: 1, slots: 1, dateFrom: "2026-11-03", dateTo: "2026-12-05", timeFrom: "09:00", timeTo: "16:00", flightDate: "2027-01-12", flightTime: "10:15", departureAirport: "KHI – Karachi", destinationAirport: "LIS – Lisbon", notes: "University of Porto, term starts Feb." },
  { id: "cfg-3", name: "Bello & Co – Italy business", country: "Turkey", city: "Istanbul", centre: "BLS Visa Application Centre – Istanbul (European Side)", zip: "34394", address: "Esentepe Mah. Büyükdere Cd. No:128, Istanbul", visaCategory: "Schengen – Business", appointmentType: "Premium Lounge", applicants: 2, slots: 2, dateFrom: "2026-11-05", dateTo: "2026-11-20", timeFrom: "10:00", timeTo: "15:00", flightDate: "2026-12-02", flightTime: "14:30", departureAirport: "IST – Istanbul", destinationAirport: "FCO – Rome", notes: "Trade fair in Milan." },
];

export const initialApplicants: Applicant[] = [
  { id: "ap-1", firstName: "Tunde", lastName: "Adeyemi", email: "tunde.adeyemi@mail.com", phone: "+971 50 555 0142", passport: "A0•••••21", nationality: "Nigerian", dob: "1984-03-12", group: "Adeyemi family", status: "ready" },
  { id: "ap-2", firstName: "Funke", lastName: "Adeyemi", email: "funke.adeyemi@mail.com", phone: "+971 50 555 0187", passport: "A0•••••58", nationality: "Nigerian", dob: "1987-07-30", group: "Adeyemi family", status: "ready" },
  { id: "ap-3", firstName: "Tobi", lastName: "Adeyemi", email: "—", phone: "—", passport: "A1•••••04", nationality: "Nigerian", dob: "2014-01-09", group: "Adeyemi family", status: "incomplete" },
  { id: "ap-4", firstName: "Ife", lastName: "Adeyemi", email: "—", phone: "—", passport: "A1•••••77", nationality: "Nigerian", dob: "2017-11-22", group: "Adeyemi family", status: "ready" },
  { id: "ap-5", firstName: "Chiamaka", lastName: "Okafor", email: "chiamaka.o@uni.edu", phone: "+92 300 555 0391", passport: "B2•••••13", nationality: "Nigerian", dob: "2002-05-17", group: "Individual", status: "booked" },
  { id: "ap-6", firstName: "Ibrahim", lastName: "Bello", email: "i.bello@belloandco.ng", phone: "+90 532 555 0110", passport: "A3•••••90", nationality: "Nigerian", dob: "1979-09-02", group: "Bello & Co", status: "ready" },
  { id: "ap-7", firstName: "Hauwa", lastName: "Bello", email: "h.bello@belloandco.ng", phone: "+90 532 555 0144", passport: "A3•••••36", nationality: "Nigerian", dob: "1990-12-14", group: "Bello & Co", status: "incomplete" },
];

export const initialTasks: MonitorTask[] = [
  { id: "tsk-1", configId: "cfg-1", label: "Adeyemi family – Spain tourism", country: "United Arab Emirates", location: "Dubai · Wafi Mall", applicants: 4, window: "10 – 28 Nov, 08:00–13:00", status: "running", lastCheck: "12s ago", slotsDetected: 3, errors: [] },
  { id: "tsk-2", configId: "cfg-2", label: "Okafor – Portugal study", country: "Pakistan", location: "Karachi", applicants: 1, window: "3 Nov – 5 Dec, 09:00–16:00", status: "paused", lastCheck: "2h ago", slotsDetected: 1, errors: [] },
  { id: "tsk-3", configId: "cfg-3", label: "Bello & Co – Italy business", country: "Turkey", location: "Istanbul · European Side", applicants: 2, window: "5 – 20 Nov, 10:00–15:00", status: "error", lastCheck: "18m ago", slotsDetected: 0, errors: ["Portal returned HTTP 429 (rate limited)", "Captcha challenge not solved within 30s"] },
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
  { id: "l1", time: "2026-10-31 07:22", actor: "System", category: "monitoring", level: "info", message: "Slot detected: UAE · Dubai · 14 Nov 09:30 (Family)" },
  { id: "l2", time: "2026-10-31 07:11", actor: "System", category: "monitoring", level: "error", message: "Turkey · Istanbul task failed: HTTP 429 rate limited" },
  { id: "l3", time: "2026-10-30 17:20", actor: "Miguel (Owner)", category: "config", level: "info", message: "Edited configuration “Bello & Co – Italy business”" },
  { id: "l4", time: "2026-10-30 16:58", actor: "Miguel (Owner)", category: "applicant", level: "info", message: "Added applicant Hauwa Bello to group Bello & Co" },
  { id: "l5", time: "2026-10-30 15:12", actor: "Segun (Team Member)", category: "monitoring", level: "warning", message: "Paused task “Okafor – Portugal study”" },
  { id: "l6", time: "2026-10-30 14:03", actor: "System", category: "system", level: "warning", message: "Notification not sent: no channel connected" },
  { id: "l7", time: "2026-10-30 09:15", actor: "Miguel (Owner)", category: "auth", level: "info", message: "Signed in from Dubai, AE" },
  { id: "l8", time: "2026-10-29 21:47", actor: "System", category: "monitoring", level: "info", message: "Slot detected: Pakistan · Karachi · 19 Nov 11:00" },
  { id: "l9", time: "2026-10-29 18:30", actor: "Segun (Team Member)", category: "monitoring", level: "info", message: "Manual review: confirmed booking for Chiamaka Okafor" },
  { id: "l10", time: "2026-10-29 11:02", actor: "System", category: "system", level: "error", message: "Captcha challenge not solved within 30s" },
];

export const reviewQueue = [
  { id: "r1", applicant: "Adeyemi family (4)", centre: "UAE · Dubai (Wafi Mall)", slot: "14 Nov 2026, 09:30", detected: "5m ago" },
  { id: "r2", applicant: "Adeyemi family (4)", centre: "UAE · Dubai (Wafi Mall)", slot: "17 Nov 2026, 11:00", detected: "22m ago" },
];
