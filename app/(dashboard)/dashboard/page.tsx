'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import ClientDashboard from "@/components/dashboard/client-dashboard"
import ConsultantDashboard from "@/components/dashboard/consultant-dashboard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import AdminDashboard from "@/components/dashboard/admin-dashboard";

export default function DashboardsPage() {
    const { user, isAuthenticated, loading } = useAuth()
    if (loading) {
        return (
            <DashboardHeader.Skeleton />
        )
    }
    if (isAuthenticated && user && user.role === "client") {
        return (
            <ClientDashboard />
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <ConsultantDashboard userAuditsId={user?.audits} />
        )
    }else if (isAuthenticated && user && user.role === "admin") {
        return (
            <AdminDashboard userId={user?.uid} />
        )
    } else {
        return notFound()
    }
}
