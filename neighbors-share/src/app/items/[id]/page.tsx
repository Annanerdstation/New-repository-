import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function ItemDetail({ params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({ where: { id: params.id }, include: { owner: true } });
  if (!item) return <div className="p-6">Item not found</div>;

  return (
    <main className="min-h-screen p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {Array.isArray(item.photos) && item.photos[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.photos[0]} alt={item.title} className="w-full rounded-md" />
          ) : (
            <div className="aspect-video bg-muted rounded" />
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{item.title}</h1>
          <div className="text-muted-foreground">{item.category}</div>
          <p>{item.description}</p>
          <div className="text-sm">Owner: {item.owner.name || item.owner.email}</div>
          <form action="#" className="space-y-2" suppressHydrationWarning>
            <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded">Request to Borrow</button>
          </form>
        </div>
      </div>
    </main>
  );
}