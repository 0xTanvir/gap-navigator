'use client'
import * as React from "react"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { clientDashboardConfig, consultantDashboardConfig } from "@/config/dashboard"
import { useAuth } from "@/components/auth/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DashboardShell({
    children,
    className,
    ...props
}: DashboardShellProps) {
    const { user, isAuthenticated, loading } = useAuth()
    if (loading) {
        return (
            <>
                <aside className="hidden w-[200px] flex-col md:flex">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full mt-2" />
                    <Skeleton className="h-9 w-full mt-2" />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    <DashboardHeader.Skeleton />
                </main >
            </>
        )
    }
    if (isAuthenticated && user && user.role === "client") {
        return (
            <>
                <aside className="hidden w-[200px] flex-col md:flex">
                    <DashboardNav items={clientDashboardConfig.sidebarNav} />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    <div className={cn("grid items-start gap-8", className)} {...props}>
                        {children}
                    </div>
                </main >
            </>
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <>
                <aside className="hidden w-[200px] flex-col md:flex">
                    <DashboardNav items={consultantDashboardConfig.sidebarNav} />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    <div className={cn("grid items-start gap-8", className)} {...props}>
                        {children}
                    </div>
                </main >
            </>
        )
    }
    else {
        return notFound()
    }

}
