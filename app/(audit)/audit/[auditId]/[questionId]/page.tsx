'use client'

import {notFound} from "next/navigation"
import {useAuth} from "@/components/auth/auth-provider"
import {AuditEditorShell} from "../audit-editor-shell"
import {AuditEditorHeader} from "../audit-editor-header"
import AnswerList from "./answer-list"
import {QuestionProvider} from "@/app/(audit)/audit/QuestionContext";

export default function QuestionPage({params}: { params: { auditId: string, questionId: string } }) {
    const {user, isAuthenticated, loading} = useAuth()
    if (loading) {
        return (
            <AuditEditorShell>
                <AuditEditorHeader.Skeleton/>
            </AuditEditorShell>
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <QuestionProvider>
                <AnswerList userId={user.uid} questionId={params.questionId} auditId={params.auditId}/>
            </QuestionProvider>
        )
    } else {
        return notFound()
    }
}
