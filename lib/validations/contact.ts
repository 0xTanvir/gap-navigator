import * as z from 'zod'

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

export const contactSchema = z.object({
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
            message: 'Last name is required',
        })
        .refine(value => value.trim().length >= 3, {
            message: 'Last name must be at least 3 characters',
        }),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(9).regex(phoneRegex, 'Please enter a valid phone number'),
    message: z.string()
        .refine(value => !/^\s/.test(value), {
            message: 'The first character must not be a space',
        })
        .refine(value => value.trim().length > 0, {
            message: 'Message is required',
        })
        .refine(value => value.trim().length >= 20, {
            message: 'Message must be at least 20 characters',
        }),
})