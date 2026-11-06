const { useState, useEffect } = React;
const store = {
  get: async (k) => { const v = localStorage.getItem(k); if (v == null) throw new Error("none"); return { value: v }; },
  set: async (k, v) => { localStorage.setItem(k, v); },
};

// Bump whenever the seed data below changes, to force a one-time refresh
// of what's already sitting in a user's storage.
const CURRENT_VERSION = 20;

// ---------- palette (inline styles only — arbitrary Tailwind color
// classes like bg-[#18181B] don't compile in this sandbox, so every
// color here is applied via style={} instead of className) ----------
const C = {
  bg: "#121214",
  card: "#1E1E21",
  border: "#2C2C2F",
  text: "#FFFFFF",
  textDim: "#D1D1D6",
  muted: "#9A9AA0",
  red: "#EF4444",
  redDark: "#1A0000",
  green: "#34C759",
  yellow: "#FFD60A",
  ringTrack: "#2C2C2E",
};

// ---------- helpers ----------
const uid = () => Math.random().toString(36).slice(2, 10);
const g = (name, weight, score, outOf = 100) => ({ id: uid(), name, weight, score, outOf });
// note ignorée dans le calcul de la note finale
const gIgn = (name, weight, score, outOf = 100) => ({ id: uid(), name, weight, score, outOf, ignored: true });

function seedCourses() {
  return [
    {
      id: uid(),
      code: "LOG121",
      name: "Conception orientée objet",
      term: "Automne 2026",
      teacher: "Robitaille, Patrice",
      group: "04",
      credits: 4,
      cote: null,
      moyenne: 61.8,
      mediane: 61.8,
      ecartType: 9.1,
      rangCentile: 63,
      gradeItems: [
        g("Quiz01", 1, 73),
        g("Lab01", 4, 88),
        g("Quiz diagrammes de classe", 1, 79),
        g("Quiz diagrammes séquence", 1, 85),
        g("Quiz02", 1, 85),
        g("Lab02", 4, 65),
        g("Quiz04", 1, 98),
        g("Quiz05", 1, 93),
        g("Examen Intra", 25, 77),
        g("Quiz06", 1, null),
        g("Lab03", 6, 31),
        g("Quiz08", 1, null),
        g("Lab04", 6, null),
        g("Quiz09", 1, null),
        g("Quiz10", 1, null),
        g("Examen préparatoire au final", 8, null),
        g("Quiz11", 1, null),
        g("Quiz12", 1, null),
        g("Lab05", 10, null),
        g("Examen final", 30, null),
      ],
    },
    {
      id: uid(),
      code: "MAT210",
      name: "Logique et mathématiques discrètes",
      term: "Automne 2026",
      teacher: "Choquette, Philippe",
      group: "01",
      credits: 4,
      cote: null,
      moyenne: 66.6,
      mediane: 66.8,
      ecartType: 8.3,
      rangCentile: 27,
      gradeItems: [
        g("MTest01", 8, 52),
        g("Dev01", 8, 74),
        g("Intra", 35, 58),
        g("MTest02", 8, null),
        g("Dev02", 8, null),
        g("Final", 35, null),
      ],
    },
    {
      id: uid(),
      code: "ING150",
      name: "Statique et dynamique",
      term: "Automne 2026",
      teacher: "Paquin, Gérald",
      group: "09",
      credits: 4,
      cote: null,
      moyenne: 64.3,
      mediane: 65.3,
      ecartType: 6.5,
      rangCentile: 68,
      gradeItems: [
        g("TP-Bloc1", 5, 100),
        g("Exam 1", 25, 67),
        g("TP-Bloc2", 5, null),
        g("Exam 2", 25, null),
        g("TP-Bloc3", 5, null),
        g("Labo", 10, null),
        g("Final", 25, null),
      ],
    },
    {
      id: uid(),
      code: "MAT145",
      name: "Calcul différentiel et intégral",
      term: "Été 2026",
      teacher: "Persechino, Roberto",
      group: "03",
      credits: 4,
      cote: "C+",
      moyenne: 67.1,
      mediane: 67.6,
      ecartType: 7.8,
      rangCentile: 34,
      gradeItems: [
        g("MTest01", 10, 58),
        g("Intra", 35, 63),
        g("MTest02", 10, 40),
        g("Exercices hebdomadaires", 10, 85),
        g("Final", 35, 68),
      ],
    },
    {
      id: uid(),
      code: "ING150",
      name: "",
      term: "Été 2026",
      teacher: "",
      group: "",
      credits: 0,
      cote: "XX",
      moyenne: null,
      mediane: null,
      ecartType: null,
      rangCentile: null,
      gradeItems: [],
    },
    {
      id: uid(),
      code: "LOG100",
      name: "Programmation et réseautique en génie logiciel",
      term: "Hiver 2026",
      teacher: "Moha, Naouel",
      group: "01",
      credits: 4,
      cote: "C+",
      moyenne: 74.3,
      mediane: 75.2,
      ecartType: 9.8,
      rangCentile: 15,
      noteOverride: { pts: 63.9, total: 100 },
      gradeItems: [
        g("Examen réseau", 25, 49),
        g("Examen programmation", 25, 50),
        g("Lab01-programmation", 3, 74),
        g("Lab01-réseaux", 3, 91),
        g("Lab02-programmation", 3, 100),
        g("Lab02-réseaux", 3, 93),
        g("Lab03-réseaux", 3, 90),
        g("Lab04-réseaux", 3, 92),
        g("Lab05-réseaux", 3, 60),
        g("Lab06-réseaux", 4, 56),
        g("Lab03-programmation", 3, 51),
        g("Lab04-programmation", 3, 100),
        g("Lab05-programmation", 4, 94),
        g("Lab06-programmation", 4, 100),
        g("Quiz-réseaux", 5, 60),
        g("Quiz-programmation", 5, 54),
      ],
    },
    {
      id: uid(),
      code: "MAT144",
      name: "Introduction aux mathématiques du génie…",
      term: "Hiver 2026",
      teacher: "Prud'Homme, André",
      group: "02",
      credits: 4,
      cote: "H/B-",
      moyenne: 69.8,
      mediane: 71.1,
      ecartType: 11.2,
      rangCentile: 41,
      gradeItems: [
        g("MTest01", 10, 76),
        g("Intra", 35, 74),
        g("MTest02", 10, 69),
        g("Dev01", 5, 96),
        g("Final", 40, 51),
      ],
    },
    {
      id: uid(),
      code: "PHY144",
      name: "Introduction à la physique du génie (hors…)",
      term: "Hiver 2026",
      teacher: "Clisson, Marlène",
      group: "02",
      credits: 4,
      cote: "H/C",
      moyenne: 66.1,
      mediane: 65.8,
      ecartType: 13.0,
      rangCentile: 25,
      noteOverride: { pts: 58.5, total: 100 },
      gradeItems: [
        g("Mini test Chap 2", 1, 100),
        g("Mini test Chap 3", 1, 92),
        g("Examen 1", 30, 72),
        g("Activité en équipe-Projectile", 1, 60),
        g("Mini test Chap 4", 1, 75),
        g("Examen 2", 25, 53),
        g("Mini test Chap 7", 1, 48),
        g("Mini test Chap 8", 1, 93),
        g("Activité en équipe-Énergie", 1, 100),
        g("Final", 35, 45),
        gIgn("Mini test Chap 5", 1, 34),
      ],
    },
    {
      id: uid(),
      code: "ATE100",
      name: "Intégrité intellectuelle",
      term: "Automne 2025",
      teacher: "",
      group: "01",
      credits: 0,
      cote: "S",
      moyenne: 91.2,
      mediane: 92.1,
      ecartType: 6.9,
      rangCentile: 4,
      gradeItems: [g("Final", 100, 77)],
    },
    {
      id: uid(),
      code: "ATE150",
      name: "Règles de base en santé et sécurité",
      term: "Automne 2025",
      teacher: "",
      group: "03",
      credits: 0,
      cote: "S",
      moyenne: 89.2,
      mediane: 90.0,
      ecartType: 8.8,
      rangCentile: 7,
      gradeItems: [
        g("Santé et sécurité à l'ÉTS", 50, 83),
        g("Santé et sécurité laboratoire", 50, 75),
      ],
    },
  ];
}

const TERM_ORDER = ["Automne 2026", "Été 2026", "Hiver 2026", "Automne 2025"];
const termRank = (term) => {
  const i = TERM_ORDER.indexOf(term);
  return i === -1 ? TERM_ORDER.length : i;
};

// ---------- weekly schedule (Automne 2026) ----------
// GIA400 only ever appears here in the schedule — it's intentionally not
// added to the Notes/Étudiant course list or Accueil.
const SCHED_COLORS = {
  ING150: "#34495E",
  LOG121: "#E8832A",
  MAT210: "#EA4C3F",
};
// couleurs de la barre latérale sur l'accueil
const HOME_COLORS = {
  ING150: "#7E2BD9",
  LOG121: "#E8832A",
  MAT210: "#F0A0BE",
};
const ACTIVITY_LABEL = { Cours: "Activité de cours", TP: "Travaux pratiques", Labo: "Laboratoire" };

