'use client'

import { useRouter } from 'next/navigation'

import { Search } from 'lucide-react'
import { spotifyApi } from '@/lib/spotify-sdk'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { DialogTitle } from './ui/dialog'

import { searchSpotify } from './actions'
import { useCallback, useEffect, useState } from 'react'

interface SearchResult {
  id: string
  name: string
  type: 'artist' | 'album' | 'track' | 'playlist'
  imageUrl?: string
  artist?: string
}

export function SearchBar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (term: string) => {
    console.log()

    if (!term) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { artists, albums, tracks } = await searchSpotify(term)

      console.log({ artists, albums, tracks })

      const formattedResults: SearchResult[] = [
        ...(artists?.items.map((artist) => ({
          id: artist.id,
          name: artist.name,
          type: 'artist' as const,
          imageUrl: artist.images[0]?.url,
        })) ?? []),
        ...(albums?.items.map((album) => ({
          id: album.id,
          name: album.name,
          type: 'album' as const,
          imageUrl: album.images[0]?.url,
          artist: album.artists[0]?.name,
        })) ?? []),
        ...(tracks?.items.map((track) => ({
          id: track.id,
          name: track.name,
          type: 'track' as const,
          imageUrl: track.album.images[0]?.url,
          artist: track.artists[0]?.name,
        })) ?? []),
      ]

      setResults(formattedResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  console.log({ results })

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(value)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [value, search])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setOpen(false)
      router.push(`/${result.type}/${result.id}`)
    },
    [router]
  )

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="text-md flex cursor-pointer items-center justify-between gap-10 rounded border bg-muted px-3 font-medium text-muted-foreground"
      >
        <p>Search</p>
        <kbd className="inline-flex h-5 select-none items-center gap-1 font-mono text-sm opacity-100">
          <span className="text-sm">⌘</span>J
        </kbd>
      </div>
      <CommandDialog skipFilter open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <CommandInput
          placeholder="Type a command or search..."
          value={value}
          onValueChange={setValue}
        />
        <CommandList>
          <CommandGroup heading="Suggestions">
            {results.map((result) => (
              <CommandItem
                key={result.id}
                value={result.name}
                onSelect={() => handleSelect(result)}
              >
                {result.imageUrl && (
                  <img
                    src={result.imageUrl}
                    alt={result.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{result.name}</span>
                  {result.artist && (
                    <span className="text-xs text-muted-foreground">
                      {result.artist}
                    </span>
                  )}
                  <span className="text-xs capitalize text-muted-foreground">
                    {result.type}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
