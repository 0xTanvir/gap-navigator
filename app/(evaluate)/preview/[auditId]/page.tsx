import Image from "next/image"
import Link from "next/link"
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder"
import { DocsPageHeader } from "../page-header"
import { Button } from "@/components/ui/button"
import { audit } from "../../layout"

export default function PreviewsPage({ params }: { params: { auditId: string } }) {
  return (
    <div className="py-6 lg:py-10">
      <DocsPageHeader
        heading={audit.title}
        text={audit.description}
      />
      <EmptyPlaceholder>
        <Image
          src="/images/audit-start.svg"
          alt="audit start image"
          width={480}
          height={270}
          className="rounded-md transition-colors"
        />
        <EmptyPlaceholder.Title>Total {audit.questions.length} Questions</EmptyPlaceholder.Title>
        <Button size="xl" className="mt-8 text-sm font-semibold rounded-full" asChild>
          <Link className="flex-none" href="/preview/2e6d211f-a0fe-4667-936a-1d5f34455a3e/1">
            Lets Get Started
          </Link>
        </Button>
      </EmptyPlaceholder>
    </div>
  )
}
