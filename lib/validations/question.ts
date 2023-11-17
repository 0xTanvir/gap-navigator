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

export const previewQuestionListSchema = z.object({
    answer: z.string({
        required_error: "You need to select a answer.",
    }),
    additionalNote: z.string().max(160).min(4, {message: 'skdjskldfj'}),
    recommendedNote: z.string().max(160).min(4),
    internalNote: z.string().max(160).min(4),
})