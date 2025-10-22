import prisma from "@/lib/prisma";
import type { CampaignPlacement, PartnerCampaign, CampaignStatus, CampaignPlacementType as PrismaPlacement } from "@prisma/client";

export const CAMPAIGN_PLACEMENTS = [
  "HERO_TILE",
  "QUICK_LINK",
  "BANNER",
  "FEATURED_SECTION",
  "FOOTER_TILE",
] as const;
export type CampaignPlacementValue = (typeof CAMPAIGN_PLACEMENTS)[number];

export const CAMPAIGN_STATUSES = ["DRAFT", "LIVE", "PAUSED", "ARCHIVED"] as const;
export type CampaignStatusValue = (typeof CAMPAIGN_STATUSES)[number];

const ACTIVE_STATUS: CampaignStatusValue[] = ["LIVE"];

const isActiveWithinWindow = (campaign: PartnerCampaign) => {
  const now = new Date();
  if (campaign.startDate && campaign.startDate > now) return false;
  if (campaign.endDate && campaign.endDate < now) return false;
  return true;
};

export const getActiveCampaigns = async (locale: string) => {
  const campaigns = await prisma.partnerCampaign.findMany({
    where: {
      status: { in: ACTIVE_STATUS as CampaignStatus[] },
      OR: [{ locale }, { locale: "all" }],
    },
    include: {
      placements: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return campaigns.filter(isActiveWithinWindow);
};

export const groupCampaignsByPlacement = (
  campaigns: (PartnerCampaign & { placements: CampaignPlacement[] })[],
) => {
  const groups = CAMPAIGN_PLACEMENTS.reduce(
    (acc, placement) => {
      acc[placement] = [];
      return acc;
    },
    {} as Record<CampaignPlacementValue, (PartnerCampaign & { placement: CampaignPlacement })[]>,
  );

  campaigns.forEach((campaign) => {
    campaign.placements.forEach((placement) => {
      const key = placement.placement as CampaignPlacementValue;
      if (!groups[key]) groups[key] = [];
      groups[key].push({ ...campaign, placement });
    });
  });

  return groups;
};

export const getActiveCampaignsByPlacement = async (locale: string) => {
  const campaigns = await getActiveCampaigns(locale);
  return groupCampaignsByPlacement(campaigns);
};

export const isPlacementType = (value: string): value is CampaignPlacementValue =>
  CAMPAIGN_PLACEMENTS.includes(value as CampaignPlacementValue);

export const toPlacementEnum = (value: string): PrismaPlacement => value as PrismaPlacement;
