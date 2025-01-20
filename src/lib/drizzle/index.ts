// import 'server-only'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

if (!process.env.DATABASE_URL) {
  throw new Error('Missing env.DATABASE_URL')
}

const client = postgres(process.env.DATABASE_URL, { prepare: false })
export const db = drizzle(client)

export const artists = pgTable('artists', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const songs = pgTable('songs', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export const artistToSong = pgTable('artist_to_song', {
  artistId: integer('artist_id')
    .notNull()
    .references(() => artists.id),
  songId: integer('song_id')
    .notNull()
    .references(() => songs.id),
})

export const songToAlbum = pgTable('song_to_album', {
  songId: integer('song_id')
    .notNull()
    .references(() => songs.id),
  albumId: integer('album_id')
    .notNull()
    .references(() => albums.id),
})
