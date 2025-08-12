import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@neighbors.local' },
    create: { email: 'demo@neighbors.local', name: 'Demo User', postalCode: '94107', city: 'San Francisco', country: 'US' },
    update: {},
  });

  const item = await prisma.item.create({
    data: {
      ownerId: user.id,
      title: 'Cordless Drill',
      description: '18V cordless drill with charger',
      category: 'TOOLS',
      condition: 'Good',
      photos: JSON.stringify(['https://picsum.photos/seed/drill/600/400']),
      postalCode: '94107',
    },
  });

  return NextResponse.json({ user, item }, { status: 201 });
}