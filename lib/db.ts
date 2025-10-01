import { neon } from "@neondatabase/serverless"

const raw = process.env.DATABASE_URL

if (!raw) {
  throw new Error("DATABASE_URL is not set. Add it to your .env.local.")
}

function extractUrl(input: string): string {
  const trimmed = input.trim()
  if (trimmed.startsWith("psql ")) {
    const match = trimmed.match(/'([^']+)'/)
    if (match && match[1]) return match[1]
  }
  return trimmed
}

const connectionString = extractUrl(raw)

// Basic validation
try {
  // eslint-disable-next-line no-new
  new URL(connectionString)
} catch {
  throw new Error(
    `DATABASE_URL is not a valid URL. Received: ${connectionString}. Ensure it looks like postgresql://user:pass@host/db?sslmode=require`
  )
}

export const sql = neon(connectionString) 