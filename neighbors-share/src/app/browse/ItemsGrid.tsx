'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ItemsGrid({ postal }: { postal?: string }) {
  const { data, error, isLoading } = useSWR(`/api/items${postal ? `?postal=${encodeURIComponent(postal)}` : ''}`, fetcher);

  if (isLoading) return <div>Loading items...</div>;
  if (error) return <div>Error loading items</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data?.map((item: any) => (
        <div key={item.id} className="border rounded-md p-3">
          <img src={item.photos?.[0]} alt={item.title} className="w-full aspect-video object-cover rounded" />
          <div className="mt-2 text-lg font-medium">{item.title}</div>
          <div className="text-sm text-muted-foreground">{item.category}</div>
        </div>
      ))}
    </div>
  );
}