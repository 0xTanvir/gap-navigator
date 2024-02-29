import * as z from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)
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
  // email: z.string({required_error: 'Email is required'}).email('Please enter a valid email'),
  email: z.string().optional(),
  image: z.string().optional()
})

export const clientFormSchema = z.object({
  participantFirstName: z.string({required_error: 'First name is required'})
    .refine(value => !/^\s/.test(value), {
      message: 'The first character must not be a space',
    })
    .refine(value => value.trim().length >= 3, {
      message: 'First Name must be at least 3 characters',
    }),
  participantLastName: z.string({required_error: 'Last name is required'})
    .refine(value => !/^\s/.test(value), {
      message: 'The first character must not be a space',
    })
    .refine(value => value.trim().length >= 3, {
      message: 'Last Name must be at least 3 characters',
    }),
  participantEmail: z.string({required_error: 'Email is required'}).email('Please enter a valid email'),
  participantPhone: z.string().min(9).regex(phoneRegex, 'Please enter a valid phone number'),
})