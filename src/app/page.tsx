import { spotifyApi } from '@/lib/spotify-sdk'

export default async function Home() {
  const { artists } = await spotifyApi.search('coldplay', ['artist'], 'SE', 11)
  return (
    <main className="p-4">
      <pre>{JSON.stringify(artists, null, 2)}</pre>
    </main>
  )
}
