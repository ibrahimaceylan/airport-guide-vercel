import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const contents = await prisma.content.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(contents);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, body } = await req.json();

  if (!title || !body) {
    return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
  }

  const author = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!author) {
    return NextResponse.json({ error: "Author not found" }, { status: 404 });
  }

  const newItem = await prisma.content.create({
    data: {
      title,
      body,
      authorId: author.id,
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(newItem, { status: 201 });
}
