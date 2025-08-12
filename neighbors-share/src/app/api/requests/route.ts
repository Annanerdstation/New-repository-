import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role'); // 'borrower' or 'lender'
  const userId = searchParams.get('userId') ?? undefined;

  const where = userId
    ? role === 'lender'
      ? { lenderId: userId }
      : role === 'borrower'
      ? { borrowerId: userId }
      : { OR: [{ borrowerId: userId }, { lenderId: userId }] }
    : {};

  const requests = await prisma.borrowRequest.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const data = await request.json();
  // derive lender from item if not provided
  let lenderId = data.lenderId as string | undefined;
  if (!lenderId && data.itemId) {
    const item = await prisma.item.findUnique({ where: { id: data.itemId } });
    lenderId = item?.ownerId;
  }
  if (!lenderId) return NextResponse.json({ error: 'Missing lenderId' }, { status: 400 });

  const created = await prisma.borrowRequest.create({
    data: {
      itemId: data.itemId,
      borrowerId: data.borrowerId,
      lenderId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
  return NextResponse.json(created, { status: 201 });
}