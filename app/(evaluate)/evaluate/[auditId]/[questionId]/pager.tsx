import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Evaluation } from "@/types/dto"
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";

interface EvaluatePagerProps {
    currentQuestion: string
    isLoading: boolean
    handleNextClick: () => void;
}

export function EvaluatePager({currentQuestion, isLoading, handleNextClick}: EvaluatePagerProps) {
    const {evaluation, dispatch} = useEvaluation()
    const pager = getPagerForQuestions(currentQuestion, evaluation)

    if (!pager) {
        return null
    }

    return (
        <div className="pt-12 flex flex-row items-center justify-between">
            {pager?.prev && (
                <Link
                    scroll={!pager.prev.disabled}
                    href={pager.prev.disabled || isLoading ? "#" : pager.prev.href}
                    className={cn(buttonVariants({variant: "ghost"}), pager.prev.disabled ? "opacity-50 cursor-not-allowed" : "")}
                >
                    <Icons.chevronLeft className="mr-2 h-4 w-4"/>
                    Previous
                </Link>
            )}
            {pager?.next && (
                <button
                    onClick={handleNextClick}
                    className={cn(buttonVariants({variant: "ghost"}), "ml-auto")}
                >
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                    Next
                    <Icons.chevronRight className="ml-2 h-4 w-4"/>
                </button>
            )}
        </div>
    )
}

export function getPagerForQuestions(currentQuestion: string, preview: Evaluation) {
    const currentQuestionIndex = preview.questions.findIndex(
        (question) => question.uid === currentQuestion
    )

    let prevFound: string | undefined;
    if (preview.evaluate.choices) {
        let findObject = preview.evaluate.choices.find(item => item.questionId === currentQuestion)
        if (findObject) {
            let indexFind = preview.evaluate.choices.findIndex(choice => choice.questionId === findObject?.questionId);
            prevFound = preview.evaluate.choices[indexFind - 1]?.questionId;
        }
        // else {
        //     console.log(preview.evaluate.choices.slice(-1)[0]?.questionId)
        // }
    }

    let previewQuestionsIndex: number | undefined;

    if (prevFound) {
        previewQuestionsIndex = preview.questions.findIndex(
            (question) => question.uid === prevFound
        );
    }

    const prevQuestion = previewQuestionsIndex !== undefined ? preview.questions[previewQuestionsIndex] : preview.questions[currentQuestionIndex - 1];
    const nextQuestion = preview.questions[currentQuestionIndex + 1];

    const prev = {
        title: prevQuestion?.name ?? "Previous Question",
        href: `/evaluate/${preview.uid}/${prevQuestion?.uid}`,
        disabled: !prevQuestion,
    }

    const next = {
        title: nextQuestion?.name ?? "Next Question",
        href: `/evaluate/${preview.uid}/${nextQuestion?.uid}`,
        disabled: !nextQuestion,
    }

    return {
        prev,
        next,
    }
}
