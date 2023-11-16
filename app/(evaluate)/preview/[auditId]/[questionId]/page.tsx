'use client'
import {SingleAuditProvider} from "@/app/(evaluate)/auditContext";
import {AllQuestionProvider} from "@/app/(evaluate)/questionsContext";

import QuestionAnswerList from "@/app/(evaluate)/preview/[auditId]/[questionId]/question-answer-list";


export default function PreviewQuestionPage({params}: { params: { auditId:string, questionId: string } }) {
    const {auditId ,questionId} = params

    return (
        <SingleAuditProvider>
            <AllQuestionProvider>
                <div className="py-6 lg:py-10">
                    <QuestionAnswerList auditId={auditId} questionId={questionId}/>
                </div>
            </AllQuestionProvider>
        </SingleAuditProvider>
    )
}
