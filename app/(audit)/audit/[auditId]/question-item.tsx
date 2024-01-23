import React from 'react';
import Link from "next/link";
import {formatDate} from "@/lib/utils";
import {Question} from "@/types/dto";
import {Skeleton} from "@/components/ui/skeleton";
import QuestionOperations from "@/app/(audit)/audit/[auditId]/question-operations";

interface QuestionItemProps {
    auditId: string
    question: Question
    setUnorderQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const QuestionItem = ({auditId, question, setUnorderQuestions}: QuestionItemProps) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <div className="flex gap-2">
                    <Link
                        href={`/audit/${auditId}/${question.uid}`}
                        className="font-semibold hover:underline"
                    >
                        {question.name}
                    </Link>
                </div>

                <div>
                    <p className="flex text-sm text-muted-foreground">
                        {formatDate(question.createdAt)}
                    </p>
                </div>
            </div>

            <QuestionOperations
                auditId={auditId}
                question={question}
                questionId={question.uid}
                setUnorderQuestions={setUnorderQuestions}
            />

        </div>
    )
}
QuestionItem.Skeleton = function QuestionItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5"/>
                <Skeleton className="h-4 w-4/5"/>
            </div>
        </div>
    )
}

export default QuestionItem;