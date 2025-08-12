import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function parsePhotos(val: unknown): string[] {
  if (typeof val === 'string') {
    try {
      const arr = JSON.parse(val);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(val)) return val as string[];
  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postal = searchParams.get('postal') ?? undefined;
  const q = searchParams.get('q') ?? undefined;

  const items = await prisma.item.findMany({
    where: {
      isActive: true,
      ...(postal ? { postalCode: postal } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  const shaped = items.map((it) => ({ ...it, photos: parsePhotos((it as any).photos) }));
  return NextResponse.json(shaped);
}

export async function POST(request: Request) {
  const data = await request.json();

  let ownerId: string = data.ownerId;
  if (!ownerId || ownerId === 'demo') {
    const demo = await prisma.user.upsert({
      where: { email: 'demo@neighbors.local' },
      update: {},
      create: { email: 'demo@neighbors.local', name: 'Demo User', postalCode: data.postalCode ?? '00000' },
    });
    ownerId = demo.id;
  }

  const created = await prisma.item.create({
    data: {
      ownerId,
      title: data.title,
      description: data.description,
      category: data.category,
      condition: data.condition ?? 'Good',
      photos: JSON.stringify(data.photos ?? []),
      postalCode: data.postalCode ?? null,
      lat: data.lat ?? null,
      lng: data.lng ?? null,
    },
  });
  const shaped = { ...created, photos: parsePhotos((created as any).photos) };
  return NextResponse.json(shaped, { status: 201 });
}