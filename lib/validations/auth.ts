import * as z from "zod"
import {AccountType} from "@/config/site";

export const userAuthLoginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, {message: 'Password is required'})
})

export const userAuthSignupSchema = z.object({
    firstName: z.string()
        .refine(value => !/^\s/.test(value), {
            message: 'The first character must not be a space',
        })
        .refine(value => value.trim().length > 0, {
            message: 'First name is required',
        })
        .refine(value => value.trim().length >= 3, {
            message: 'First Name must be at least 3 characters',
        }),
    lastName: z.string()
        .refine(value => !/^\s/.test(value), {
            message: 'The first character must not be a space',
        })
        .refine(value => value.trim().length > 0, {
            message: 'First name is required',
        })
        .refine(value => value.trim().length >= 3, {
            message: 'First Name must be at least 3 characters',
        }),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, {message: 'Password is required'})
        .min(6, {message: 'Password must be at least 6 character\'s'})
        .max(100, {message: 'Password must be at least 100 character\'s'}),
    role: z.nativeEnum(AccountType).refine(value => {
            return value === "client" || value === "consultant";
        }, {message: 'Please select a valid account type'}
    )
})

export const userAccountCompleteSchema = z.object({
    firstName: z.string()
        .refine(value => !/^\s/.test(value), {
            message: 'The first character must not be a space',
        })
        .refine(value => value.trim().length > 0, {
            message: 'First name is required',
        })
        .refine(value => value.trim().length >= 3, {
            message: 'First Name must be at least 3 characters',
        }),
    lastName: z.string()
        .refine(value => !/^\s/.test(value), {
            message: 'The first character must not be a space',
        })
        .refine(value => value.trim().length > 0, {
            message: 'First name is required',
        })
        .refine(value => value.trim().length >= 3, {
            message: 'First Name must be at least 3 characters',
        }),
    email: z.string().email(),
    role: z.nativeEnum(AccountType).refine(value => {
            return value === "client" || value === "consultant";
        }, {message: 'Please select a valid account type'}
    )
})