import React, {useEffect, useState} from 'react'
import Link from "next/link"
import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {Icons} from "@/components/icons"
import {AuditEditorShell} from '../audit-editor-shell'
import {AuditEditorHeader} from '../audit-editor-header'
import {Question, QuestionActionType} from "@/types/dto";
import {singleQuestion} from "@/lib/firestore/audit";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {questionSchema} from "@/lib/validations/question";
import * as z from "zod";
import {Collections} from "@/lib/firestore/client";
import {updateDoc} from "firebase/firestore";
import {toast} from "@/components/ui/use-toast";
import AnswerCreateButton from "@/app/(audit)/audit/[auditId]/[questionId]/answer-create-button";
import AnswerItem from "@/app/(audit)/audit/[auditId]/[questionId]/answer-item";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import {QuestionCreateButton} from "@/app/(audit)/audit/[auditId]/question-create-button";

interface AuditEditorProps {
    userId: string;
    auditId: string;
    questionId: string
}

type FormData = z.infer<typeof questionSchema>

export default function AnswerList({userId, auditId, questionId}: AuditEditorProps) {
    const [question, setQuestion] = useState<Question | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {dispatch} = useQuestions()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(questionSchema)
    })

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        let formData = {
            uid: question?.uid,
            name: data.question_name,
            answers: question?.answers,
            createdAt: question?.createdAt,
        }
        const questionRef = Collections.question(auditId, questionId)
        try {
            await updateDoc(questionRef, formData)
            dispatch({type: QuestionActionType.UPDATE_QUESTION, payload: formData as Question})
            toast({
                title: 'Question updated successfully!',
                variant: 'default',
                description: `Your Question was updated.`,
            })
            setIsLoading(false)
        } catch (error) {
            console.error('Error updating document:', error);
            setIsLoading(false)
        }
    }

    async function singleQuestionFetch() {
        const dbQuestion = await singleQuestion(auditId, questionId)
        setQuestion(dbQuestion as Question)
        setLoading(false)
    }

    useEffect(() => {
        singleQuestionFetch()
    }, [auditId, questionId])

    if (loading) {
        return (<AuditEditorShell>
                <AuditEditorHeader heading="Answers" text="Create and manage answers.">
                    <QuestionCreateButton auditId={auditId as string}/>
                </AuditEditorHeader>
                <div className="divide-border-200 divide-y rounded-md border">
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

            <AuditEditorHeader heading="Answers" text="Create and manage answers.">
                <AnswerCreateButton
                    auditId={auditId}
                    questionId={questionId}
                    singleQuestionFetch={singleQuestionFetch}
                />
            </AuditEditorHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full flex items-end justify-between">
                    <div className="w-11/12">
                        <Label htmlFor="question_name" className="block text-sm font-medium leading-6">
                            Question Name
                        </Label>
                        <Input
                            className="mt-2 text-2xl h-12"
                            id="question_name"
                            variant="ny"
                            placeholder="question_name"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="question_name"
                            autoCorrect="off"
                            disabled={loading || isLoading}
                            defaultValue={question?.name || ''}
                            {...register('question_name')}
                        />
                        {errors?.question_name && (
                            <p className="px-1 mt-1.5 text-xs">
                                {errors.question_name.message}
                            </p>
                        )}
                    </div>
                    <button
                        className="flex justify-center items-center w-w-1/12 h-12 border rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm"
                        disabled={loading || isLoading}
                    >
                        <Icons.save/>
                    </button>
                </div>
            </form>


            {
                question?.answers?.length ? (
                    <div className="divide-y divide-border rounded-md border mt-3">
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
                ) : null
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
