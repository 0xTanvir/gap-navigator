"use client"
import React from 'react';
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import NotificationList from "@/components/notification/notification-list";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface NotificationShellProps {
  children?: React.ReactNode
}

const NotificationShell = ({children}: NotificationShellProps) => {
  const {user, isAuthenticated, loading} = useAuth()
  const router = useRouter()
  if (loading || (isAuthenticated && !user)) {
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

        <AuditEditorHeader heading="Notification List" text="Manage notification list."/>

        <div className="divide-border-200 divide-y rounded-md border mt-3">
          <NotificationList.Skeleton/>
          <NotificationList.Skeleton/>
          <NotificationList.Skeleton/>
        </div>
      </AuditEditorShell>
    )
  } else if (isAuthenticated && user) {
    return (
      <>
        {children}
      </>
    )
  } else if (!isAuthenticated || !user) {
    router.push("/")
  }
};

export default NotificationShell;