// day: 0=lundi .. 4=vendredi — this pattern repeats every week except the
// Monday holiday handled by isHolidayMonday() below.
const SCHEDULE = [
  { day: 0, code: "MAT210", section: "MAT210-01", type: "TP", room: "B-3402", start: 13.5, end: 16.5 },
  { day: 0, code: "LOG121", section: "LOG121-04", type: "Labo", room: "A-3450", start: 18, end: 21 },
  { day: 2, code: "ING150", section: "ING150-09", type: "TP", room: "B-1504", start: 13.5, end: 16.5 },
  { day: 2, code: "LOG121", section: "LOG121-04", type: "Cours", room: "D-4012", start: 18, end: 21 },
  { day: 4, code: "ING150", section: "ING150-09", type: "Cours", room: "B-1506", start: 9, end: 12.5 },
  { day: 4, code: "MAT210", section: "MAT210-01", type: "Cours", room: "B-3406", start: 13.5, end: 17 },
];

const WEEK_SHORT = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const MONTH_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const DAY_NAMES_FULL = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

// week 0 (weekOffset) starts on this Sunday
const BASE_SUNDAY = new Date(2026, 7, 30); // dim. 30 août 2026

// Aujourd'hui (date de l'appareil) et semaine courante par rapport à BASE_SUNDAY
const TODAY = new Date();
const CURRENT_WEEK = Math.max(
  0,
  Math.floor(
    Math.round((new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()) - BASE_SUNDAY) / 86400000) / 7
  )
);

function weekDates(weekOffset) {
  const start = new Date(BASE_SUNDAY);
  start.setDate(BASE_SUNDAY.getDate() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// Fin des cours : plus rien à l'horaire à partir de la semaine du 7 décembre 2026
function hasClasses(date) {
  return date.getTime() < new Date(2026, 11, 7).getTime();
}

function isHolidayMonday(date) {
  return date.getFullYear() === 2026 && date.getMonth() === 8 && date.getDate() === 7; // lundi 7 sept. 2026
}

function isToday(date) {
  return (
    date.getFullYear() === TODAY.getFullYear() &&
    date.getMonth() === TODAY.getMonth() &&
    date.getDate() === TODAY.getDate()
  );
}

// events for a given lundi..vendredi index (0-4) within a specific week
function scheduleForDayInWeek(dayIdx, weekOffset) {
  const dates = weekDates(weekOffset);
  const date = dates[dayIdx + 1]; // dates[0] is dimanche
  if (!hasClasses(date)) return [];
  if (dayIdx === 0 && isHolidayMonday(date)) return [];
  return SCHEDULE.filter((e) => e.day === dayIdx);
}

// course codes present on an arbitrary calendar date (used by the Mois view)
function eventCodesForDate(date) {
  const wd = date.getDay(); // 0=dim .. 6=sam
  if (wd === 0 || wd === 6) return [];
  if (!hasClasses(date)) return [];
  if (wd === 1) return isHolidayMonday(date) ? [] : ["MAT210", "LOG121"];
  if (wd === 2) return [];
  if (wd === 3) return ["ING150", "LOG121"];
  if (wd === 4) return [];
  if (wd === 5) return ["ING150", "MAT210"];
  return [];
}

function fmtHour(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}


function weightedAverage(gradeItems) {
  const graded = gradeItems.filter((gi) => gi.score != null && !gi.ignored);
  const totalWeight = graded.reduce((s, gi) => s + (Number(gi.weight) || 0), 0);
  if (totalWeight === 0) return null;
  const earned = graded.reduce((s, gi) => {
    const pct = gi.outOf ? Number(gi.score) / Number(gi.outOf) : 0;
    return s + pct * (Number(gi.weight) || 0);
  }, 0);
  return (earned / totalWeight) * 100;
}

// Note du cours : valeurs affichées par ÉTSMobile si fournies, sinon calculées.
function coursePct(c) {
  if (c.noteOverride) return (c.noteOverride.pts / c.noteOverride.total) * 100;
  return weightedAverage(c.gradeItems);
}

// ---------- gauge ----------
function Gauge({ value, size = 84, centerText, avg }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const pct = value == null ? 0 : Math.max(0, Math.min(100, value));
  const ringColor = value == null ? C.ringTrack : pct >= 80 ? C.green : pct >= 60 ? C.yellow : "#FF3B30";
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.ringTrack} strokeWidth="6" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={ringColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
      {avg != null && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r - 9}
          fill="none"
          stroke="#EF4444"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * (r - 9)}
          strokeDashoffset={2 * Math.PI * (r - 9) * (1 - Math.max(0, Math.min(100, avg)) / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={C.text}
        fontWeight="600"
        fontSize={size * 0.22}
      >
        {centerText}
      </text>
    </svg>
  );
}

function CalendarIcon({ color = "#9A9AA0", size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SocialIcon({ children }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

const NAVY = "#1B3D63";

function FacebookIcon() {
  return (
    <SocialIcon>
      <svg width="30" height="30" viewBox="0 0 24 24" fill={"#FFFFFF"}>
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
      </svg>
    </SocialIcon>
  );
}

function InstagramIcon() {
  return (
    <SocialIcon>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={"#FFFFFF"} strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill={"#FFFFFF"} stroke="none" />
      </svg>
    </SocialIcon>
  );
}

function GithubIcon() {
  return (
    <SocialIcon>
      <svg width="30" height="30" viewBox="0 0 24 24" fill={"#FFFFFF"}>
        <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.6 0 3.8-2.4 4.6-4.6 4.9.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
      </svg>
    </SocialIcon>
  );
}

function MailIcon() {
  return (
    <SocialIcon>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={"#FFFFFF"} strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </svg>
    </SocialIcon>
  );
}

function DiscordIcon() {
  return (
    <SocialIcon>
      <svg width="32" height="32" viewBox="0 0 24 24" fill={"#FFFFFF"}>
        <path d="M18.9 6.4A15.4 15.4 0 0 0 15.2 5c-.2.4-.4.8-.6 1.2a14.3 14.3 0 0 0-4.3 0A8.6 8.6 0 0 0 9.7 5a15.4 15.4 0 0 0-3.7 1.4C3.6 10 3 13.6 3.3 17.1a15.6 15.6 0 0 0 4.6 2.3c.4-.5.7-1 1-1.6-.6-.2-1.1-.5-1.6-.8l.4-.3a11 11 0 0 0 9 0l.4.3c-.5.3-1 .6-1.6.8.3.6.6 1.1 1 1.6a15.5 15.5 0 0 0 4.6-2.3c.4-4-.6-7.6-2.2-10.7ZM9.7 14.9c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm4.7 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
      </svg>
    </SocialIcon>
  );
}

// ---------- éléments communs (écrans plein écran) ----------
const NAV_H = 68;
const U = {
  page: "#111113",
  bar: "#17171A",
  card: "#242426",
  text: "#EDEDED",
  line: "#2A2A2D",
  red: "#F23F4C",
  font: "Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
};

function Screen({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: U.page,
        color: U.text,
        fontFamily: U.font,
        paddingBottom: `calc(${NAV_H}px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function AppBar({ title, children, sticky = true }) {
  return (
    <div
      style={{
        backgroundColor: U.bar,
        paddingTop: "env(safe-area-inset-top, 0px)",
        flexShrink: 0,
        ...(sticky ? { position: "sticky", top: 0, zIndex: 20 } : {}),
      }}
    >
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 17px" }}>
        <div style={{ fontSize: 28, lineHeight: "34px", color: U.text }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>{children}</div>
      </div>
    </div>
  );
}

const iconBtn = { background: "none", border: "none", padding: 0, display: "flex", cursor: "pointer" };

function ShareIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E6E6E6">
      <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
    </svg>
  );
}
function EventIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E6E6E6">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  );
}
function SettingsIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E6E6E6">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}
function HistoryIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E6E6E6">
      <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
  );
}
function ChevronSide({ dir = "left" }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

// Progression de la session d'automne 2026 (31 août → 18 décembre)
function sessionProgress() {
  const start = new Date(2026, 7, 31).getTime();
  const end = new Date(2026, 11, 18).getTime();
  const p = ((Date.now() - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, p));
}

function homeCourseName(code) {
  const c = seedCourses().find((x) => x.code === code && x.term === "Automne 2026");
  return c ? c.name : "";
}

function HomeCard({ title, children, style }) {
  return (
    <div style={{ backgroundColor: U.card, borderRadius: 20, padding: "17px 19px 20px", marginBottom: 8, ...style }}>
      <div style={{ fontSize: 24, lineHeight: "32px", color: U.text, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function NoteChip({ course, onOpen }) {
  const pct = coursePct(course);
  const label = course.cote || (pct == null ? "—" : `${Math.round(pct)} %`);
  return (
    <button
      onClick={() => onOpen(course.id)}
      style={{
        width: 71,
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
        textAlign: "center",
        borderRadius: "5px 5px 14px 14px",
        overflow: "hidden",
        boxShadow: "0 2px 5px rgba(0,0,0,0.35)",
        fontFamily: "Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ backgroundColor: "#F04050", color: "#FFFFFF", fontSize: 16, lineHeight: "29px", height: 29 }}>{course.code}</div>
      <div style={{ backgroundColor: "#2B2B2D", color: "#B9B9BC", fontSize: 26, lineHeight: "42px", height: 42 }}>{label}</div>
    </button>
  );
}

function AccueilScreen({ courses, onOpenCourse }) {
  const dow = TODAY.getDay();
  const todayEvents = (dow >= 1 && dow <= 5 ? scheduleForDayInWeek(dow - 1, CURRENT_WEEK) : [])
    .slice()
    .sort((a, b) => a.start - b.start);
  const progress = sessionProgress();
  const termCourses = courses.filter((c) => c.term === "Automne 2026");

  return (
    <Screen>
      <AppBar title="Accueil">
        <button style={iconBtn} aria-label="Historique">
          <HistoryIcon />
        </button>
      </AppBar>

      <div style={{ padding: "8px 8px 16px" }}>
        {/* ApplETS */}
        <div style={{ backgroundColor: "#1B3A63", borderRadius: 20, padding: "17px 19px 18px", marginBottom: 8 }}>
          <div style={{ fontSize: 24, lineHeight: "32px", color: U.text, marginBottom: 6 }}>ApplETS</div>
          <p style={{ fontSize: 18, lineHeight: "21px", color: "#F2F5F9", margin: "0 0 14px" }}>
            ÉTSMobile a été conçue par le club ApplETS. Supportez-nous en aimant notre page Facebook, en contribuant sur GitHub
            ou en nous faisant part de vos commentaires par courriel.
          </p>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            <FacebookIcon />
            <InstagramIcon />
            <GithubIcon />
            <MailIcon />
            <DiscordIcon />
          </div>
        </div>

        {/* Horaire du jour */}
        <HomeCard title="Horaire" style={{ paddingBottom: 24 }}>
          {todayEvents.length === 0 ? (
            <p style={{ fontSize: 16, color: "#CFCFCF", textAlign: "center", margin: "18px 0 6px" }}>Aucun évènement à l'horaire.</p>
          ) : (
            <div style={{ marginTop: 14 }}>
              {todayEvents.map((e, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", padding: "0 6px 0 14px" }}>
                    <div style={{ width: 52, flexShrink: 0, fontSize: 16, lineHeight: "20px", color: U.text }}>
                      <div>{fmtHour(e.start)}</div>
                      <div style={{ height: 22 }} />
                      <div>{fmtHour(e.end)}</div>
                    </div>
                    <div style={{ width: 2, height: 58, borderRadius: 1, backgroundColor: HOME_COLORS[e.code] || U.red, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0, margin: "0 8px 0 24px", fontSize: 18, lineHeight: "21px" }}>
                      <div style={{ fontWeight: 600, color: "#F4F4F4" }}>{e.section}</div>
                      <div style={{ color: "#E4E4E4" }}>{homeCourseName(e.code)}</div>
                      <div style={{ color: "#E4E4E4" }}>{ACTIVITY_LABEL[e.type] || e.type}</div>
                    </div>
                    <div style={{ fontSize: 16, color: "#E0E0E0", flexShrink: 0 }}>{e.room}</div>
                  </div>
                  {i < todayEvents.length - 1 && <div style={{ height: 1, backgroundColor: "#55555A", margin: "14px 14px 16px" }} />}
                </div>
              ))}
            </div>
          )}
        </HomeCard>

        {/* Progression */}
        <HomeCard title="Progression de la session">
          <div style={{ position: "relative", height: 31, borderRadius: 16, backgroundColor: "#5F6368", overflow: "hidden", marginTop: 4 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`, backgroundColor: "#43A047" }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#FFFFFF",
              }}
            >
              {Math.round(progress)} %
            </div>
          </div>
        </HomeCard>

        {/* Notes */}
        <HomeCard title="Notes">
          <div style={{ display: "flex", gap: 9, padding: "4px 4px 0", flexWrap: "wrap" }}>
            {termCourses.map((c) => (
              <NoteChip key={c.id} course={c} onOpen={onOpenCourse} />
            ))}
          </div>
        </HomeCard>
      </div>
    </Screen>
  );
}

function GridIcon({ color = "#9A9AA0", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function ClockIcon({ color = "#9A9AA0", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function GraduationCapIcon({ color = "#9A9AA0", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 3 1 8.5 12 14l9-4.6V15h2V8.5L12 3Z" />
      <path d="M5 11.5V16c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5v-4.5l-7 3.6-7-3.6Z" opacity="0.85" />
    </svg>
  );
}

const STUDENT = {
  name: "Daniel Sébastien Dezemma",
  program: "Baccalauréat en génie logiciel",
  codePermanent: "DEZD80310401",
  codeUniversel: "AV53760",
  solde: "0,00$",
  completion: 4,
  programCode: "7084",
  moyenne: "2,30/4,30",
  creditsCompletes: 5,
  creditsInscrits: 12,
  coursReussis: 4,
  coursEchoues: 0,
  coursEquivalence: 0,
  statut: "actif",
};

function ProfilRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
      <span style={{ fontSize: 15, color: C.textDim }}>{label}</span>
      <span style={{ fontSize: 15, color: C.text }}>{value}</span>
    </div>
  );
}

function ProfilSection() {
  return (
    <div>
      <div style={{ backgroundColor: C.card, borderRadius: 16, padding: "18px 16px", textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 19, fontWeight: 700, color: C.text }}>{STUDENT.name}</div>
        <div style={{ fontSize: 15, color: C.textDim, marginTop: 4 }}>{STUDENT.program}</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "stretch" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 15, color: C.text, marginBottom: 4 }}>Code permanent</div>
            <div style={{ fontSize: 15, color: C.textDim, marginBottom: 14 }}>{STUDENT.codePermanent}</div>
            <div style={{ fontSize: 15, color: C.text, marginBottom: 4 }}>Code universel</div>
            <div style={{ fontSize: 15, color: C.textDim }}>{STUDENT.codeUniversel}</div>
          </div>
          <div style={{ backgroundColor: "#2F7A3E", borderRadius: 16, padding: "10px 12px" }}>
            <div style={{ fontSize: 12, color: C.text, marginBottom: 2 }}>Votre solde</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{STUDENT.solde}</div>
          </div>
        </div>
        <div style={{ flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 15, color: C.text, textAlign: "center", marginBottom: 12 }}>Complétion du programme</div>
          <Gauge value={STUDENT.completion} size={90} centerText={`${STUDENT.completion}%`} />
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: C.border, marginBottom: 18 }} />

      <h3 style={{ fontSize: 18, fontWeight: 700, color: C.red, margin: "0 0 6px" }}>{STUDENT.program}</h3>
      <div>
        <ProfilRow label="Code" value={STUDENT.programCode} />
        <ProfilRow label="Moyenne" value={STUDENT.moyenne} />
        <ProfilRow label="Crédits complétés" value={STUDENT.creditsCompletes} />
        <ProfilRow label="Crédits inscrits" value={STUDENT.creditsInscrits} />
        <ProfilRow label="Cours réussis" value={STUDENT.coursReussis} />
        <ProfilRow label="Cours échoués" value={STUDENT.coursEchoues} />
        <ProfilRow label="Cours d'équivalence" value={STUDENT.coursEquivalence} />
        <ProfilRow label="Statut" value={STUDENT.statut} />
      </div>

      <div style={{ height: 1, backgroundColor: C.border, margin: "18px 0" }} />

      <h3 style={{ fontSize: 18, fontWeight: 700, color: C.red, margin: 0 }}>Autres Programmes</h3>
    </div>
  );
}

