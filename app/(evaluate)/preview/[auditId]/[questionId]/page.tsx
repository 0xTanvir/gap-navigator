'use client'
import QuestionAnswerList from "@/app/(evaluate)/preview/[auditId]/[questionId]/question-answer-list";

export default function PreviewQuestionPage({ params }: { params: { auditId: string, questionId: string } }) {
    return (
        <div className="py-6 lg:py-10">
            <QuestionAnswerList questionId={params.questionId} />
        </div>
    )
}
