import React, {useEffect, useState} from 'react'
import Link from "next/link"
import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {Icons} from "@/components/icons"
import {AuditEditorShell} from './audit-editor-shell'
import {AuditEditorHeader} from './audit-editor-header'
import {QuestionCreateButton} from './question-create-button'
import {allQuestions, getAudit} from "@/lib/firestore/audit";
import {Audit, QuestionActionType} from "@/types/dto";
import {toast} from "@/components/ui/use-toast";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import QuestionItem from "@/app/(audit)/audit/[auditId]/question-item";

interface AuditEditorProps {
    userId: string;
    auditId: string;
}

export default function QuestionList({userId, auditId}: AuditEditorProps) {
    const [audit, setAudit] = useState<Audit | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {questions, dispatch} = useQuestions()

    useEffect(() => {
        async function fetchAudit() {
            try {
                const dbAudit = await getAudit(auditId)
                setAudit(dbAudit)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAudit()
    }, [auditId])

    useEffect(() => {
        async function allQuestion() {
            try {
                let dbQuestions = await allQuestions(auditId)
                dispatch({type: QuestionActionType.ADD_MULTIPLE_QUESTIONS, payload: dbQuestions})
            } catch (error) {
                console.log(error)
                toast({
                    title: "Something went wrong.",
                    description: "Failed to fetch audits. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }
        allQuestion()
    }, [])

    return (
        <AuditEditorShell>
            <Link
                href="/audits"
                className={cn(
                    buttonVariants({variant: "ghost"}),
                    "absolute left-[-150px] top-4 hidden xl:inline-flex"
                )}
            >
                <Icons.chevronLeft className="mr-2 h-4 w-4"/>
                See all audits
            </Link>

            <AuditEditorHeader heading={audit?.name as string} text="Create and manage questions.">
                <QuestionCreateButton auditId={auditId as string}/>
            </AuditEditorHeader>

            {
                questions.length ? (
                    <div className="divide-y divide-border rounded-md border mt-3">
                        {
                            questions.map(question => (
                                <QuestionItem key={question.uid} question={question} auditId={auditId}/>
                            ))
                        }
                    </div>
                ) : null
            }

            <hr className="mt-12"/>
            <div className="flex justify-center py-6 lg:py-10">
                <Link href="/audits" className={cn(buttonVariants({variant: "ghost"}))}>
                    <Icons.chevronLeft className="mr-2 h-4 w-4"/>
                    See all audits
                </Link>
            </div>
        </AuditEditorShell>
    )
}
