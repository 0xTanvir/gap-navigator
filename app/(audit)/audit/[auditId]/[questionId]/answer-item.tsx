import React from 'react';
import {formatDate} from "@/lib/utils";
import {Answer} from "@/types/dto";
import AnswerOperations from "@/app/(audit)/audit/[auditId]/[questionId]/answer-operations";
import {Skeleton} from "@/components/ui/skeleton";

interface AnswerItemProps {
    answer: Answer
    auditId: string
    questionId: string
    singleQuestionFetch: Function
}

const AnswerItem = ({answer, auditId, questionId, singleQuestionFetch}: AnswerItemProps) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <div className="flex gap-2">
                    <p className="font-semibold hover:underline">
                        {answer?.name}
                    </p>
                </div>

                <div>
                    <p className="flex text-sm text-muted-foreground">
                        {formatDate(answer.createdAt)}
                    </p>
                </div>
            </div>

            <AnswerOperations
                auditId={auditId}
                questionId={questionId}
                singleQuestionFetch={singleQuestionFetch}
                answerId={answer.uid}
                answer={answer}
            />
        </div>
    );
};

AnswerItem.Skeleton = function AnswerItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5"/>
                <Skeleton className="h-4 w-4/5"/>
            </div>
        </div>
    )
}


export default AnswerItem;