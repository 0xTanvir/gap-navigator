"use client"
import React, { useEffect } from 'react';
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { MainNav } from "@/components/nav/main-nav";
import { auditEditorConfig } from "@/config/marketing";
import { ProfileNav } from "@/components/nav/profile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationNav from "@/components/nav/notification-nav";
import { SiteFooter } from "@/components/site-footer";
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import QuestionItem from "@/app/(audit)/audit/[auditId]/question-item";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";

interface AuditShellProps {
  children?: React.ReactNode
}

const AuditShell = ({children}: AuditShellProps) => {
  const {user, isAuthenticated, loading} = useAuth()
  const router = useRouter()

  if (loading || (isAuthenticated && !user)) {
    return (
      <>
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-20 items-center justify-between py-4">
            <MainNav items={auditEditorConfig.mainNav}/>
            <nav className="flex gap-2 items-center">
              <ProfileNav/>
              <ModeToggle/>
              <NotificationNav/>
            </nav>
          </div>
        </header>
        <main className="flex-1">
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
            <AuditEditorHeader.Skeleton/>
            <div className="divide-border-200 mt-8 divide-y rounded-md border">
              <QuestionItem.Skeleton/>
              <QuestionItem.Skeleton/>
              <QuestionItem.Skeleton/>
              <QuestionItem.Skeleton/>
              <QuestionItem.Skeleton/>
            </div>
            <hr className="mt-12"/>
            <div className="flex justify-center py-6 lg:py-10">
              <Link href="/audits" className={cn(buttonVariants({variant: "ghost"}))}>
                <Icons.chevronLeft className="mr-2 h-4 w-4"/>
                See all audits
              </Link>
            </div>
          </AuditEditorShell>
        </main>
        <SiteFooter/>

      </>
    )
  } else if (isAuthenticated && user) {
    return (<>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-20 items-center justify-between py-4">
          <MainNav items={auditEditorConfig.mainNav}/>
          <nav className="flex gap-2 items-center">
            <ProfileNav/>
            <ModeToggle/>
            <NotificationNav/>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter/>
    </>)
  } else if (!isAuthenticated || !user) {
    router.push("/")
  }
};

export default AuditShell;