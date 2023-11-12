import React from 'react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AuditEditorShell } from './audit-editor-shell'
import { AuditEditorHeader } from './audit-editor-header'
import { QuestionCreateButton } from './question-create-button'

interface AuditEditorProps {
    userId: string;
    auditId: string;
}

export default function AuditEditor({ userId, auditId }: AuditEditorProps) {

    return (
        <AuditEditorShell>
            <Link
                href="/audits"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-[-150px] top-4 hidden xl:inline-flex"
                )}
            >
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                See all audits
            </Link>

            <AuditEditorHeader heading="Some very big audit name" text="Create and manage questions.">
                <QuestionCreateButton />
            </AuditEditorHeader>

            <hr className="mt-12" />
            <div className="flex justify-center py-6 lg:py-10">
                <Link href="/audits" className={cn(buttonVariants({ variant: "ghost" }))}>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    See all audits
                </Link>
            </div>
        </AuditEditorShell>
    )
}