function NotesSection({ courses, termsInOrder, onOpenCourse }) {
  return (
    <>
      {termsInOrder.map((term) => {
        const termCourses = courses.filter((c) => c.term === term);
        return (
          <section key={term} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.red, margin: 0 }}>{term}</h2>
              <CalendarIcon color={C.muted} />
            </div>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap", padding: "0 2px" }}>
              {termCourses.map((c) => (
                <NoteChip key={c.id} course={c} onOpen={onOpenCourse} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

function HamburgerIcon({ color = "#9A9AA0", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function MenuIconWrap({ children }) {
  return (
    <div style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {children}
    </div>
  );
}

function AboutAvatar() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: NAVY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>A</span>
    </div>
  );
}

function PencilIcon({ color = "#D1D1D6", size = 22 }) {
  return (
    <MenuIconWrap>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16.5V20h3.5L18 9.5l-3.5-3.5L4 16.5Z" />
        <path d="M13 7.5 16.5 11" />
      </svg>
    </MenuIconWrap>
  );
}

function PeopleIcon({ color = "#D1D1D6", size = 22 }) {
  return (
    <MenuIconWrap>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8.5" cy="8" r="3" />
        <path d="M2.5 19c0-3 2.7-5 6-5s6 2 6 5" />
        <circle cx="16.5" cy="8.5" r="2.3" />
        <path d="M15 14.2c2.6.3 4.5 2 4.5 4.3" />
      </svg>
    </MenuIconWrap>
  );
}

function CodeIcon({ color = "#D1D1D6", size = 22 }) {
  return (
    <MenuIconWrap>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 6 3 12 9 18" />
        <polyline points="15 6 21 12 15 18" />
      </svg>
    </MenuIconWrap>
  );
}

function ShieldIcon({ color = "#D1D1D6", size = 22 }) {
  return (
    <MenuIconWrap>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
        <line x1="12" y1="10.5" x2="12" y2="14.5" />
        <circle cx="12" cy="8" r="0.6" fill={color} stroke="none" />
      </svg>
    </MenuIconWrap>
  );
}

function ChatIcon({ color = "#D1D1D6", size = 22 }) {
  return (
    <MenuIconWrap>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5h13v8H8l-3.5 3V13H3V5Z" />
        <path d="M9 16h8l3 3v-7h-3" />
      </svg>
    </MenuIconWrap>
  );
}

function GearIcon({ color = "#D1D1D6", size = 22 }) {
  return (
    <MenuIconWrap>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
      </svg>
    </MenuIconWrap>
  );
}

function LogoutIcon({ color = "#D1D1D6", size = 22 }) {
  return (
    <MenuIconWrap>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
        <polyline points="14 15 19 10 14 5" />
        <line x1="19" y1="10" x2="8" y2="10" />
      </svg>
    </MenuIconWrap>
  );
}

function GlobeSocialIcon() {
  return (
    <SocialIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <path d="M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9S9.5 5.5 12 3Z" />
      </svg>
    </SocialIcon>
  );
}

function YoutubeSocialIcon() {
  return (
    <SocialIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={NAVY}>
        <rect x="2" y="5.5" width="20" height="13" rx="4" fill="none" stroke={NAVY} strokeWidth="2" />
        <path d="M10 9.5v5l4.5-2.5-4.5-2.5Z" />
      </svg>
    </SocialIcon>
  );
}

function BackHeader({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 24, paddingBottom: 20 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>{title}</h1>
    </div>
  );
}

function AboutPage({ onBack }) {
  return (
    <div style={{ backgroundColor: NAVY, minHeight: "100%", margin: "0 -16px", padding: "0 16px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 24, paddingBottom: 20 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 style={{ fontSize: 21, fontWeight: 700, color: C.text, margin: 0 }}>À propos d'ApplETS</h1>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
        <span style={{ fontSize: 64, fontWeight: 800, color: C.text }}>A</span>
      </div>

      <p style={{ fontSize: 16, color: "#E8EEF5", lineHeight: 1.5 }}>
        ÉTSMobile a été réalisée par le club scientifique ApplETS de l'École de technologie supérieure.
      </p>
      <p style={{ fontSize: 16, color: "#E8EEF5", lineHeight: 1.5 }}>
        ApplETS se veut, avant tout, un regroupement d'étudiants qui partagent un intérêt commun pour le
        domaine des télécommunications et des applications mobiles. La mission d'ApplETS est de former les
        étudiants au développement mobile et de promouvoir la production d'applications mobiles au sein de
        la communauté étudiante.
      </p>
      <p style={{ fontSize: 16, color: "#E8EEF5", lineHeight: 1.5, marginBottom: 20 }}>Suivez-nous sur :</p>

      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        <GlobeSocialIcon />
        <GithubIcon />
        <FacebookIcon />
        <YoutubeSocialIcon />
        <DiscordIcon />
      </div>
    </div>
  );
}

function SimplePlaceholderPage({ title, paragraphs, onBack }) {
  return (
    <div>
      <BackHeader title={title} onBack={onBack} />
      {paragraphs.map((p, i) => (
        <p key={i} style={{ fontSize: 15, color: C.textDim, lineHeight: 1.6, marginBottom: 14 }}>
          {p}
        </p>
      ))}
    </div>
  );
}

function ChevronDownIcon({ color = "#9A9AA0", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ThemeBadgeIcon() {
  return (
    <MenuIconWrap>
      <svg width="26" height="26" viewBox="0 0 24 24">
        <polygon
          points="12 1 15 3 18.5 3 20 6 22.5 8 22 11.5 23 15 20.5 17.5 20 21 16.5 21.5 13.5 23.5 10.5 22 7.5 23 5 20.5 4.5 17 3.5 15 1.5 12 3"
          fill="#D1D1D6"
        />
        <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1A1A1C">
          A
        </text>
      </svg>
    </MenuIconWrap>
  );
}

function SettingsRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0" }}>
      {icon}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, color: C.text }}>{label}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 2 }}>{value}</div>
      </div>
      <ChevronDownIcon />
    </div>
  );
}

function SettingsPage({ onBack }) {
  return (
    <div>
      <BackHeader title="Paramètres" onBack={onBack} />
      <h3 style={{ fontSize: 17, fontWeight: 600, color: C.red, margin: "8px 0 4px" }}>Affichage</h3>
      <SettingsRow icon={<ThemeBadgeIcon />} label="Thème" value="Système" />
      <div style={{ height: 1, backgroundColor: C.border, margin: "12px 0 20px" }} />
      <h3 style={{ fontSize: 17, fontWeight: 600, color: C.red, margin: "8px 0 4px" }}>Divers</h3>
      <SettingsRow icon={<MenuIconWrap><GlobeIconLine /></MenuIconWrap>} label="Langue" value="Français" />
    </div>
  );
}

function GlobeIconLine({ color = "#D1D1D6", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9S9.5 5.5 12 3Z" />
    </svg>
  );
}

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 50,
      }}
    >
      <div style={{ backgroundColor: C.card, borderRadius: 20, padding: 24, maxWidth: 360, width: "100%" }}>
        <h3 style={{ fontSize: 21, fontWeight: 700, color: C.red, margin: "0 0 14px" }}>Se déconnecter</h3>
        <p style={{ fontSize: 15, color: C.text, lineHeight: 1.5, margin: "0 0 24px" }}>
          Êtes-vous certain de vouloir vous déconnecter?
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 28 }}>
          <button
            onClick={onConfirm}
            style={{ background: "none", border: "none", color: C.red, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            Oui
          </button>
          <button
            onClick={onCancel}
            style={{ background: "none", border: "none", color: C.red, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            Non
          </button>
        </div>
      </div>
    </div>
  );
}

const PLUS_ITEMS = [
  { key: "about", label: "À propos d'ApplETS", icon: <AboutAvatar /> },
  { key: "rate", label: "Évaluez-nous!", icon: <PencilIcon /> },
  { key: "contrib", label: "Contributeurs", icon: <PeopleIcon /> },
  { key: "licenses", label: "Licences des logiciels libres", icon: <CodeIcon /> },
  { key: "privacy", label: "Politique de confidentialité", icon: <ShieldIcon /> },
  { key: "help", label: "Besoin d'aide?", icon: <ChatIcon /> },
  { key: "settings", label: "Paramètres", icon: <GearIcon /> },
  { key: "logout", label: "Se déconnecter", icon: <LogoutIcon /> },
];

const PLUS_PLACEHOLDER_CONTENT = {
  rate: {
    title: "Évaluez-nous!",
    paragraphs: [
      "Si vous appréciez ÉTSMobile, prenez un instant pour nous laisser une note sur l'App Store ou le Google Play Store — ça aide vraiment le club ApplETS!",
    ],
  },
  contrib: {
    title: "Contributeurs",
    paragraphs: [
      "ÉTSMobile est développée et maintenue par les membres bénévoles du club ApplETS de l'ÉTS.",
      "Merci à tous ceux qui ont contribué au code, au design et aux tests au fil des sessions.",
    ],
  },
  licenses: {
    title: "Licences des logiciels libres",
    paragraphs: [
      "ÉTSMobile utilise plusieurs bibliothèques open source pour fonctionner.",
      "La liste complète des licences est disponible dans le dépôt GitHub public du projet.",
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    paragraphs: [
      "Vos données académiques (notes, horaire, profil étudiant) sont récupérées directement depuis les systèmes de l'ÉTS et ne sont partagées avec aucun tiers.",
      "Aucune donnée personnelle n'est vendue ou utilisée à des fins publicitaires.",
    ],
  },
  help: {
    title: "Besoin d'aide?",
    paragraphs: [
      "Pour toute question sur l'application, contactez le club ApplETS par courriel ou via Discord.",
      "Pour les questions académiques (notes, horaire, dossier étudiant), contactez directement le registrariat de l'ÉTS.",
    ],
  },
};

function PlusSection({ onNavigate }) {
  return (
    <div>
      {PLUS_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "18px 0",
            width: "100%",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          {item.icon}
          <span style={{ fontSize: 17, color: C.text }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function BuildingIcon({ color = "#9A9AA0", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8 2 8" />
      <line x1="4" y1="8" x2="4" y2="19" />
      <line x1="9" y1="8" x2="9" y2="19" />
      <line x1="15" y1="8" x2="15" y2="19" />
      <line x1="20" y1="8" x2="20" y2="19" />
      <line x1="2" y1="21" x2="22" y2="21" />
    </svg>
  );
}

function EtsTileIconWrap({ children }) {
  return (
    <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {children}
    </div>
  );
}

function EtsShieldIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="40" height="40" viewBox="0 0 24 24" fill={C.red}>
        <path d="M12 2 4 5v6c0 5 3.4 8.4 8 9.9 4.6-1.5 8-4.9 8-9.9V5l-8-3Z" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsTextLogo({ text, size = 15 }) {
  return (
    <EtsTileIconWrap>
      <span style={{ color: C.red, fontWeight: 800, fontSize: size, textAlign: "center", lineHeight: 1.05 }}>{text}</span>
    </EtsTileIconWrap>
  );
}

function EtsBookIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H19v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z" />
        <line x1="8" y1="7" x2="15" y2="7" />
        <line x1="8" y1="10.5" x2="15" y2="10.5" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsNewsIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h13v16H6a2 2 0 0 1-2-2V4Z" />
        <path d="M17 8h3v10a2 2 0 0 1-2 2h-1" />
        <line x1="7" y1="8" x2="13" y2="8" />
        <line x1="7" y1="11" x2="13" y2="11" />
        <line x1="7" y1="14" x2="11" y2="14" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsContactIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="14" height="18" rx="1.5" />
        <circle cx="11" cy="9.5" r="2.3" />
        <path d="M7.5 16.5c0-2 1.6-3 3.5-3s3.5 1 3.5 3" />
        <line x1="21" y1="6" x2="21" y2="8" />
        <line x1="21" y1="11" x2="21" y2="13" />
        <line x1="21" y1="16" x2="21" y2="18" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsPrinterIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8V3h12v5" />
        <rect x="3" y="8" width="18" height="8" rx="1.5" />
        <rect x="6" y="14" width="12" height="7" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsSuitPersonIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill={C.red}>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7v1H4v-1Z" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsIdCardIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <circle cx="8" cy="12" r="2.2" />
        <line x1="13" y1="10" x2="18" y2="10" />
        <line x1="13" y1="13.5" x2="18" y2="13.5" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsMoneyBagIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill={C.red}>
        <path d="M9.5 2h5l-1 3h-3l-1-3Z" />
        <path d="M6 9c0-1.7 2.7-3 6-3s6 1.3 6 3c0 6-3 12-6 12S6 15 6 9Z" />
        <text x="12" y="14" textAnchor="middle" fontSize="7" fill={C.card} fontWeight="700">$</text>
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsHandshakeIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="40" height="40" viewBox="0 0 24 24" fill={C.red}>
        <path d="M2 8.5 6 6l4.5 4-2 2-3-1.7L2 13Z" />
        <path d="M22 8.5 18 6l-4.5 4 2 2 3-1.7 3.5 2.7Z" />
        <path d="M8.5 10 11 12.3c.7.6 1.9.6 2.6 0L16 10l-4-2-3.5 2Z" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsRocketIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 15c1-3 2-6 4.5-8 1.5 2.5 1.5 6-1 8.5-1.2 1.2-3 1-3.5-.5Z" fill={C.red} stroke="none" />
        <path d="M8.5 13.5 7 15" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsGradPeopleIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="40" height="40" viewBox="0 0 24 24" fill={C.red}>
        <path d="M12 3 3 7l9 4 9-4-9-4Z" />
        <circle cx="8.5" cy="16" r="2.6" />
        <circle cx="15.5" cy="16" r="2.6" />
        <path d="M4 22c0-2.6 2-4.2 4.5-4.2S13 19.4 13 22" />
        <path d="M11 22c0-2.6 2-4.2 4.5-4.2S20 19.4 20 22" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsCoffeeIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
        <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
        <line x1="7" y1="5" x2="7" y2="7" />
        <line x1="10" y1="4.5" x2="10" y2="7" />
      </svg>
    </EtsTileIconWrap>
  );
}

function EtsGCircleIcon() {
  return (
    <EtsTileIconWrap>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.4">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M15 12h-3v2.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </EtsTileIconWrap>
  );
}

const ETS_ITEMS = [
  { key: "securite", label: "Sécurité", icon: <EtsShieldIcon /> },
  { key: "monets", label: "MonÉTS", icon: <EtsTextLogo text="MonÉTS" size={13} /> },
  { key: "bibliotech", label: "Bibliotech", icon: <EtsBookIcon /> },
  { key: "nouvelles", label: "Nouvelles", icon: <EtsNewsIcon /> },
  { key: "bottin", label: "Bottin", icon: <EtsContactIcon /> },
  { key: "moodle", label: "Moodle", icon: <GraduationCapIcon color={C.red} size={38} /> },
  { key: "horairets", label: "HorairÉTS", icon: <CalendarIcon color={C.red} size={38} /> },
  { key: "gus", label: "GUS", icon: <EtsGCircleIcon /> },
  { key: "papercut", label: "PaperCut", icon: <EtsPrinterIcon /> },
  { key: "aeets", label: "AÉÉTS", icon: <EtsTextLogo text="AÉÉTS" /> },
  { key: "pub100", label: "Pub 100 Génies", icon: <EtsTextLogo text="100 GÉNIES" size={11} /> },
  { key: "stages", label: "Stages et emplois", icon: <EtsSuitPersonIcon /> },
  { key: "eportfolio", label: "ePortfolio", icon: <EtsIdCardIcon /> },
  { key: "ebourses", label: "eBourses", icon: <EtsMoneyBagIcon /> },
  { key: "appui", label: "Appui réussite", icon: <EtsHandshakeIcon /> },
  { key: "nimbus", label: "Nimbus", icon: <EtsRocketIcon /> },
  { key: "sportif", label: "Centre sportif", icon: <EtsTextLogo text="CENTRE SPORTIF ÉTS" size={10} /> },
  { key: "etudiants", label: "Étudiants actuels", icon: <EtsGradPeopleIcon /> },
  { key: "cafe", label: "Cafe sans filtre", icon: <EtsCoffeeIcon /> },
];

function ExportIcon({ color = "#D1D1D6", size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <polyline points="8 7 12 3 16 7" />
      <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 50,
        height: 30,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        padding: 3,
        backgroundColor: on ? "#7A2620" : "#3A3A3D",
        display: "flex",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background-color 0.2s ease",
      }}
    >
      <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: on ? C.red : "#B8B8BC" }} />
    </button>
  );
}

function ExportModal({ onCancel, onExport }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 50,
      }}
    >
      <div style={{ backgroundColor: C.card, borderRadius: 20, padding: 24, maxWidth: 360, width: "100%" }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 16px", lineHeight: 1.25 }}>
          Exporter vers le calendrier
        </h3>
        <p style={{ fontSize: 15, color: C.textDim, lineHeight: 1.5, margin: "0 0 22px" }}>
          Vers quel calendrier voulez-vous exporter cet événement?
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 10,
            borderBottom: `1px solid ${C.muted}`,
            marginBottom: 26,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Jours fériés au Canada</span>
          <ChevronDownIcon color={C.text} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 28 }}>
          <button
            onClick={onCancel}
            style={{ background: "none", border: "none", color: C.red, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            Annuler
          </button>
          <button
            onClick={onExport}
            style={{ background: "none", border: "none", color: C.red, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            Exporter
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsSheet({ showToday, onToggleToday, format, onSetFormat, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: C.bg,
          borderRadius: "24px 24px 0 0",
          width: "100%",
          paddingBottom: 32,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.muted }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, textAlign: "center", margin: "14px 0 20px" }}>
          Paramètres de l'horaire
        </h2>
        <div style={{ padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
            <span style={{ fontSize: 16, color: C.text }}>Afficher le bouton Aujourd'hui</span>
            <Toggle on={showToday} onToggle={onToggleToday} />
          </div>

          <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginTop: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.red, textAlign: "center", marginBottom: 12 }}>
              Format du calendrier
            </div>
            <div style={{ height: 1, backgroundColor: C.border, marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 10 }}>
              {["Mois", "Semaine", "Jour"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => onSetFormat(opt)}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 10,
                    border: `1px solid ${format === opt ? C.red : C.border}`,
                    backgroundColor: format === opt ? C.red : "transparent",
                    color: C.text,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HORAIRE_START = 8;
const HORAIRE_END = 22;
const HOUR_PX = 40;

const MONTH_NAMES = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function buildMonthGrid(year, monthIdx) {
  const firstOfMonth = new Date(year, monthIdx, 1);
  const startOffset = firstOfMonth.getDay(); // 0=dim
  const gridStart = new Date(year, monthIdx, 1 - startOffset);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }
  return cells;
}

const GUTTER = 47;
const GRID_TOP = 20;

function WeekView({ weekOffset, setWeekOffset, bar }) {
  const dates = weekDates(weekOffset);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const label = `Du ${dates[0].getDate()} ${MONTH_NAMES[dates[0].getMonth()]} au ${dates[6].getDate()} ${MONTH_NAMES[dates[6].getMonth()]}`;
  const hours = [];
  for (let h = HORAIRE_START; h <= HORAIRE_END; h++) hours.push(h);
  const gridHeight = GRID_TOP + (HORAIRE_END - HORAIRE_START) * HOUR_PX + 24;

  const nowH = now.getHours() + now.getMinutes() / 60;
  const showNow = weekOffset === CURRENT_WEEK && nowH >= HORAIRE_START && nowH <= HORAIRE_END;
  const yOf = (h) => GRID_TOP + (h - HORAIRE_START) * HOUR_PX;

  return (
    <div>
      <div style={{ position: "sticky", top: 0, zIndex: 20, backgroundColor: U.bar, borderBottom: "1.5px solid #4B4B50" }}>
        {bar}
        <div style={{ height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 0 12px" }}>
          <button onClick={() => setWeekOffset((w) => w - 1)} style={iconBtn} aria-label="Semaine précédente">
            <ChevronSide dir="left" />
          </button>
          <span style={{ fontSize: 18, color: "#E8E8E8" }}>{label}</span>
          <button onClick={() => setWeekOffset((w) => w + 1)} style={iconBtn} aria-label="Semaine suivante">
            <ChevronSide dir="right" />
          </button>
        </div>
        <div style={{ display: "flex", paddingLeft: GUTTER, paddingBottom: 6 }}>
          {dates.slice(1, 6).map((d, i) => {
            const today = isToday(d);
            return (
              <div key={i} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: 31,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: today ? "#8F2A32" : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    lineHeight: "21px",
                    color: "#F2F2F2",
                  }}
                >
                  <div>{WEEK_SHORT[i + 1][0].toUpperCase()}</div>
                  <div>{d.getDate()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ backgroundColor: "#121214" }}>
        <div style={{ position: "relative", display: "flex", height: gridHeight }}>
          <div style={{ width: GUTTER, flexShrink: 0, position: "relative" }}>
            {hours.map((h) => (
              <div
                key={h}
                style={{
                  position: "absolute",
                  top: yOf(h) - 8,
                  left: 0,
                  width: GUTTER - 8,
                  textAlign: "right",
                  fontSize: 17,
                  lineHeight: "22px",
                  color: "#E6E6E6",
                  overflowWrap: "anywhere",
                }}
              >
                {h}:00
              </div>
            ))}
          </div>

          <div style={{ flex: 1, position: "relative", display: "flex" }}>
            {hours.map((h) => (
              <div key={h} style={{ position: "absolute", left: 0, right: 0, top: yOf(h), borderTop: `1px solid ${U.line}` }} />
            ))}
            {[0, 1, 2, 3, 4].map((dayIdx) => (
              <div key={dayIdx} style={{ flex: 1, position: "relative", borderLeft: `1px solid ${U.line}` }}>
                {scheduleForDayInWeek(dayIdx, weekOffset).map((e, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 1,
                      right: 1,
                      top: yOf(e.start),
                      height: (e.end - e.start) * HOUR_PX - 2,
                      backgroundColor: SCHED_COLORS[e.code] || U.red,
                      borderRadius: 8,
                      padding: "6px 6px",
                      overflow: "hidden",
                      color: "#FFFFFF",
                      fontSize: 17,
                      lineHeight: "21px",
                      wordBreak: "break-all",
                    }}
                  >
                    <div>{e.code}</div>
                    <div>{e.room}</div>
                    <div>{e.type}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {showNow && (
            <div style={{ position: "absolute", left: GUTTER + 5, right: 0, top: yOf(nowH), display: "flex", alignItems: "center", pointerEvents: "none" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#E0E0E0", marginLeft: -5, marginTop: -1 }} />
              <div style={{ flex: 1, height: 2, backgroundColor: "#E6E6E6", marginTop: -1 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HoraireSection() {
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showToday, setShowToday] = useState(true);
  const [calendarFormat, setCalendarFormat] = useState("Semaine");
  const [weekOffset, setWeekOffset] = useState(CURRENT_WEEK);
  const [selectedDay, setSelectedDay] = useState(TODAY.getDay()); // index into weekDates(): 0=dim .. 6=sam (aujourd'hui)
  const [monthCursor, setMonthCursor] = useState({ year: TODAY.getFullYear(), month: TODAY.getMonth() });

  const hours = [];
  for (let h = HORAIRE_START; h <= HORAIRE_END; h++) hours.push(h);
  const gridHeight = (HORAIRE_END - HORAIRE_START) * HOUR_PX;
  const monthCells = buildMonthGrid(monthCursor.year, monthCursor.month);

  const dates = weekDates(weekOffset);
  const rangeLabel = `Du ${dates[0].getDate()} ${MONTH_SHORT[dates[0].getMonth()]} au ${dates[6].getDate()} ${MONTH_SHORT[dates[6].getMonth()]}`;

  const stepDay = (delta) => {
    setSelectedDay((d) => {
      let next = d + delta;
      if (next < 0) {
        setWeekOffset((w) => w - 1);
        next = 6;
      } else if (next > 6) {
        setWeekOffset((w) => w + 1);
        next = 0;
      }
      return next;
    });
  };

  const Legend = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
      {Object.entries(SCHED_COLORS).map(([code, color]) => {
        const section = SCHEDULE.find((e) => e.code === code)?.section || code;
        return (
          <div key={code} style={{ display: "flex", alignItems: "center", gap: 6, backgroundColor: C.card, borderRadius: 999, padding: "6px 10px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color }} />
            <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{section}</span>
          </div>
        );
      })}
    </div>
  );

  const barIcons = (sticky) => (
    <AppBar title="Horaire" sticky={sticky}>
      <button onClick={() => setShowExport(true)} style={iconBtn} aria-label="Exporter">
        <ShareIcon />
      </button>
      <button style={iconBtn} aria-label="Calendrier">
        <EventIcon />
      </button>
      <button onClick={() => setShowSettings(true)} style={iconBtn} aria-label="Paramètres">
        <SettingsIcon />
      </button>
    </AppBar>
  );

  return (
    <Screen>
      {calendarFormat === "Semaine" ? (
        <WeekView weekOffset={weekOffset} setWeekOffset={setWeekOffset} bar={barIcons(false)} />
      ) : (
        <>
        {barIcons(true)}
        <div style={{ padding: "16px 16px 24px" }}>
          {calendarFormat === "Jour" ? (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <button onClick={() => stepDay(-1)} style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}>
              ‹
            </button>
            <span style={{ fontSize: 20, color: C.text }}>
              {DAY_NAMES_FULL[selectedDay]} {dates[selectedDay].getDate()} {MONTH_SHORT[dates[selectedDay].getMonth()]}
            </span>
            <button onClick={() => stepDay(1)} style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}>
              ›
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {dates.map((d, i) => {
              const count = i >= 1 && i <= 5 ? scheduleForDayInWeek(i - 1, weekOffset).length : 0;
              const selected = i === selectedDay;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  style={{ flex: 1, position: "relative", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{WEEK_SHORT[i]}</div>
                  <div
                    style={{
                      border: selected ? `2px solid ${C.red}` : "2px solid transparent",
                      borderRadius: 10,
                      padding: "6px 0",
                      fontSize: 17,
                      fontWeight: 600,
                      color: C.text,
                    }}
                  >
                    {d.getDate()}
                  </div>
                  {count > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -4,
                        right: 2,
                        backgroundColor: C.red,
                        color: C.text,
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 999,
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex" }}>
            <div style={{ width: 40, flexShrink: 0, position: "relative", height: gridHeight }}>
              {hours.map((h) => (
                <div key={h} style={{ position: "absolute", top: (h - HORAIRE_START) * HOUR_PX - 7, right: 4, fontSize: 12, color: C.muted }}>
                  {h}:00
                </div>
              ))}
            </div>
            <div style={{ flex: 1, position: "relative", height: gridHeight, borderTop: `1px solid ${C.border}` }}>
              {hours.map((h) => (
                <div key={h} style={{ position: "absolute", left: 0, right: 0, top: (h - HORAIRE_START) * HOUR_PX, borderTop: `1px solid ${C.border}` }} />
              ))}
              {(selectedDay >= 1 && selectedDay <= 5 ? scheduleForDayInWeek(selectedDay - 1, weekOffset) : []).map((e, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 2,
                    right: 2,
                    top: (e.start - HORAIRE_START) * HOUR_PX,
                    height: (e.end - e.start) * HOUR_PX - 2,
                    backgroundColor: SCHED_COLORS[e.code] || C.red,
                    borderRadius: 8,
                    padding: "10px 12px",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{e.section}</div>
                  <div style={{ fontSize: 14, color: C.text }}>{e.type}</div>
                  <div style={{ fontSize: 14, color: C.text }}>{e.room}</div>
                </div>
              ))}
              {isToday(dates[selectedDay]) && (
                <div style={{ position: "absolute", left: 0, right: 0, top: (20.25 - HORAIRE_START) * HOUR_PX, display: "flex", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: C.text, marginLeft: -5 }} />
                  <div style={{ flex: 1, height: 1, backgroundColor: C.text }} />
                </div>
              )}
            </div>
          </div>
          <Legend />
        </>
          ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button
              onClick={() => setMonthCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))}
              style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}
            >
              ‹
            </button>
            <span style={{ fontSize: 18, color: C.text }}>
              {MONTH_NAMES[monthCursor.month].charAt(0).toUpperCase() + MONTH_NAMES[monthCursor.month].slice(1)} {monthCursor.year}
            </span>
            <button
              onClick={() => setMonthCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))}
              style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}
            >
              ›
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
            {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 14, color: C.muted, padding: "4px 0" }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {monthCells.map((d, i) => {
              const inMonth = d.getMonth() === monthCursor.month;
              const events = eventCodesForDate(d);
              const today = isToday(d);
              return (
                <div key={i} style={{ borderTop: `1px solid ${C.border}`, borderLeft: i % 7 > 0 ? `1px solid ${C.border}` : "none", padding: "6px 3px", minHeight: 74 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: today ? C.red : "transparent",
                      color: inMonth ? C.text : C.muted,
                      fontSize: 14,
                      fontWeight: today ? 700 : 400,
                      margin: "0 auto 4px",
                    }}
                  >
                    {d.getDate()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {events.map((code, j) => (
                      <div
                        key={j}
                        style={{
                          backgroundColor: SCHED_COLORS[code] || C.red,
                          color: C.text,
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 4,
                          padding: "2px 3px",
                          textAlign: "center",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {code.slice(0, 5)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <Legend />
        </>
          )}
        </div>
        </>
      )}

      {showExport && <ExportModal onCancel={() => setShowExport(false)} onExport={() => setShowExport(false)} />}
      {showSettings && (
        <SettingsSheet
          showToday={showToday}
          onToggleToday={() => setShowToday((v) => !v)}
          format={calendarFormat}
          onSetFormat={setCalendarFormat}
          onClose={() => setShowSettings(false)}
        />
      )}
    </Screen>
  );
}
function EtsSection() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {ETS_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => window.open("https://www.etsmtl.ca/", "_blank")}
          style={{
            backgroundColor: C.card,
            borderRadius: 16,
            padding: "18px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            textAlign: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          {item.icon}
          <span style={{ fontSize: 13, color: C.red, fontWeight: 500 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "12px 8px",
        textAlign: "center",
        flex: 1,
      }}
    >
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: C.text }}>{value}</div>
    </div>
  );
}

const NAV_ON = "#F44353";
const NAV_OFF = "#C4C4CA";

function NavGridIcon({ active }) {
  const c = active ? NAV_ON : NAV_OFF;
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill={active ? c : "none"} stroke={c} strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="9" rx="0.5" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="0.5" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="0.5" />
      <rect x="3.5" y="15.5" width="7" height="5" rx="0.5" />
    </svg>
  );
}

function NavClockIcon({ active }) {
  return active ? (
    <svg width="30" height="30" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={NAV_ON} />
      <path d="M12 6.5v6l4 2.4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={NAV_OFF} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.8v5.4l3.8 2.2" />
    </svg>
  );
}

// ---------- écran de chargement ----------
function Splash({ leaving }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "#111111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: leaving ? 0 : 1,
        transition: "opacity 450ms ease",
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      <style>{"@keyframes etsPop{0%{opacity:0;transform:scale(.92)}100%{opacity:1;transform:scale(1)}}"}</style>
      <svg width="165" height="165" viewBox="0 0 165 165" style={{ animation: "etsPop 700ms ease-out both" }}>
        <circle cx="82.5" cy="82.5" r="82.5" fill="#E8343F" />
        <g transform="rotate(-7 82.5 85)">
          <ellipse cx="82.5" cy="88" rx="52" ry="9.5" fill="none" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.55" />
        </g>
        <text x="82.5" y="104" textAnchor="middle" fontSize="64" fontWeight="800" fontStyle="italic" fill="#FFFFFF" fontFamily="Arial Black, Arial, Helvetica, sans-serif" letterSpacing="-3">ÉTS</text>
        <g transform="rotate(-7 82.5 85)">
          <path d="M30.5 88 A52 9.5 0 0 0 134.5 88" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
        </g>
      </svg>
    </div>
  );
}

// ---------- app ----------
function App() {
  const [courses, setCourses] = useState(null);
  const [openCourseId, setOpenCourseId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("accueil");
  const [etudiantTab, setEtudiantTab] = useState("profil");
  const [plusPage, setPlusPage] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [splash, setSplash] = useState("show"); // show → leaving → done

  useEffect(() => {
    const t1 = setTimeout(() => setSplash("leaving"), 1600);
    const t2 = setTimeout(() => setSplash("done"), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    (async () => {
      let storedVersion = 0;
      try {
        const v = await store.get("dataVersion");
        storedVersion = v ? Number(v.value) : 0;
      } catch {
        storedVersion = 0;
      }

      if (storedVersion < CURRENT_VERSION) {
        const seeded = seedCourses();
        setCourses(seeded);
        try {
          await store.set("courses", JSON.stringify(seeded));
          await store.set("dataVersion", String(CURRENT_VERSION));
        } catch {
          // non-fatal
        }
      } else {
        try {
          const res = await store.get("courses");
          const parsed = res ? JSON.parse(res.value) : null;
          setCourses(parsed && parsed.length ? parsed : seedCourses());
        } catch {
          setCourses(seedCourses());
        }
      }
      setLoaded(true);
    })();
  }, []);

  if (!loaded) {
    return <Splash />;
  }

  const openCourse = courses.find((c) => c.id === openCourseId);
  const termsInOrder = [...new Set(courses.map((c) => c.term))].sort((a, b) => termRank(a) - termRank(b));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div style={!openCourse && (activeTab === "accueil" || activeTab === "horaire") ? {} : { maxWidth: 448, margin: "0 auto", padding: "0 16px 96px" }}>
        {openCourse ? (
          <CourseDetail course={openCourse} onBack={() => setOpenCourseId(null)} />
        ) : activeTab === "horaire" ? (
          <HoraireSection />
        ) : activeTab === "etudiant" ? (
          <>
            <header style={{ paddingTop: 32, paddingBottom: 16 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Étudiant</h1>
            </header>

            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
              {[
                ["notes", "Notes"],
                ["profil", "Profil"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setEtudiantTab(key)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    padding: "0 0 12px",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 600,
                    color: etudiantTab === key ? C.text : C.muted,
                    borderBottom: etudiantTab === key ? `2px solid ${C.text}` : "2px solid transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {etudiantTab === "notes" ? (
              <NotesSection courses={courses} termsInOrder={termsInOrder} onOpenCourse={setOpenCourseId} />
            ) : (
              <ProfilSection />
            )}
          </>
        ) : activeTab === "ets" ? (
          <>
            <header style={{ paddingTop: 32, paddingBottom: 20 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>ÉTS</h1>
            </header>
            <EtsSection />
          </>
        ) : activeTab === "plus" ? (
          plusPage === "about" ? (
            <AboutPage onBack={() => setPlusPage(null)} />
          ) : plusPage === "settings" ? (
            <SettingsPage onBack={() => setPlusPage(null)} />
          ) : plusPage && PLUS_PLACEHOLDER_CONTENT[plusPage] ? (
            <SimplePlaceholderPage
              title={PLUS_PLACEHOLDER_CONTENT[plusPage].title}
              paragraphs={PLUS_PLACEHOLDER_CONTENT[plusPage].paragraphs}
              onBack={() => setPlusPage(null)}
            />
          ) : (
            <>
              <header style={{ paddingTop: 32, paddingBottom: 8 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Plus</h1>
              </header>
              <PlusSection
                onNavigate={(key) => {
                  if (key === "logout") setShowLogoutConfirm(true);
                  else setPlusPage(key);
                }}
              />
            </>
          )
        ) : (
          <>
            <AccueilScreen courses={courses} onOpenCourse={setOpenCourseId} />
          </>
        )}
      </div>

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: "#1A1B1F",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", height: NAV_H, display: "flex", fontFamily: U.font }}>
          {[
            ["accueil", "Accueil", (on) => <NavGridIcon active={on} />],
            ["horaire", "Horaire", (on) => <NavClockIcon active={on} />],
            ["etudiant", "Étudiant", (on) => <GraduationCapIcon color={on ? NAV_ON : NAV_OFF} size={30} />],
            ["ets", "ÉTS", (on) => <BuildingIcon color={on ? NAV_ON : NAV_OFF} size={30} />],
            ["plus", "Plus", (on) => <HamburgerIcon color={on ? NAV_ON : NAV_OFF} size={30} />],
          ].map(([key, label, icon]) => {
            const on = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setOpenCourseId(null);
                }}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  padding: "9px 0 0",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <div style={{ height: 30, display: "flex", alignItems: "center" }}>{icon(on)}</div>
                <span style={{ fontSize: on ? 17 : 14.5, lineHeight: "20px", color: on ? NAV_ON : NAV_OFF }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {showLogoutConfirm && (
        <LogoutModal onConfirm={() => setShowLogoutConfirm(false)} onCancel={() => setShowLogoutConfirm(false)} />
      )}
      {splash !== "done" && <Splash leaving={splash === "leaving"} />}
    </div>
  );
}

// ---------- course detail (read-only) — fidèle à ÉTSMobile ----------
const D = {
  page: "#111113",
  bar: "#18181B",
  card: "#232326",
  text: "#ECECEC",
  track: "#E0E0E0",
  avgRed: "#F23F4C",
  green: "#86E08F",
  avgText: "#F0594A",
  chevron: "#EF3E4D",
  font: "Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
};

// Couleur de l'anneau selon la note : rouge → jaune (≈50 %) → vert (100 %)
const GRADE_STOPS = [
  [0, [229, 57, 53]],
  [25, [239, 108, 66]],
  [40, [245, 185, 84]],
  [52, [249, 238, 114]],
  [60, [228, 233, 122]],
  [73, [193, 224, 124]],
  [85, [144, 201, 115]],
  [93, [102, 176, 92]],
  [100, [67, 160, 71]],
];
function gradeColor(pct) {
  const v = Math.max(0, Math.min(100, pct));
  for (let i = 1; i < GRADE_STOPS.length; i++) {
    const [p1, c1] = GRADE_STOPS[i];
    const [p0, c0] = GRADE_STOPS[i - 1];
    if (v <= p1) {
      const t = (v - p0) / (p1 - p0 || 1);
      const rgb = c0.map((x, k) => Math.round(x + (c1[k] - x) * t));
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }
  return "rgb(67, 160, 71)";
}

// Double anneau : extérieur = votre note, intérieur (rouge) = moyenne du groupe
function RingGauge({ value, avg, size, outerStroke, innerStroke, fontSize, centerText }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 40);
    return () => clearTimeout(t);
  }, []);
  const cx = size / 2;
  const rO = (size - outerStroke) / 2 - 0.5;
  const rI = rO - outerStroke / 2 - innerStroke / 2 - size * 0.045;
  const cO = 2 * Math.PI * rO;
  const cI = 2 * Math.PI * rI;
  const clamp = (x) => Math.max(0, Math.min(100, x));
  const pO = value == null ? 0 : clamp(value);
  const pI = avg == null ? 0 : clamp(avg);
  const ease = "900ms cubic-bezier(0.4, 0, 0.2, 1)";
  return (
    <svg width={size} height={size} style={{ flexShrink: 0, display: "block" }}>
      <circle cx={cx} cy={cx} r={rO} fill="none" stroke={D.track} strokeWidth={outerStroke} />
      <circle cx={cx} cy={cx} r={rI} fill="none" stroke={D.track} strokeWidth={innerStroke} />
      {value != null && (
        <circle
          cx={cx}
          cy={cx}
          r={rO}
          fill="none"
          stroke={on ? gradeColor(pO) : gradeColor(0)}
          strokeWidth={outerStroke}
          strokeLinecap="round"
          strokeDasharray={cO}
          strokeDashoffset={on ? cO * (1 - pO / 100) : cO}
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: `stroke-dashoffset ${ease}, stroke ${ease}` }}
        />
      )}
      {avg != null && (
        <circle
          cx={cx}
          cy={cx}
          r={rI}
          fill="none"
          stroke={D.avgRed}
          strokeWidth={innerStroke}
          strokeLinecap="round"
          strokeDasharray={cI}
          strokeDashoffset={on ? cI * (1 - pI / 100) : cI}
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: `stroke-dashoffset ${ease}` }}
        />
      )}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill={D.text}
        fontWeight="400"
        fontSize={fontSize}
        fontFamily={D.font}
      >
        {centerText}
      </text>
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={D.chevron}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms", flexShrink: 0 }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function DetailStat({ label, value }) {
  return (
    <div
      style={{
        flex: 1,
        height: 97,
        backgroundColor: D.card,
        borderRadius: 18,
        padding: "11px 6px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 17, lineHeight: "24px", color: D.text }}>{label}</div>
      <div style={{ fontSize: 22, lineHeight: "26px", color: D.text }}>{value}</div>
    </div>
  );
}

function CourseDetail({ course, onBack }) {
  const [openItem, setOpenItem] = useState(null);
  const [showIgnored, setShowIgnored] = useState(true);
  const hasGrades = course.gradeItems.length > 0;

  const counted = course.gradeItems.filter((gi) => !gi.ignored);
  const ignoredItems = course.gradeItems.filter((gi) => gi.ignored);
  const graded = counted.filter((gi) => gi.score != null);
  const finalPct = coursePct(course);
  const centerText = course.cote || (finalPct == null ? "—" : `${Math.round(finalPct)} %`);
  const totalWeight = course.noteOverride ? course.noteOverride.total : graded.reduce((s, gi) => s + gi.weight, 0);
  const yourPoints = course.noteOverride
    ? course.noteOverride.pts
    : graded.reduce((s, gi) => s + (gi.score / gi.outOf) * gi.weight, 0);

  const renderItem = (gi) => {
      const nd = gi.score == null;
      const pct = nd ? null : (gi.score / gi.outOf) * 100;
      const open = openItem === gi.id;
      return (
        <div
          key={gi.id}
          onClick={() => setOpenItem(open ? null : gi.id)}
          style={{ backgroundColor: D.card, borderRadius: 18, cursor: "pointer", overflow: "hidden" }}
        >
          <div style={{ display: "flex", alignItems: "center", minHeight: 99, padding: "10px 16px 10px 13px", gap: 14 }}>
            <RingGauge
              value={pct}
              avg={gi.avg != null ? gi.avg : null}
              size={78}
              outerStroke={7}
              innerStroke={5}
              fontSize={nd ? 18 : 16}
              centerText={nd ? "ND" : `${Math.round(pct)} %`}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, lineHeight: "25px", color: D.text, letterSpacing: 0.3 }}>{gi.name}</div>
              <div style={{ fontSize: 16, lineHeight: "24px", color: "#E4E4E4", letterSpacing: 0.3 }}>
                Pondération : {gi.weight.toFixed(1)} %
              </div>
            </div>
            <div style={{ paddingRight: 10 }}>
              <Chevron open={open} />
            </div>
          </div>
          {open && (
            <div style={{ padding: "0 16px 16px 105px", fontSize: 15, lineHeight: "24px", color: "#CFCFCF" }}>
              {nd ? (
                <div>Note non disponible</div>
              ) : (
                <div>
                  Votre note : {((gi.score / gi.outOf) * gi.weight).toFixed(1)}/{gi.weight.toFixed(1)} ({pct.toFixed(1)} %)
                </div>
              )}
              {gi.avg != null && <div>Moyenne : {gi.avg.toFixed(1)} %</div>}
            </div>
          )}
        </div>
      );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        overflowY: "auto",
        backgroundColor: D.page,
        color: D.text,
        fontFamily: D.font,
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100%", backgroundColor: D.page }}>
        {/* barre d'app (reste en haut au défilement) */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            backgroundColor: D.bar,
            paddingTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 16px" }}>
            <button
              onClick={onBack}
              aria-label="Retour"
              style={{ background: "none", border: "none", padding: 0, marginRight: 22, display: "flex", cursor: "pointer" }}
            >
              <BackArrow />
            </button>
            <div style={{ fontSize: 27, fontWeight: 700, color: "#FFFFFF", letterSpacing: 0.2 }}>{course.code}</div>
          </div>
        </div>

        {/* bloc d'information du cours */}
        <div style={{ backgroundColor: D.bar, padding: "4px 16px 16px", fontSize: 17, lineHeight: "25px", color: "#FFFFFF" }}>
          {course.name && <div>{course.name}</div>}
          {course.teacher && <div>Enseignant: {course.teacher}</div>}
          <div>Groupe {course.group}</div>
          <div>Crédits: {course.credits}</div>
        </div>

        <div style={{ padding: "11px 10px calc(28px + env(safe-area-inset-bottom, 0px))" }}>
          {!hasGrades ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 20px 40px" }}>
              <GraduationCapIcon color={D.chevron} size={72} />
              <p style={{ fontSize: 17, color: D.text, marginTop: 24, marginBottom: 28 }}>Aucune note disponible</p>
              <button
                style={{
                  backgroundColor: D.chevron,
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 999,
                  padding: "12px 32px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Réessayer
              </button>
            </div>
          ) : (
            <>
              {/* carte principale */}
              <div
                style={{
                  backgroundColor: D.card,
                  borderRadius: 20,
                  padding: "23px 0",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div style={{ flex: "0 0 50%", display: "flex", justifyContent: "center" }}>
                  <RingGauge
                    value={finalPct}
                    avg={course.moyenne}
                    size={108}
                    outerStroke={8}
                    innerStroke={8}
                    fontSize={22}
                    centerText={centerText}
                  />
                </div>
                <div style={{ flex: 1, paddingRight: 8, fontSize: 19, lineHeight: "23px" }}>
                  <div style={{ color: D.green }}>
                    {yourPoints.toFixed(1)}/{totalWeight.toFixed(1)} ({finalPct == null ? "—" : finalPct.toFixed(1)} %)
                  </div>
                  <div style={{ color: D.green }}>Votre note</div>
                  {course.moyenne != null && (
                    <div style={{ marginTop: 17 }}>
                      <div style={{ color: D.avgText }}>
                        {((course.moyenne / 100) * totalWeight).toFixed(1)}/{totalWeight.toFixed(1)} ({course.moyenne.toFixed(1)} %)
                      </div>
                      <div style={{ color: D.avgText }}>Moyenne</div>
                    </div>
                  )}
                </div>
              </div>

              {/* médiane / écart-type / rang centile */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <DetailStat label="Médiane" value={course.mediane == null ? "—" : `${course.mediane.toFixed(1)} %`} />
                <DetailStat label="Écart-type" value={course.ecartType == null ? "—" : course.ecartType.toFixed(1)} />
                <DetailStat label={<>Rang<br />centile</>} value={course.rangCentile == null ? "—" : course.rangCentile} />
              </div>

              {/* évaluations */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {counted.map(renderItem)}
              </div>

              {ignoredItems.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <button
                    onClick={() => setShowIgnored((v) => !v)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "none",
                      border: "none",
                      padding: "6px 22px 6px 6px",
                      color: D.text,
                      fontSize: 24,
                      lineHeight: "32px",
                      cursor: "pointer",
                      fontFamily: D.font,
                      textAlign: "left",
                    }}
                  >
                    <span>
                      {ignoredItems.length} {ignoredItems.length > 1 ? "notes ignorées" : "note ignorée"}
                    </span>
                    <Chevron open={showIgnored} />
                  </button>
                  {showIgnored && (
                    <>
                      <p style={{ fontSize: 18, lineHeight: "21px", color: "#E4E4E4", margin: "18px 6px 16px" }}>
                        Les éléments suivants sont ignorés dans le calcul de la note finale.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{ignoredItems.map(renderItem)}</div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
