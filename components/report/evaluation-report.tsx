"use client"
import React, { useEffect, useState } from 'react';
import { getAllCompletedEvaluations } from "@/lib/firestore/evaluation";
import { Evaluate, Questions } from "@/types/dto";
import { getQuestionsById } from "@/lib/firestore/question";
import { Icons } from "@/components/icons";
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface EvaluationReportProps {
  auditId: string
}

type AnswerCount = {
  answerId: string;
  count: number;
};
type Answer = {
  questionId: string;
  answerId: string;
  additionalNote: string;
  internalNote: string;
  recommendedNote: string;
};

const EvaluationReport = ({auditId}: EvaluationReportProps) => {
  const [evaluations, setEvaluations] = useState<Evaluate[]>([])
  const [audit, setAudit] = useState<string>("")
  const [questions, setQuestions] = useState<Questions | []>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [answerSelectCount, setAnswerSelectCount] = useState<AnswerCount[] | []>([])

  const router = useRouter()

  function countAnswerSelections(...answers: Answer[][]): AnswerCount[] {
    const allAnswers = answers.flat(); // Flatten the array of arrays into a single array
    const answerCountMap: Record<string, number> = {};

    allAnswers.forEach((answer) => {
      if (answerCountMap[answer.answerId]) {
        answerCountMap[answer.answerId] += 1;
      } else {
        answerCountMap[answer.answerId] = 1;
      }
    });

    const answerCounts: AnswerCount[] = Object.keys(answerCountMap).map((answerId) => ({
      answerId,
      count: answerCountMap[answerId],
    }));

    return answerCounts;
  }

  useEffect(() => {
    async function fetchEvaluation() {
      try {
        const {auditName, evaluations} = await getAllCompletedEvaluations(auditId)
        const dbQuestion = await getQuestionsById(auditId)
        setQuestions(dbQuestion)
        setAudit(auditName)
        setEvaluations(evaluations)
        // Dynamically extract choices from all evaluations and pass them to countAnswerSelections
        const allChoices = evaluations.map(evaluation => evaluation.choices).flat();
        const result = countAnswerSelections(allChoices);
        // const result = countAnswerSelections(evaluations[0].choices, evaluations[1].choices);
        setAnswerSelectCount(result)
        console.log(result);
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvaluation()
  }, []);

  // Sort answerSelectCount by count in descending order for ranking
  const sortedAnswerSelectCount = [...answerSelectCount].sort((a, b) => b.count - a.count);

  // Function to get border color class based on answerCount
  const getBorderColorClass = (answerCount: number) => {
    if (answerCount === 0) return 'border-gray-400 text-gray-600';
    const rank = sortedAnswerSelectCount.findIndex(ac => ac.count === answerCount);
    if (rank === 0) return 'border-green-500 text-green-700';
    if (rank === 1) return 'border-blue-500 text-blue-700';
    if (rank === 2) return 'border-yellow-500 text-yellow-700';
    if (rank === 3) return 'border-red-500 text-red-700';
    return 'border-gray-400 text-gray-600';
  };

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-10"/>
        <div className="flex justify-end items-center gap-2 my-5">
          <Skeleton className="w-24 h-10"/>
        </div>
        {
          [1, 2, 3, 4].map(data => (
            <React.Fragment key={data}>
              <div className="flex gap-2 items-center justify-between mt-8">
                <Skeleton className="w-10 h-12"/>
                <Skeleton className="w-full h-12"/>
              </div>
              <hr className="my-4"/>
              <Skeleton className="w-full h-11 mb-4"/>
              <Skeleton className="w-full h-11 mb-4"/>
              <Skeleton className="w-full h-11 mb-4"/>
              <Skeleton className="w-full h-11"/>
            </React.Fragment>
          ))
        }
      </>
    )
  }

  return (
    <div>
      <AuditEditorHeader heading={audit as string}/>
      <div className="flex justify-end items-center gap-2 my-5">
        <Button
          variant="secondary"
          onClick={() => router.back()}
        >
          <Icons.back className="mr-2 h-4 w-4"/>
          Back
        </Button>
      </div>
      {
        questions?.map((question, index) => (
          <div key={question.uid}>
            <h2 className="inline-block font-heading text-4xl lg:text-5xl">{index + 1 + ". "}{question.name}</h2>
            <hr className="my-4"/>
            {
              question?.answers.map((answer, index) => {
                const answerCount = answerSelectCount.find(ac => ac.answerId === answer.uid)?.count || 0;
                const borderColorClass = getBorderColorClass(answerCount);
                return (
                  <div key={answer.uid}
                       className={`mb-4 rounded-lg border shadow-sm focus:outline-none grid grid-cols-12 space-x-0 space-y-0 w-full gap-2 mt-4 gap-y-6 sm:gap-x-4`}>
                    <p
                      className="font-normal block  text-sm cursor-pointer col-span-11 py-2.5 px-1.5">
                      {index + 1 + ". "} {answer.name}
                    </p>
                    <div
                      className={`col-span-1 grid place-content-center  mr-0.5 ${borderColorClass}`}>
                      <span className="font-bold">{answerCount}</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        ))
      }

    </div>
  );
};

export default EvaluationReport;