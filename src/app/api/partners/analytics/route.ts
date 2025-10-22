import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

const requireAdmin = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? "dev-next-auth-secret" });
  const role = token?.role as string | undefined;
  if (!role || (role !== "ADMIN" && role !== "EDITOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { role };
};

export async function GET(request: NextRequest) {
  const restriction = await requireAdmin(request);
  if (restriction instanceof NextResponse) return restriction;

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 7);
  const since = new Date();
  since.setDate(since.getDate() - (Number.isFinite(days) && days > 0 ? days : 7));

  const events = await prisma.campaignClickEvent.findMany({
    where: { createdAt: { gte: since } },
    include: {
      campaign: {
        select: { id: true, name: true, slug: true, locale: true },
      },
    },
  });

  const aggregate = new Map<
    number,
    {
      campaignId: number;
      name: string;
      slug: string;
      locale: string;
      total: number;
      placements: Record<string, number>;
    }
  >();

  events.forEach((event) => {
    const entry =
      aggregate.get(event.campaignId) ??
      aggregate.set(event.campaignId, {
        campaignId: event.campaignId,
        name: event.campaign.name,
        slug: event.campaign.slug,
        locale: event.campaign.locale,
        total: 0,
        placements: {},
      }).get(event.campaignId)!;

    entry.total += 1;
    entry.placements[event.placement] = (entry.placements[event.placement] || 0) + 1;
  });

  const results = Array.from(aggregate.values()).sort((a, b) => b.total - a.total);

  return NextResponse.json({
    since: since.toISOString(),
    totalClicks: events.length,
    campaigns: results,
  });
}
