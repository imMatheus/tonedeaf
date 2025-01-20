import { db, artists } from '@/lib/drizzle'

export default async function Artists() {
  const allArtists = await db.select().from(artists)

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Artists</h1>
      <div className="grid gap-4">
        {allArtists.map((artist) => (
          <div key={artist.id} className="rounded-lg border p-4">
            <p>Artist ID: {artist.id}</p>
            <p>Created: {artist.created_at?.toLocaleString()}</p>
            <p>Updated: {artist.updated_at?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
