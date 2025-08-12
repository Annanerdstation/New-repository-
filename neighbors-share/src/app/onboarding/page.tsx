import { redirect } from 'next/navigation';

export default function OnboardingPage() {
  async function save(formData: FormData) {
    'use server';
    const postal = (formData.get('postalCode') as string) || '';
    const lat = parseFloat((formData.get('lat') as string) || '');
    const lng = parseFloat((formData.get('lng') as string) || '');
    redirect(`/browse?postal=${encodeURIComponent(postal)}`);
  }

  return (
    <main className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Set your neighborhood</h1>
      <form action={save} className="max-w-md space-y-3">
        <input name="postalCode" className="w-full border rounded px-3 py-2" placeholder="Postal code" />
        <div className="grid grid-cols-2 gap-2">
          <input name="lat" className="w-full border rounded px-3 py-2" placeholder="Latitude (optional)" />
          <input name="lng" className="w-full border rounded px-3 py-2" placeholder="Longitude (optional)" />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Continue</button>
      </form>
    </main>
  );
}