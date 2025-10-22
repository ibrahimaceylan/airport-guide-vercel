export type PartnerCampaignResponse = {
  id: number;
  name: string;
  slug: string;
  headline: string;
  subheadline?: string | null;
  imageUrl?: string | null;
  ctaText: string;
  destinationUrl: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  locale: string;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  placements: {
    id: number;
    placement: string;
    sortOrder: number;
  }[];
};

export const fetchPartnerCampaigns = async () => {
  const response = await fetch("/api/partners/campaigns");
  if (!response.ok) throw new Error("Failed to load campaigns");
  return (await response.json()) as PartnerCampaignResponse[];
};

export type PartnerAnalytics = {
  since: string;
  totalClicks: number;
  campaigns: {
    campaignId: number;
    name: string;
    slug: string;
    locale: string;
    total: number;
    placements: Record<string, number>;
  }[];
};

export const fetchPartnerAnalytics = async (days = 7) => {
  const response = await fetch(`/api/partners/analytics?days=${days}`);
  if (!response.ok) throw new Error("Failed to load partner analytics");
  return (await response.json()) as PartnerAnalytics;
};
