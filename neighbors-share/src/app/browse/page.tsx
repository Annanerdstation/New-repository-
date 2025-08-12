import { ItemsGrid } from './ItemsGrid';

export default function BrowsePage({ searchParams }: { searchParams: { postal?: string } }) {
  return (
    <main className="min-h-screen p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Browse items</h1>
      <ItemsGrid postal={searchParams.postal} />
    </main>
  );
}