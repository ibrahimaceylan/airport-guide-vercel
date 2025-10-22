import {
  Accessibility,
  AlertCircle,
  AlertTriangle,
  Armchair,
  ArrowRight,
  BadgeParking,
  BusFront,
  CalendarClock,
  Car,
  Globe,
  Instagram,
  LifeBuoy,
  Luggage,
  Map,
  MessageCircle,
  Phone,
  Plane,
  PlaneTakeoff,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Tickets,
  TramFront,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const gradients = {
  pageBackground: "from-[#fffaf2] via-[#eef6ff] to-[#ffffff]",
  hero: "from-[#d9f1ff] via-[#f0f9ff] to-[#ffffff]",
  heroOverlay: "from-sky-900/12 via-sky-800/6 to-transparent",
};

export const shadows = {
  card: "shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)]",
  cardHover: "hover:shadow-[0_25px_50px_-24px_rgba(15,23,42,0.45)]",
  inner: "shadow-inner shadow-sky-200/60",
};

export const radii = {
  xl: "rounded-3xl",
  lg: "rounded-2xl",
  pill: "rounded-full",
};

export const borders = {
  subtle: "border border-slate-200",
  accent: "border border-sky-200",
};

export const transitions = {
  base: "transition duration-200 ease-out",
};

export const cardBase =
  "bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-[0_24px_55px_-28px_rgba(15,23,42,0.2)] transition duration-200 ease-out hover:shadow-[0_30px_65px_-30px_rgba(14,165,233,0.35)]";

export const iconMap: Record<string, LucideIcon> = {
  plane: Plane,
  "plane-takeoff": PlaneTakeoff,
  departures: Plane,
  arrivals: Plane,
  airline: Plane,
  "bus-front": BusFront,
  "shield-alert": ShieldAlert,
  security: ShieldAlert,
  "parking-circle": BadgeParking,
  parking: BadgeParking,
  luggage: Luggage,
  vip: Tickets,
  passport: Users,
  currency: Globe,
  globe: Globe,
  metro: TramFront,
  shuttle: BusFront,
  "tram-front": TramFront,
  taxi: Car,
  map: Map,
  transport: TramFront,
  shopping: ShoppingBag,
  schedule: CalendarClock,
  calendar: CalendarClock,
  alert: AlertCircle,
  "alert-triangle": AlertTriangle,
  phone: Phone,
  accessibility: Accessibility,
  "shield-check": ShieldCheck,
  armchair: Armchair,
  "life-buoy": LifeBuoy,
  search: Search,
  "message-circle": MessageCircle,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  default: AlertCircle,
};

export const resolveIcon = (icon?: string): LucideIcon => {
  if (!icon) return iconMap.default;
  const key = icon.toLowerCase();
  return iconMap[key] ?? iconMap.default;
};

export const ctaIcon = ArrowRight;
