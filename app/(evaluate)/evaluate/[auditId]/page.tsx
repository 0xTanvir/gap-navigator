"use client"
import React from 'react';
import {DocsPageHeader} from "@/app/(evaluate)/preview/page-header";
import {EmptyPlaceholder} from "@/components/dashboard/empty-placeholder";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import {Skeleton} from "@/components/ui/skeleton";

export default function EvaluatePage({params}: { params: { auditId: string } }) {
    const {evaluation} = useEvaluation()

    return (
        <div className="py-6 lg:py-10">
            <DocsPageHeader
                heading={evaluation.name}
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
                    Total {evaluation.questions.length}
                    {evaluation.questions.length >= 2 ? ' Questions' : ' Question'}
                </EmptyPlaceholder.Title>
                <Button size="xl" className="mt-8 text-sm font-semibold rounded-full" asChild>
                    {evaluation.questions.length > 0 && (
                        <Link className="flex-none"
                              href={`/evaluate/${params.auditId}/${evaluation.questions[0]?.uid}`}>
                            Lets Get Started
                        </Link>)
                    }
                </Button>
            </EmptyPlaceholder>
        </div>
    );
};

EvaluatePage.Skeleton = function EvaluatePageSkeleton() {
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