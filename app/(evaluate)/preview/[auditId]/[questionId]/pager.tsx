import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import usePreview from "@/app/(evaluate)/preview-context"
import { Preview } from "@/types/dto"

interface PreviewPagerProps {
  currentQuestion: string
}

export function PreviewPager({currentQuestion}: PreviewPagerProps) {
  const {preview} = usePreview()
  const pager = getPagerForQuestions(currentQuestion, preview)

  if (!pager) {
    return null
  }

  return (
      <div className="pt-12 flex flex-row items-center justify-between">
        {pager?.prev && (
            <Link
                scroll={!pager.prev.disabled}
                href={pager.prev.disabled ? "#" : pager.prev.href}
                className={cn(buttonVariants({variant: "ghost"}), pager.prev.disabled ? "opacity-50 cursor-not-allowed" : "")}
            >
              <Icons.chevronLeft className="mr-2 h-4 w-4"/>
              Previous
            </Link>
        )}
        {pager?.next && (
            <Link
                scroll={!pager.next.disabled}
                href={pager.next.disabled ? `/preview/${preview.uid}/completed` : pager.next.href}
                className={cn(buttonVariants({variant: "ghost"}), "ml-auto")}
            >
              {pager.next.disabled ? "Submit" : "Next"}
              {!pager.next.disabled &&
                  <Icons.chevronRight className="ml-2 h-4 w-4"/>
              }
            </Link>
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
    href: `/preview/${preview.uid}/${prevQuestion?.uid}`,
    disabled: !prevQuestion,
  }

  const next = {
    title: nextQuestion?.name ?? "Next Question",
    href: `/preview/${preview.uid}/${nextQuestion?.uid}`,
    disabled: !nextQuestion,
  }

  return {
    prev,
    next,
  }
}
