"use client"
import React, { useEffect, useState } from 'react';
import { getAllCompletedEvaluations } from "@/lib/firestore/evaluation";
import { Evaluate } from "@/types/dto";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AuditEditorShell } from '@/app/(audit)/audit/[auditId]/audit-editor-shell';
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import { AuditItem } from "@/components/dashboard/audit-item";

interface EvaluationsListProps {
  auditId: string
}

const EvaluationsList = ({auditId}: EvaluationsListProps) => {
  const [evaluations, setEvaluations] = useState<Evaluate[]>([])
  const [audit, setAudit] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchEvaluation() {
      try {
        const {auditName, evaluations} = await getAllCompletedEvaluations(auditId)
        setAudit(auditName)
        setEvaluations(evaluations)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvaluation()
  }, []);

  if (isLoading) {
    return (
      <AuditEditorShell>
        <AuditEditorHeader.Skeleton/>
        <div className="divide-border-200 divide-y rounded-md border mt-8">
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
        </div>
      </AuditEditorShell>
    );
  }

  return (
    <AuditEditorShell>
      <Link
        href="/audits"
        className={cn(
          buttonVariants({variant: "ghost"}),
          "absolute left-[-150px] top-4 hidden xl:inline-flex"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4"/>
        See all audits
      </Link>
      <AuditEditorHeader
        heading={audit}
        text=""
      />

      {
        evaluations.length > 0 ?
          <div className="divide-y divide-border rounded-md border mt-8">
            {evaluations.map(evaluation => (
              <div key={evaluation.uid} className="divide-y divide-border border">
                <div className="flex items-center justify-between p-4">
                  <div className="grid gap-1">
                    <div className="flex gap-2">
                      <Link
                        href={`/audit/${auditId}/review/${evaluation.uid}`}
                        className="font-semibold capitalize hover:underline"
                      >
                        {evaluation.participantFirstName + " " + evaluation.participantLastName}
                      </Link>
                    </div>

                    <div>
                      <p className="flex text-sm text-muted-foreground">
                        {formatDate(evaluation.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          :
          <div className="divide-y divide-border rounded-md border mt-8">
            <div className="text-center font-semibold py-10">No Data Found</div>
          </div>
      }

    </AuditEditorShell>
  );
};

export default EvaluationsList;