'use client'
import {notFound} from "next/navigation"
import {useAuth} from "@/components/auth/auth-provider"
import ClientDashboard from "@/components/dashboard/client-dashboard";
import ConsultantDashboard from "@/components/dashboard/consultant-dashboard";

export default function DashboardPage() {
    const {user, isAuthenticated, loading, logOut} = useAuth()
    if (isAuthenticated && user && user.role === "client") {
        return (
            <ClientDashboard/>
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <ConsultantDashboard/>
        )
    } else {
        return notFound()
    }
}