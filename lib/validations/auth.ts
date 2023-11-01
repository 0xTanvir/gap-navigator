import * as z from "zod"

export const userAuthLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
})

export const userAuthSignupSchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(100),
})
