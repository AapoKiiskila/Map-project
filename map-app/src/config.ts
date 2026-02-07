import { z } from "zod"

const EnvSchema = z.object({
  URL: z.string(),
  WS: z.string()
})

export const config = EnvSchema.parse({URL: process.env.EXPO_PUBLIC_URL, WS: process.env.EXPO_PUBLIC_WS})
