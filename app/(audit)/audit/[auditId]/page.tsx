'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { AuditEditorShell } from "./audit-editor-shell"
import { AuditEditorHeader } from "./audit-editor-header"
import QuestionList from "./question-list"
import { QuestionProvider } from "@/app/(audit)/audit/QuestionContext";

export default function AuditPage({params}: { params: { auditId: string } }) {
  const {user, isAuthenticated, loading} = useAuth()
  if (loading) {
    return (
        <AuditEditorShell>
          <AuditEditorHeader.Skeleton/>
        </AuditEditorShell>
    )
  } else if ((isAuthenticated && user && user.role === "consultant") || (isAuthenticated && user && user.role === "admin")) {
    return (
        <QuestionProvider>
          <QuestionList userId={user.uid} auditId={params.auditId}/>
        </QuestionProvider>
    )
  } else {
    return notFound()
  }
}
