import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Evaluation, Preview } from "@/types/dto"
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";

interface EvaluatePagerProps {
  currentQuestion: string
  isLoading: boolean
  handleNextClick: () => void;
}

export function EvaluateControlPager({currentQuestion, isLoading, handleNextClick}: EvaluatePagerProps) {
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

export function getPagerForQuestions(currentQuestion: string, preview: Preview) {
  const currentQuestionIndex = preview.questions.findIndex(
    (question) => question.uid === currentQuestion
  )
  const prevQuestion = preview.questions[currentQuestionIndex - 1]
  const nextQuestion = preview.questions[currentQuestionIndex + 1]

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
