import * as React from "react"

import { cn } from "@/lib/utils"

interface AuditEditorShellProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AuditEditorShell({
    children,
    className,
    ...props
}: AuditEditorShellProps) {
    return (
        <div className={cn("container relative max-w-5xl", className)} {...props}>
            {children}
        </div>
    )
}
