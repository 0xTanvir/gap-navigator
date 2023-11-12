'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { AuditEditorShell } from "../audit-editor-shell"
import { AuditEditorHeader } from "../audit-editor-header"

export default function QuestionPage({ params }: { params: { auditId: string, questionId: string } }) {
    const { user, isAuthenticated, loading } = useAuth()
    if (loading) {
        return (
            <AuditEditorShell>
                <AuditEditorHeader.Skeleton />
            </AuditEditorShell>
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <div>This will be a question edit form page</div>
        )
    } else {
        return notFound()
    }
}
