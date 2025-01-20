'use server'

import { spotifyApi } from '@/lib/spotify-sdk'

export const searchSpotify = async (term: string) => {
  const { artists, albums, tracks } = await spotifyApi.search(
    term,
    ['artist', 'album', 'track'],
    'SE',
    5
  )

  return { artists, albums, tracks }
}
