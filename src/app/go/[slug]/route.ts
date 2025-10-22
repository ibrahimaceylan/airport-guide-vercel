import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CampaignPlacementValue } from "@/lib/campaigns";

const FALLBACK_URL = "/";

const isCampaignActive = (status: string, startDate?: Date | null, endDate?: Date | null) => {
  if (status !== "LIVE") return false;
  const now = new Date();
  if (startDate && startDate > now) return false;
  if (endDate && endDate < now) return false;
  return true;
};

const appendUtmParams = (destination: string, params: { source?: string | null; medium?: string | null; campaign?: string | null }) => {
  try {
    const url = new URL(destination);
    if (params.source) url.searchParams.set("utm_source", params.source);
    if (params.medium) url.searchParams.set("utm_medium", params.medium);
    if (params.campaign) url.searchParams.set("utm_campaign", params.campaign);
    return url.toString();
  } catch {
    return destination;
  }
};

const resolvePlacement = (
  placementParam: string | null,
  placements: { placement: CampaignPlacementValue; sortOrder: number }[],
) => {
  if (placementParam) {
    const normalized = placementParam.toUpperCase();
    const match = placements.find((p) => p.placement === normalized);
    if (match) return match.placement;
  }
  return placements[0]?.placement ?? "BANNER";
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase();
  const { searchParams } = new URL(request.url);
  const placementParam = searchParams.get("placement");
  const locale = searchParams.get("locale") ?? "en";

  const campaign = await prisma.partnerCampaign.findUnique({
    where: { slug },
    include: { placements: { orderBy: { sortOrder: "asc" } } },
  });

  if (!campaign || campaign.placements.length === 0 || !isCampaignActive(campaign.status, campaign.startDate, campaign.endDate)) {
    return NextResponse.redirect(FALLBACK_URL, { status: 307 });
  }

  const placement = resolvePlacement(
    placementParam,
    campaign.placements.map((placement) => ({
      placement: placement.placement as CampaignPlacementValue,
      sortOrder: placement.sortOrder,
    })),
  );
  const redirectUrl = appendUtmParams(campaign.destinationUrl, {
    source: campaign.utmSource,
    medium: campaign.utmMedium,
    campaign: campaign.utmCampaign,
  });

  try {
    await prisma.campaignClickEvent.create({
      data: {
        campaignId: campaign.id,
        placement,
        locale,
        referrer: request.headers.get("referer"),
        userAgent: request.headers.get("user-agent"),
      },
    });
  } catch (error) {
    console.error("Failed to record partner click", error);
  }

  return NextResponse.redirect(redirectUrl, { status: 307 });
}
