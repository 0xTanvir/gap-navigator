import React from "react";

import { useState, useEffect } from "react";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditCreateButton } from "@/components/dashboard/audit-create-button";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { AuditActionType } from "@/types/dto";
import { toast } from "sonner";
import useAudits from "./AuditsContext";
import AuditsPagination from "@/components/dashboard/audits-pagination";

interface ConsultantAuditsProps {
  userId: string;
  userAuditsId: string[];
}

export default function ConsultantAudits({
                                           userId,
                                           userAuditsId,
                                         }: ConsultantAuditsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const {audits, dispatch} = useAudits();

  // Get current audits
  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize
  const currentAudits = audits.slice(indexOfFirstAudit, indexOfLastAudit)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    async function fetchAudits() {
      try {
        const dbAudits = await getAuditsByIds(userAuditsId);
        dispatch({
          type: AuditActionType.ADD_MULTIPLE_AUDITS,
          payload: dbAudits,
        });
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.", {
          description: "Failed to fetch audits. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAudits();
  }, [userAuditsId]); // Run this effect when the userId changes

  if (isLoading) {
    return (
        <>
          <DashboardHeader heading="Audits" text="Create and manage audits.">
            <AuditCreateButton userId={userId}/>
          </DashboardHeader>
          <div className="divide-border-200 divide-y rounded-md border">
            <AuditItem.Skeleton/>
            <AuditItem.Skeleton/>
            <AuditItem.Skeleton/>
            <AuditItem.Skeleton/>
            <AuditItem.Skeleton/>
          </div>
        </>
    );
  }

  return (
      <>
        <DashboardHeader heading="Audits" text="Create and manage audits.">
          <AuditCreateButton userId={userId}/>
        </DashboardHeader>
        <div>
          {audits?.length ? (
              <>
                <div className="divide-y divide-border rounded-md border">
                  {currentAudits.map((audit) => (
                      <AuditItem key={audit.uid} userId={userId} audit={audit}/>
                  ))}
                </div>
                <AuditsPagination
                    totalItems={audits.length}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    paginate={paginate}
                    totalPage={Math.ceil(audits.length / pageSize)}
                />
              </>
          ) : (
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="audit"/>
                <EmptyPlaceholder.Title>No audits created</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  You don&apos;t have any audits yet. Start creating audit.
                </EmptyPlaceholder.Description>
                <AuditCreateButton userId={userId} variant="outline"/>
              </EmptyPlaceholder>
          )}
        </div>
      </>
  );
}
