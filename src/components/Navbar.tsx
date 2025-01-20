'use client'

import { useUser } from '@/hooks/useUser'
import { ROUTE_PAGES } from '@/routePages'
import Link from 'next/link'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase'
import { LogOut } from 'lucide-react'
import { Button } from './ui/button'

export const Navbar: React.FC = ({}) => {
  const { user } = useUser()

  console.log(user)

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  const handleSpotifyLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        // options: {
        //   redirectTo: `${window.location.origin}/auth/callback`,
        //   scopes: 'user-read-email user-read-private',
        // },
      })

      console.log({ data, error })

      if (error) throw error
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold mr-2 italic">Tonedeaf</h2>
          <div className="flex items-center gap-2">
            <Link href={ROUTE_PAGES.HOME}>Home</Link>
            <Link href={ROUTE_PAGES.ARTISTS}>Artists</Link>
          </div>
        </div>
        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {user.user_metadata.full_name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={handleSpotifyLogin}
              className="bg-[#1DB954] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1ed760] transition-colors"
            >
              Login with Spotify
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
