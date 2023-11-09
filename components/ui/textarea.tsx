import * as React from "react"

import {cn} from "@/lib/utils"
import {cva, type VariantProps} from "class-variance-authority";

const textareaVariants = cva(
    "flex w-full rounded-md border border-input px-3 py-1 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "min-h-[110px] bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
                ny: "min-h-[100px] bg-transparent shadow-sm transition-colors focus-visible:ring-1",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({className, variant, ...props}, ref) => {
        return (
            <textarea
                className={cn(textareaVariants({variant, className}))}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export {Textarea}
