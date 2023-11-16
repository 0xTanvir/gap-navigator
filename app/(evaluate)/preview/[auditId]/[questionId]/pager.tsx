import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { audit } from "@/app/(evaluate)/layout"

interface DocsPagerProps {}

 // TODO: here pass the questions id length for pager
export function DocsPager() {
  // TODO: here pass the questions to generate pager
  const pager = getPagerForQuestions()

  if (!pager) {
    return null
  }

  return (
    <div className="pt-12 flex flex-row items-center justify-between">
      {pager?.prev && (
        <Link
          href={pager.prev.href}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Link>
      )}
      {pager?.next && (
        <Link
          href={pager.next.href}
          className={cn(buttonVariants({ variant: "ghost" }), "ml-auto")}
        >
          Next
          <Icons.chevronRight className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export function getPagerForQuestions() {
  // TODO: here pass the questions to generate pager
  const prev = {
    title: "How do I use Next.js with TypeScript?",
    href: "/preview/2e6d211f-a0fe-4667-936a-1d5f34455a3e/1",
  }
  const next = {
    title: "How do I use Golang?",
    href: "/preview/2e6d211f-a0fe-4667-936a-1d5f34455a3e/2",
  }
  return {
    prev,
    next,
  }
}
