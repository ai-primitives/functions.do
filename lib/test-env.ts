// Load environment variables directly from .env.local
import { config } from 'dotenv'
import { resolve } from 'path'
import { existsSync } from 'fs'

const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`)
  config({ path: envPath })

  // Check if OPENROUTER environment variables are available
  const openRouterKeys = Object.keys(process.env).filter((key) => key.startsWith('OPENROUTER'))
  console.log('OPENROUTER keys found:', openRouterKeys.length > 0 ? 'Yes' : 'No')
} else {
  console.error(`Environment file not found at ${envPath}`)
}

// Export as a function that can be imported and called in test files
export function ensureEnvVarsLoaded() {
  return process.env
}
