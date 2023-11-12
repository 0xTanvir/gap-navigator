import React from 'react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AuditEditorShell } from '../audit-editor-shell'
import { AuditEditorHeader } from '../audit-editor-header'

interface AuditEditorProps {
    userId: string;
    auditId: string;
}

export default function AnswerList({ userId, auditId }: AuditEditorProps) {

    return (
        <AuditEditorShell>
            <Link
                href={`/audit/${auditId}`}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-[-150px] top-4 hidden xl:inline-flex"
                )}
            >
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back to questions
            </Link>

            <AuditEditorHeader heading="Answers" text="Create and manage answers.">
                <Button>
                    <Icons.save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </AuditEditorHeader>
            {/* Add a from and fetch this question by question id from 
            firebase db and implement all the other functionalities */}
            <hr className="mt-12" />
            <div className="flex justify-center py-6 lg:py-10">
                <Link href={`/audit/${auditId}`} className={cn(buttonVariants({ variant: "ghost" }))}>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back to questions
                </Link>
            </div>
        </AuditEditorShell>
    )
}
