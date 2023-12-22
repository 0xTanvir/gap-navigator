import * as z from "zod";

export const profileFormSchema = z.object({
    firstName: z.string({required_error: 'First name is required'})
        .refine(value => !/^\s/.test(value), {
            message: 'The first character must not be a space',
        })
        .refine(value => value.trim().length >= 3, {
            message: 'First Name must be at least 3 characters',
        }),
    lastName: z.string({required_error: 'Last name is required'})
        .refine(value => !/^\s/.test(value), {
            message: 'The first character must not be a space',
        })
        .refine(value => value.trim().length >= 3, {
            message: 'Last Name must be at least 3 characters',
        }),
    email: z.string({required_error: 'Email is required'}).email('Please enter a valid email'),
    image: z.string().optional()
})