'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import ClientAudits from "@/components/dashboard/client-audits"
import ConsultantAudits from "@/components/dashboard/consultant-audits"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuditsProvider } from "@/components/dashboard/AuditsContext"

export default function AuditsPage() {
    const { user, isAuthenticated, loading } = useAuth()
    if (loading) {
        return (
            <DashboardHeader.Skeleton />
        )
    }
    if (isAuthenticated && user && user.role === "client") {
        return (
            <ClientAudits />
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <AuditsProvider>
                <ConsultantAudits userId={user.uid} />
            </AuditsProvider>
        )
    } else {
        return notFound()
    }
}
