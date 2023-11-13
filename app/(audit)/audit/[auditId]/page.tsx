'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { AuditEditorShell } from "./audit-editor-shell"
import { AuditEditorHeader } from "./audit-editor-header"
import QuestionList from "./question-list"

export default function AuditPage({ params }: { params: { auditId: string } }) {
    const { user, isAuthenticated, loading } = useAuth()
    if (loading) {
        return (
            <AuditEditorShell>
                <AuditEditorHeader.Skeleton />
            </AuditEditorShell>
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <QuestionList userId={user.uid} auditId={params.auditId} />
        )
    } else {
        return notFound()
    }
}
