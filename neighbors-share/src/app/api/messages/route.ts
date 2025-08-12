import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();
  // Ensure thread exists for request
  let thread = await prisma.messageThread.findUnique({ where: { requestId: data.requestId } });
  if (!thread) {
    thread = await prisma.messageThread.create({ data: { requestId: data.requestId } });
  }
  const msg = await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: data.senderId,
      content: data.content,
    },
  });
  return NextResponse.json(msg, { status: 201 });
}