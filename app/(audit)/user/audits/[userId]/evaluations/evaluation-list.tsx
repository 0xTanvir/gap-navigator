"use client"
import React, { useEffect, useState } from 'react';
import { getUserById } from "@/lib/firestore/user";
import { getAllEvaluationWithAuditName } from "@/lib/firestore/evaluation";
import { Evaluate } from "@/types/dto";
import { fetchAuditsWithCount } from "@/lib/firestore/audit";
import EvaluationItem from "@/app/(audit)/user/audits/[userId]/evaluations/evaluation-item";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditItem } from "@/components/dashboard/audit-item";

interface EvaluationListProps {
  userId: string
}

const EvaluationList = ({userId}: EvaluationListProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [evaluations, setEvaluations] = useState<Evaluate[] | []>([])
  const router = useRouter()

  async function fetchUserEvaluation() {
    try {
      const dbUser = await getUserById(userId)
      const {audits} = await fetchAuditsWithCount()
      const newEvaluation: any = [];
      for (const audit of audits) {
        const evaluations = await getAllEvaluationWithAuditName(audit.uid);
        const uniqueEvaluations = new Set();
        evaluations.forEach((evaluation) => {
          const key = `${evaluation.auditName}-${evaluation.participantEmail}`;
          if (!uniqueEvaluations.has(key)) {
            uniqueEvaluations.add(key);
            newEvaluation.push(evaluation);
          }
        });
      }
      setEvaluations(newEvaluation.filter((evaluation: Evaluate) => evaluation.participantEmail === dbUser.email));
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Failed to fetch evaluations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserEvaluation()
  }, [])

  if (isLoading) {
    return (
        <>
          <AuditEditorShell>
            <Link
                href="#"
                className={cn(
                    buttonVariants({variant: "ghost"}),
                    "absolute left-[-150px] top-4 hidden xl:inline-flex"
                )}
            >
              <Skeleton className="h-10 w-24"/>
            </Link>

            <DashboardHeader heading="Evaluations" text="Manage evaluations.">
            </DashboardHeader>
            <div className="divide-border-200 divide-y rounded-md border mt-3">
              <AuditItem.Skeleton/>
              <AuditItem.Skeleton/>
              <AuditItem.Skeleton/>
              <AuditItem.Skeleton/>
              <AuditItem.Skeleton/>
            </div>
          </AuditEditorShell>
        </>
    )
  }

  return (
      <>
        <AuditEditorShell>
          <Link
              href="#"
              onClick={() => router.back()}
              className={cn(
                  buttonVariants({variant: "ghost"}),
                  "absolute left-[-150px] top-4 hidden xl:inline-flex"
              )}
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4"/>
            Back
          </Link>

          <DashboardHeader heading="Evaluations" text="Manage evaluations.">
          </DashboardHeader>
          <div>
            {evaluations?.length ? (
                <div className="divide-y divide-border rounded-md border mt-3">
                  {evaluations.map(evaluation => (
                      <EvaluationItem key={evaluation.uid} evaluation={evaluation}/>
                  ))}
                </div>
            ) : (
                <EmptyPlaceholder className="mt-3">
                  <EmptyPlaceholder.Icon name="evaluate"/>
                  <EmptyPlaceholder.Title>No evaluations</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    You don&apos;t have any evaluations yet.
                  </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
            )}
          </div>

          <hr className="mt-12 xl:hidden"/>
          <div className="flex justify-center py-6 lg:py-10 xl:hidden">
            <Link
                href="#"
                onClick={() => router.back()}
                className={cn(buttonVariants({variant: "ghost"}))}>
              <Icons.chevronLeft className="mr-2 h-4 w-4"/>
              Back
            </Link>
          </div>
        </AuditEditorShell>
      </>
  );
};

export default EvaluationList;