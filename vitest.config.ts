import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { config } from 'dotenv';

// Explicitly load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: process.env, // Make environment variables available in tests
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    },
  },
});
