import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home() {
  async function setPostalCode(formData: FormData) {
    'use server';
    const code = (formData.get('postalCode') as string)?.trim();
    if (code) {
      // In MVP, save to cookie for filtering; real app would persist on profile if authed
      const cookie = require('cookie');
      const headersList = require('next/headers');
      const headers = headersList.headers();
      const existing = headers.get('cookie') || '';
      const serialized = cookie.serialize('postalCode', code, { path: '/', maxAge: 60 * 60 * 24 * 365 });
      // set-cookie via next headers is not trivial in server actions without Response; keep simple: redirect with search param
      redirect(`/browse?postal=${encodeURIComponent(code)}`);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center">Borrow before you buy</h1>
      <p className="text-muted-foreground text-center max-w-xl">
        Neighbors Share helps you find and share underused items in your neighborhood.
      </p>
      <form action={setPostalCode} className="flex w-full max-w-md gap-2">
        <input
          name="postalCode"
          placeholder="Enter your postal code"
          className="flex-1 border rounded-md px-3 py-2"
        />
        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Go</button>
      </form>
      <Link href="/browse" className="text-blue-600 underline">Browse items</Link>
    </main>
  );
}