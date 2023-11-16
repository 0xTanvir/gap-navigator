"use client"
import Image from "next/image"
import Link from "next/link"
import {EmptyPlaceholder} from "@/components/dashboard/empty-placeholder"
import {DocsPageHeader} from "../page-header"
import {Button} from "@/components/ui/button"
import {useAllQuestion} from "@/app/(evaluate)/questionsContext";
import {useSingleAudit} from "@/app/(evaluate)/auditContext";

export default function PreviewsPage({params}: { params: { auditId: string } }) {
    const {allQuestion} = useAllQuestion()
    const {singleAudit} = useSingleAudit()
    const {auditId} = params
    console.log(allQuestion)
    console.log(params.auditId)

    let id: string | undefined;
    if (allQuestion && allQuestion.length > 0) {
        id = allQuestion[0].uid;
    }

    return (
        <div className="py-6 lg:py-10">
            <DocsPageHeader
                heading={singleAudit?.name as string}
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
                    Total {allQuestion?.length}
                    {allQuestion?.length === 2 ? ' Questions' : ' Question'}
                </EmptyPlaceholder.Title>
                <Button size="xl" className="mt-8 text-sm font-semibold rounded-full" asChild>
                    {id && (<Link className="flex-none" href={`/preview/${auditId}/${id}`}>
                        Lets Get Started
                    </Link>)}
                </Button>
            </EmptyPlaceholder>
        </div>
    )
}
