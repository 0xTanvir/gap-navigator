'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import ClientDashboard from "@/components/dashboard/client-dashboard"
import ConsultantDashboard from "@/components/dashboard/consultant-dashboard"
import { AuditsProvider } from "@/components/dashboard/AuditsContext"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardPage() {
    const { user, isAuthenticated, loading } = useAuth()
    if (loading) {
        return (
            <DashboardShell>
                <DashboardHeader.Skeleton />
            </DashboardShell>
        )
    }
    if (isAuthenticated && user && user.role === "client") {
        return (
            <ClientDashboard />
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <AuditsProvider><ConsultantDashboard userId={user.uid} /></AuditsProvider>
        )
    } else {
        return notFound()
    }
}
