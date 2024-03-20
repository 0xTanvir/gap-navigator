import * as z from "zod"

export const auditSchema = z.object({
  auditName: z
    .string({
      required_error: "Please type an audit name.",
    }).min(1),
  auditType: z
    .string({
      required_error: "Please select an audit type.",
    }).min(1),
  condition: z.boolean().optional(),
  welcome: z
    .string({
      required_error: "Please type an audit evaluation welcome page.",
    }).min(1),
  thank_you: z
    .string({
      required_error: "Please type an audit evaluation thank you page.",
    }).min(1),
})
export const auditSchemaStep1 = z.object({
  auditName: z
    .string({
      required_error: "Please type an audit name.",
    }).min(1),
  auditType: z
    .string({
      required_error: "Please select an audit type.",
    }).min(1),
  condition: z.boolean().optional(),
  custom_url: z.boolean().optional(),
  custom_url_string: z.string().optional()
})
export const auditSchemaStep2 = z.object({
  welcome: z
    .string({
      required_error: "Please type an audit evaluation welcome page.",
    }).optional(),
})
export const auditSchemaStep3 = z.object({
  thank_you: z
    .string({
      required_error: "Please type an audit evaluation thank you page.",
    }).optional(),
})

export const auditInviteSchema = z.object({
  email: z.string({required_error: 'Please enter a valid email'}).email('Please enter a valid email')
})
export const auditShareSchema = z.object({
  email: z.string({required_error: 'Please enter a valid email'}).email('Please enter a valid email')
})


export const auditFilterSchema = z.object({
  auditName: z
    .string()
    // .min(3, {message: 'Type audit name minimum 3 length'})
    .optional(),
  auditType: z
    .string({
      required_error: "Please select an audit type.",
    }).optional()
})