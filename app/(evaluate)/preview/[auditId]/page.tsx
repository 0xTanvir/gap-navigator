"use client"

import React from "react";
import Image from "next/image"
import Link from "next/link"

import {EmptyPlaceholder} from "@/components/dashboard/empty-placeholder"
import {DocsPageHeader} from "../page-header"
import {Button} from "@/components/ui/button"
import usePreview from "../../preview-context"
import {Skeleton} from "@/components/ui/skeleton";

export default function PreviewsPage({params}: { params: { auditId: string } }) {
    const {preview} = usePreview()

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
                    {preview.questions.length >= 2 ? ' Questions' : ' Question'}
                </EmptyPlaceholder.Title>
                <Button size="xl" className="mt-8 text-sm font-semibold rounded-full" asChild>
                    {preview.questions.length > 0 ? (
                            <Link className="flex-none" href={`/preview/${params.auditId}/${preview.questions[0]?.uid}`}>
                                Lets Get Started
                            </Link>) :
                        (<Link className="flex-none" href={`/audit/${params.auditId}`}>Lets Create Question</Link>)
                    }
                </Button>
            </EmptyPlaceholder>
        </div>
    )
}

PreviewsPage.Skeleton = function PreviewsPageSkeleton() {
    return (
        <EmptyPlaceholder className="mt-4">
            <Image
                src="/images/audit-start.svg"
                alt="audit start image"
                width={480}
                height={270}
                className="rounded-md transition-colors"
            />
            <div className="mt-6 text-xl font-semibold flex">
                Total <Skeleton className="w-28 ml-2"/>
            </div>
            <Button disabled={true} size="xl" className="mt-8 text-sm font-semibold rounded-full">
                Lets Get Started
            </Button>
        </EmptyPlaceholder>
    )
}