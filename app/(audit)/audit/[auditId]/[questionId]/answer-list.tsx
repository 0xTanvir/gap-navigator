import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AuditEditorShell } from '../audit-editor-shell'
import { AuditEditorHeader } from '../audit-editor-header'
import { Question } from "@/types/dto";
import { getQuestionById } from "@/lib/firestore/question";
import { questionSchema } from "@/lib/validations/question";
import * as z from "zod";
import AnswerCreateButton from "@/app/(audit)/audit/[auditId]/[questionId]/answer-create-button";
import AnswerItem from "@/app/(audit)/audit/[auditId]/[questionId]/answer-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";

interface AuditEditorProps {
    userId: string;
    auditId: string;
    questionId: string
}

type FormData = z.infer<typeof questionSchema>

export default function AnswerList({auditId, questionId}: AuditEditorProps) {
    const [question, setQuestion] = useState<Question | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    async function singleQuestionFetch() {
        const dbQuestion = await getQuestionById(auditId, questionId)
        setQuestion(dbQuestion as Question)
        setLoading(false)
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

            <AuditEditorHeader heading={question?.name as string} text="Create and manage answers.">
                <AnswerCreateButton
                    auditId={auditId}
                    questionId={questionId}
                    singleQuestionFetch={singleQuestionFetch}
                />
            </AuditEditorHeader>

            {
                question?.answers?.length ? (
                    <div className="divide-y divide-border rounded-md border mt-8 mx-2">
                        {
                            question?.answers?.map(answer => (
                                    <AnswerItem
                                        key={answer?.uid}
                                        auditId={auditId}
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
