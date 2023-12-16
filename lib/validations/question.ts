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
    questionId: z.string({
        required_error: "Please select an question name.",
    }).optional(),
    recommendationDocument: z
        .string()
        .min(1, {message: "Please type an recommendation document."})
})

export const previewQuestionListSchema = z.object({
    answer: z.string({
        required_error: "You need to select a answer.",
    }).min(1),
    additionalNote: z.string().max(160).min(4,).optional(),
    recommendedNote: z.string().max(160).min(4).optional(),
    internalNote: z.string().max(160).min(4).optional(),
})
export const evaluationQuestionListSchema = z.object({
    answerId: z.string({
        required_error: "You need to select a answer.",
    }),
    additionalNote: z.string().optional(),
    recommendedNote: z.string().optional(),
    internalNote: z.string().optional(),
})

export const evaluateParticipant = z.object({
    participantFirstName: z.string({required_error: 'First name is required!'})
        .min(3, {
            message: 'First Name must be at least 3 characters',
        }),
    participantLastName: z.string({required_error: 'Last name is required!'})
        .min(3, {
            message: 'Last Name must be at least 3 characters',
        }),
    participantEmail: z.string({required_error: 'Email is required!'}).email('Please enter a valid email'),
})