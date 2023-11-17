"use client"

import Image from "next/image"
import Link from "next/link"

import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder"
import { DocsPageHeader } from "../page-header"
import { Button } from "@/components/ui/button"
import usePreview from "../../preview-context"

export default function PreviewsPage({ params }: { params: { auditId: string } }) {
    const { preview } = usePreview()

    return (
        <div className="py-6 lg:py-10">
            <DocsPageHeader
                heading={preview.name}
                text={"Complete this audit to generate your report."}
            />
            <EmptyPlaceholder>
                <Image
                    src="/images/audit-start.svg"
                    alt="audit start image"
                    width={480}
                    height={270}
                    className="rounded-md transition-colors"
                />
                <EmptyPlaceholder.Title>
                    Total {preview.questions.length}
                    {preview.questions.length === 2 ? ' Questions' : ' Question'}
                </EmptyPlaceholder.Title>
                <Button size="xl" className="mt-8 text-sm font-semibold rounded-full" asChild>
                    {params.auditId && (<Link className="flex-none" href={`/preview/${params.auditId}/${preview.questions[0]?.uid}`}>
                        Lets Get Started
                    </Link>)}
                </Button>
            </EmptyPlaceholder>
        </div>
    )
}
