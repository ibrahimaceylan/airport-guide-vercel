import { VersionAction } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { resolveSectionDefinition, toSerializable, type SectionDefinition } from "@/lib/content/sectionConfig";

const findUserIdByEmail = async (email?: string | null) => {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user?.id ?? null;
};

type VersionPayload = {
  config: SectionDefinition;
  recordId: number | null;
  data: unknown;
  action: VersionAction;
  userId: number | null;
  restoredFromId?: number | null;
};

const createVersionEntry = async ({
  config,
  recordId,
  data,
  action,
  userId,
  restoredFromId = null,
}: VersionPayload) => {
  await prisma.sectionVersion.create({
    data: {
      section: config.sectionType,
      recordId: recordId ?? null,
      data: toSerializable(data),
      action,
      publishedAt: new Date(),
      createdBy: userId,
      restoredFromId,
    },
  });
};

const resolveSection = (section: string): SectionDefinition | undefined => resolveSectionDefinition(section);

export async function GET(_: Request, { params }: { params: { section: string } }) {
  const config = resolveSection(params.section);
  if (!config) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const records = await (prisma as any)[config.prismaModel].findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(records);
}

export async function POST(req: Request, { params }: { params: { section: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const config = resolveSection(params.section);
  if (!config) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const body = await req.json();
  const parsed = config.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.format(), { status: 400 });
  }

  const userId = await findUserIdByEmail(session.user.email);
  if (!userId) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const created = await (prisma as any)[config.prismaModel].create({ data: parsed.data });

  await createVersionEntry({
    config,
    recordId: created?.id ?? null,
    data: created,
    action: VersionAction.CREATED,
    userId,
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: Request, { params }: { params: { section: string } }) {
  const session = await auth();
  const role = session?.user ? (session.user as any).role : null;
  if (role !== "ADMIN" && role !== "EDITOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const config = resolveSection(params.section);
  if (!config) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const userId = await findUserIdByEmail(session?.user?.email);
  if (!userId) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const body = await req.json();
  const id = Number(body?.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const payload = { ...body };
  delete (payload as any).id;

  const parsed = config.schema.partial().safeParse(payload);
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await (prisma as any)[config.prismaModel].update({ where: { id }, data: parsed.data });

  await createVersionEntry({
    config,
    recordId: updated?.id ?? id,
    data: updated,
    action: VersionAction.UPDATED,
    userId,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { section: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const config = resolveSection(params.section);
  if (!config) return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const userId = await findUserIdByEmail(session.user.email);
  if (!userId) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const body = await req.json();
  const id = Number(body?.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await (prisma as any)[config.prismaModel].findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  await (prisma as any)[config.prismaModel].delete({ where: { id } });

  await createVersionEntry({
    config,
    recordId: id,
    data: existing,
    action: VersionAction.DELETED,
    userId,
  });

  return NextResponse.json({ success: true });
}
