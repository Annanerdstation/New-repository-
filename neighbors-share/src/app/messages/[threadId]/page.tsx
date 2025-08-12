export default function ThreadPage({ params }: { params: { threadId: string } }) {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-2">Message Thread</h1>
      <div className="text-muted-foreground">Thread ID: {params.threadId}</div>
    </main>
  );
}