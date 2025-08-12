import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { threadId: string } }) {
  const messages = await prisma.message.findMany({ where: { threadId: params.threadId }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json(messages);
}