import * as z from "zod"

export const userAuthLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
})

export const userAuthSignupSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    role: z.enum(["consultant", "client"], {
        required_error: "You need at select between 'consultant' or 'client'",
    }),
})

export const userAccountCompleteSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    role: z.enum(["consultant", "client"], {
        required_error: "You need at select between 'consultant' or 'client'",
    }),
})