import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { getUserById } from "@/lib/firestore/user";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { AuditActionType } from "@/types/dto";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import useAudits from "@/components/dashboard/AuditsContext";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditCreateButton } from "@/components/dashboard/audit-create-button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface UserAuditsProps {
  userId: string
}

const UserAudits = ({userId}: UserAuditsProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const {audits, dispatch} = useAudits()

  async function fetchUserAllAudits() {
    try {
      const dbUser = await getUserById(userId)
      const dbAudits = await getAuditsByIds(dbUser.audits)
      dispatch({type: AuditActionType.ADD_MULTIPLE_AUDITS, payload: dbAudits})
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Failed to fetch audits. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserAllAudits()
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

            <DashboardHeader heading="Audits" text="Create and manage audits.">
              <Skeleton className="h-10 w-32"/>
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
              href="/consultants"
              className={cn(
                  buttonVariants({variant: "ghost"}),
                  "absolute left-[-150px] top-4 hidden xl:inline-flex"
              )}
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4"/>
            Back
          </Link>

          <DashboardHeader heading="Audits" text="Create and manage audits.">
            <AuditCreateButton userId={userId}/>
          </DashboardHeader>
          <div>
            {audits?.length ? (
                <div className="divide-y divide-border rounded-md border mt-3">
                  {audits.map((audit) => (
                      <AuditItem key={audit.uid} userId={userId} audit={audit}/>
                  ))}
                </div>
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

          <hr className="mt-12 xl:hidden"/>
          <div className="flex justify-center py-6 lg:py-10 xl:hidden">
            <Link
                href="/consultants"
                className={cn(buttonVariants({variant: "ghost"}))}>
              <Icons.chevronLeft className="mr-2 h-4 w-4"/>
              Back
            </Link>
          </div>
        </AuditEditorShell>
      </>
  );
};

export default UserAudits;