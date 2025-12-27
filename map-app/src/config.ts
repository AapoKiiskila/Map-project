import { z } from "zod"

const EnvSchema = z.object({
  URL: z.string()
})

export const config = EnvSchema.parse({URL: process.env.EXPO_PUBLIC_URL})
