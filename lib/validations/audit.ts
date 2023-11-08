import * as z from "zod"

export const auditSchema = z.object({
    auditName: z
        .string({
            required_error: "Please type an audit name.",
        }).min(1),
    auditType: z
        .string({
            required_error: "Please select an audit type.",
        }).min(1)
})
