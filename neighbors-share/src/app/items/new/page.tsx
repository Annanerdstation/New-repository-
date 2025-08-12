'use client';
import { useState } from 'react';

export default function NewItemPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('TOOLS');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId: 'demo',
        title,
        description,
        category,
        condition: 'Good',
        photos: ['https://picsum.photos/seed/new/600/400'],
      }),
    });
    if (res.ok) alert('Created');
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">New item</h1>
      <form onSubmit={submit} className="max-w-md space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Description" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="TOOLS">Tools</option>
          <option value="OUTDOORS">Outdoors</option>
          <option value="KITCHEN">Kitchen</option>
          <option value="ELECTRONICS">Electronics</option>
          <option value="BABY">Baby</option>
          <option value="PARTY">Party</option>
          <option value="OTHER">Other</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
      </form>
    </main>
  );
}