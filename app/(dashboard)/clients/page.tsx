'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import ConsultantClients from "@/components/dashboard/consultant-clients"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

// Only consultant have access to this page
export default function ClientsPage() {
    const { user, isAuthenticated, loading } = useAuth()
    if (loading) {
        return (
            <DashboardHeader.Skeleton />
        )
    }
    if (isAuthenticated && user && user.role === "consultant") {
        return (
            <ConsultantClients userAuditsId={user.audits}/>
        )
    } else {
        return notFound()
    }
}
