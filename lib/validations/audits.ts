import * as z from "zod"
import {AuditsType} from "@/config/site";


export const auditSchema = z.object({
    audits_name: z.string()
        .refine(value => !/^\s/.test(value), {
            message: 'The first character must not be a space',
        })
        .refine(value => value.trim().length > 0, {
            message: 'Audits name is required',
        })
        .refine(value => value.trim().length >= 3, {
            message: 'Audits name must be at least 3 characters',
        }),
    audits_type: z.enum(['private','public']).refine(value => {
        return value === "private" || value === "public";
    }, {message: 'Please select a valid audits type'})
});