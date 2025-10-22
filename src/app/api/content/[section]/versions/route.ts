import { VersionAction } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { resolveSectionDefinition, toSerializable } from "@/lib/content/sectionConfig";

const MAX_VERSION_RESULTS = 50;

const findUserIdByEmail = async (email?: string | null) => {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user?.id ?? null;
};

export async function GET(_: Request, { params }: { params: { section: string } }) {
  const config = resolveSectionDefinition(params.section);
  if (!config) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const versions = await prisma.sectionVersion.findMany({
    where: { section: config.sectionType },
    orderBy: { createdAt: "desc" },
    take: MAX_VERSION_RESULTS,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(
    versions.map((version) => ({
      id: version.id,
      section: version.section,
      recordId: version.recordId,
      action: version.action,
      publishedAt: version.publishedAt,
      createdAt: version.createdAt,
      restoredFromId: version.restoredFromId,
      data: version.data,
      author: version.author,
    })),
  );
}

export async function POST(req: Request, { params }: { params: { section: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const config = resolveSectionDefinition(params.section);
  if (!config) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const { versionId } = await req.json();
  const id = Number(versionId);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid version id" }, { status: 400 });
  }

  const version = await prisma.sectionVersion.findUnique({
    where: { id },
  });

  if (!version || version.section !== config.sectionType) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  const userId = await findUserIdByEmail(session.user.email);
  if (!userId) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const rawData = (version.data ?? {}) as Record<string, unknown>;
  const normalized = { ...rawData } as Record<string, unknown>;

  const recordId = Number(version.recordId ?? (rawData as any)?.id ?? null);
  delete normalized.id;

  const parsed = config.schema.safeParse(normalized);
  if (!parsed.success) {
    return NextResponse.json({ error: "Version payload invalid", details: parsed.error.format() }, { status: 422 });
  }

  let restored;

  if (Number.isInteger(recordId)) {
    restored = await (prisma as any)[config.prismaModel].upsert({
      where: { id: recordId },
      update: parsed.data,
      create: { id: recordId, ...parsed.data },
    });
  } else {
    restored = await (prisma as any)[config.prismaModel].create({
      data: parsed.data,
    });
  }

  await prisma.sectionVersion.create({
    data: {
      section: config.sectionType,
      recordId: restored.id ?? recordId ?? null,
      data: toSerializable(restored),
      action: VersionAction.RESTORED,
      publishedAt: new Date(),
      createdBy: userId,
      restoredFromId: version.id,
    },
  });

  return NextResponse.json(restored, { status: 200 });
}
