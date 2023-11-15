import * as z from 'zod'

export const questionSchema = z.object({
    question_name: z.string()
        .refine(value => value.trim().length > 0, {
            message: 'Question name is required.'
        })
        .refine(value => value.trim().length > 6, {
            message: 'Question name must be at least 6 characters'
        })
})
export const answerSchema = z.object({
    name: z
        .string()
        .min(1, {message: "Please type an answer name."}),
    recommendationDocument: z
        .string()
        .min(1, {message: "Please type an recommendation document."})
})