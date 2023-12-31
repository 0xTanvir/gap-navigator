"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { Audits } from "@/types/dto";
import { getAuditsByType } from "@/lib/firestore/audit";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import AuditItem from "@/app/(audit)/audits/[auditType]/audit-item";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditTypeProps {
  auditType: string;
}

const AuditsList = ({ auditType }: AuditTypeProps) => {
  const [audits, setAudits] = useState<Audits | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  async function fetchAudits() {
    try {
      const dbAudits = await getAuditsByType(user?.uid as string, auditType);
      setAudits(dbAudits);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch audits. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.uid && auditType) {
      fetchAudits();
    }
  }, [auditType, user?.uid]);

  if (isLoading) {
    return (
      <>
        <AuditEditorShell>
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-[-150px] top-4 hidden xl:inline-flex"
            )}
          >
            <Skeleton className="h-10 w-24" />
          </Link>

          <DashboardHeader
            heading="Audits"
            text="List of audits."
          ></DashboardHeader>
          <div className="divide-border-200 divide-y rounded-md border mt-3">
            <AuditItem.Skeleton />
            <AuditItem.Skeleton />
            <AuditItem.Skeleton />
            <AuditItem.Skeleton />
            <AuditItem.Skeleton />
          </div>
        </AuditEditorShell>
      </>
    );
  }

  return (
    <>
      <AuditEditorShell>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-[-150px] top-4 hidden xl:inline-flex"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </Link>

        <DashboardHeader
          heading="Audits"
          text="List of audits."
        ></DashboardHeader>
        <div>
          {audits?.length ? (
            <div className="divide-y divide-border rounded-md border mt-3">
              {audits.map((audit) => (
                <AuditItem key={audit.uid} audit={audit} />
              ))}
            </div>
          ) : (
            <EmptyPlaceholder className="mt-3">
              <EmptyPlaceholder.Icon name="audit" />
              <EmptyPlaceholder.Title>No audits</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                You don&apos;t have any audits yet.
              </EmptyPlaceholder.Description>
            </EmptyPlaceholder>
          )}
        </div>

        <hr className="mt-12 xl:hidden" />
        <div className="flex justify-center py-6 lg:py-10 xl:hidden">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </div>
      </AuditEditorShell>
    </>
  );
};

export default AuditsList;
