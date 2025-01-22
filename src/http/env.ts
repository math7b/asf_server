import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ENCRYPTION_KEY: z.string(),
  TOKEN_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
