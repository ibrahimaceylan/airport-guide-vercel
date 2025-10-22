import { SectionType } from "@prisma/client";
import { z, type AnyZodObject } from "zod";

export type SectionDefinition = {
  prismaModel: string;
  schema: AnyZodObject;
  sectionType: SectionType;
};

const baseSections: Record<string, SectionDefinition> = {
  hero: {
    prismaModel: "hero",
    sectionType: SectionType.HERO,
    schema: z.object({
      title: z.string(),
      subtitle: z.string(),
      imageUrl: z.string().url(),
      ctaText: z.string().optional(),
      ctaLink: z.string().url().optional(),
    }),
  },
  quicklink: {
    prismaModel: "quickLink",
    sectionType: SectionType.QUICK_LINK,
    schema: z.object({
      label: z.string(),
      icon: z.string(),
      url: z.string().url(),
    }),
  },
  highlight: {
    prismaModel: "highlight",
    sectionType: SectionType.HIGHLIGHT,
    schema: z.object({
      title: z.string(),
      description: z.string(),
      imageUrl: z.string().url(),
      category: z.string().optional(),
      tags: z.string().optional(),
      spotlight: z.boolean().optional(),
    }),
  },
  transport: {
    prismaModel: "transport",
    sectionType: SectionType.TRANSPORT,
    schema: z.object({
      mode: z.string(),
      status: z.string(),
      description: z.string(),
      iconUrl: z.string().url(),
      badgeText: z.string().optional(),
      nextDeparture: z.string().optional(),
      frequency: z.string().optional(),
      ctaText: z.string().optional(),
      ctaUrl: z.string().url().optional(),
      sortOrder: z.number().optional(),
    }),
  },
  atairport: {
    prismaModel: "atAirport",
    sectionType: SectionType.AT_AIRPORT,
    schema: z.object({
      name: z.string(),
      category: z.string(),
      description: z.string(),
      imageUrl: z.string().url(),
    }),
  },
  ctastrip: {
    prismaModel: "cTAStrip",
    sectionType: SectionType.CTA_STRIP,
    schema: z.object({
      title: z.string(),
      subtitle: z.string(),
      buttonText: z.string(),
      buttonUrl: z.string().url(),
    }),
  },
  statusmetric: {
    prismaModel: "statusMetric",
    sectionType: SectionType.STATUS_METRIC,
    schema: z.object({
      type: z.string(),
      title: z.string(),
      metric: z.string(),
      unit: z.string().optional(),
      trendLabel: z.string().optional(),
      trendValue: z.string().optional(),
      icon: z.string().optional(),
      locale: z.string().optional(),
      override: z.boolean().optional(),
      active: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }),
  },
  journeytile: {
    prismaModel: "journeyTile",
    sectionType: SectionType.JOURNEY_TILE,
    schema: z.object({
      stage: z.string(),
      title: z.string(),
      description: z.string(),
      icon: z.string(),
      ctaLabel: z.string().optional(),
      ctaUrl: z.string().url().optional(),
      partnerSlug: z.string().optional(),
      locale: z.string().optional(),
      active: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }),
  },
  alert: {
    prismaModel: "alert",
    sectionType: SectionType.ALERT,
    schema: z.object({
      title: z.string(),
      message: z.string(),
      severity: z.string().optional(),
      ctaLabel: z.string().optional(),
      ctaUrl: z.string().url().optional(),
      locale: z.string().optional(),
      dismissible: z.boolean().optional(),
      active: z.boolean().optional(),
      startAt: z.string().optional(),
      endAt: z.string().optional(),
    }),
  },
};

const sectionLookup: Record<string, SectionDefinition> = {
  hero: baseSections.hero,
  quicklink: baseSections.quicklink,
  quicklinks: baseSections.quicklink,
  highlight: baseSections.highlight,
  highlights: baseSections.highlight,
  transport: baseSections.transport,
  transports: baseSections.transport,
  atairport: baseSections.atairport,
  atairports: baseSections.atairport,
  ctastrip: baseSections.ctastrip,
  "cta-strip": baseSections.ctastrip,
  ctastrips: baseSections.ctastrip,
  ctasstrips: baseSections.ctastrip,
  statusmetric: baseSections.statusmetric,
  statusmetrics: baseSections.statusmetric,
  journeystep: baseSections.journeytile,
  journeytile: baseSections.journeytile,
  journeytiles: baseSections.journeytile,
  alert: baseSections.alert,
  alerts: baseSections.alert,
};

const normalizeSection = (section: string) => section.replace(/[_\-\s]/g, "").toLowerCase();

export const resolveSectionDefinition = (section: string): SectionDefinition | undefined => {
  const normalized = normalizeSection(section);
  return sectionLookup[normalized];
};

export const toSerializable = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value ?? null));
