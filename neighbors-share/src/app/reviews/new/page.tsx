export default function NewReviewPage({ searchParams }: { searchParams: { requestId?: string } }) {
  return (
    <main className="min-h-screen p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Leave a review</h1>
      <div className="text-sm text-muted-foreground">For request: {searchParams.requestId || 'N/A'}</div>
      <form className="max-w-md space-y-2">
        <select className="w-full border rounded px-3 py-2" defaultValue="5">
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <textarea className="w-full border rounded px-3 py-2" placeholder="Comment (optional)" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="button">Submit</button>
      </form>
    </main>
  );
}