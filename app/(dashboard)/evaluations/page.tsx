'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import ClientEvaluations from "@/components/dashboard/client-evaluations"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

// Only client have access to this page
export default function ConsultantsPage() {
    const { user, isAuthenticated, loading } = useAuth()
    if (loading) {
        return (
            <DashboardHeader.Skeleton />
        )
    }
    if (isAuthenticated && user && user.role === "client") {
        return (
            <ClientEvaluations user={user} />
        )
    } else {
        return notFound()
    }
}
