import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: './.env.local' })

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/drizzle/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
