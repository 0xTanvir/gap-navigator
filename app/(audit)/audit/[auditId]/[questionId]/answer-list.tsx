import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AuditEditorShell } from '../audit-editor-shell'
import { AuditEditorHeader } from '../audit-editor-header'
import { Audit, Question } from "@/types/dto";
import { getQuestionById } from "@/lib/firestore/question";
import AnswerCreateButton from "@/app/(audit)/audit/[auditId]/[questionId]/answer-create-button";
import AnswerItem from "@/app/(audit)/audit/[auditId]/[questionId]/answer-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { useAuth } from "@/components/auth/auth-provider";
import { getAudit } from "@/lib/firestore/audit";
import { toast } from "sonner";

interface AuditEditorProps {
  userId: string;
  auditId: string;
  questionId: string
}

export default function AnswerList({auditId, questionId}: AuditEditorProps) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [audit, setAudit] = useState<Audit | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const {user} = useAuth()

  async function singleQuestionFetch() {
    try {
      const dbQuestion = await getQuestionById(auditId, questionId)
      const dbAudit = await getAudit(auditId)
      setAudit(dbAudit)
      setQuestion(dbQuestion as Question)
    } catch (e) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    singleQuestionFetch()
  }, [auditId, questionId])

  if (loading) {
    return (
      <AuditEditorShell>
        <AnswerItem.Skeleton/>
        <div className="divide-border-200 divide-y rounded-md border mt-8 mx-2">
          <AnswerItem.Skeleton/>
          <AnswerItem.Skeleton/>
          <AnswerItem.Skeleton/>
          <AnswerItem.Skeleton/>
          <AnswerItem.Skeleton/>
        </div>
      </AuditEditorShell>
    )
  }


  return (
    <AuditEditorShell>
      <Link
        href={`/audit/${auditId}`}
        className={cn(
          buttonVariants({variant: "ghost"}),
          "absolute left-[-150px] top-4 hidden xl:inline-flex"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4"/>
        Back to questions
      </Link>

      <AuditEditorHeader
        heading={question?.name as string}
        text={
          user?.role === 'consultant' ?
            "Create and manage answers." : "Manage answers."
        }
      >
        {
          user?.role === 'consultant' &&
            <AnswerCreateButton
                auditId={auditId}
                questionId={questionId}
                singleQuestionFetch={singleQuestionFetch}
                audit={audit}
            />
        }
      </AuditEditorHeader>

      {
        question?.answers?.length ? (
          <div className="divide-y divide-border rounded-md border mt-8 mx-2">
            {
              question?.answers?.map(answer => (
                  <AnswerItem
                    key={answer?.uid}
                    auditId={auditId}
                    audit={audit}
                    questionId={questionId}
                    answer={answer}
                    singleQuestionFetch={singleQuestionFetch}
                  />
                )
              )
            }
          </div>
        ) : (
          <EmptyPlaceholder className="mt-3">
            <EmptyPlaceholder.Icon name="audit"/>
            <EmptyPlaceholder.Title>No answer created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any answer yet. Start creating answer.
            </EmptyPlaceholder.Description>
            <AnswerCreateButton
              auditId={auditId}
              questionId={questionId}
              singleQuestionFetch={singleQuestionFetch}
              audit={audit}
            />
          </EmptyPlaceholder>
        )
      }


      {/* Add a from and fetch this question by question id from
            firebase db and implement all the other functionalities */}
      <hr className="mt-12"/>
      <div className="flex justify-center py-6 lg:py-10">
        <Link href={`/audit/${auditId}`} className={cn(buttonVariants({variant: "ghost"}))}>
          <Icons.chevronLeft className="mr-2 h-4 w-4"/>
          Back to questions
        </Link>
      </div>
    </AuditEditorShell>
  )
}
