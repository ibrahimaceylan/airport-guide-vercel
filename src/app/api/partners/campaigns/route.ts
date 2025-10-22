import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { CampaignStatus } from "@prisma/client";
import {
  CAMPAIGN_PLACEMENTS,
  CAMPAIGN_STATUSES,
  type CampaignPlacementValue,
  type CampaignStatusValue,
  toPlacementEnum,
} from "@/lib/campaigns";

const placementEnum = z.enum(CAMPAIGN_PLACEMENTS);
const statusEnum = z.enum(CAMPAIGN_STATUSES);

const placementSchema = z.object({
  placement: placementEnum,
  sortOrder: z.number().int().min(0).optional().default(0),
});

const campaignSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/i, "Slug must be alphanumeric with optional dashes"),
  headline: z.string().min(5),
  subheadline: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  ctaText: z.string().min(2),
  destinationUrl: z.string().url(),
  utmSource: z.string().optional().or(z.literal("")),
  utmMedium: z.string().optional().or(z.literal("")),
  utmCampaign: z.string().optional().or(z.literal("")),
  locale: z.string().min(2).max(5),
  status: statusEnum.optional().default("DRAFT"),
  startDate: z.string().datetime({ offset: true }).optional().or(z.literal("")),
  endDate: z.string().datetime({ offset: true }).optional().or(z.literal("")),
  placements: z.array(placementSchema).min(1, "Select at least one placement"),
});

const requireAdmin = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? "dev-next-auth-secret" });
  const role = token?.role as string | undefined;
  if (!role || (role !== "ADMIN" && role !== "EDITOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { role, email: token?.email };
};

const sanitiseDate = (value?: string | null) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (value.trim() === "") return null;
  return new Date(value);
};

export async function GET(request: NextRequest) {
  const restriction = await requireAdmin(request);
  if (restriction instanceof NextResponse) return restriction;

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  const status = searchParams.get("status");

  const campaigns = await prisma.partnerCampaign.findMany({
    where: {
      ...(locale ? { OR: [{ locale }, { locale: "all" }] } : {}),
      ...(status && CAMPAIGN_STATUSES.includes(status as CampaignStatusValue)
        ? { status: status as CampaignStatus }
        : {}),
    },
    include: {
      placements: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(campaigns);
}

export async function POST(request: NextRequest) {
  const restriction = await requireAdmin(request);
  if (restriction instanceof NextResponse) return restriction;

  const body = await request.json();
  const parsed = campaignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const startDate = sanitiseDate(data.startDate);
  const endDate = sanitiseDate(data.endDate);

  const campaign = await prisma.partnerCampaign.create({
    data: {
      name: data.name,
      slug: data.slug.toLowerCase(),
      headline: data.headline,
      subheadline: data.subheadline || null,
      imageUrl: data.imageUrl || null,
      ctaText: data.ctaText,
      destinationUrl: data.destinationUrl,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      locale: data.locale,
      status: data.status as CampaignStatus,
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      placements: {
        create: data.placements.map((placement, index) => ({
          placement: toPlacementEnum(placement.placement),
          sortOrder: placement.sortOrder ?? index,
        })),
      },
    },
    include: {
      placements: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
