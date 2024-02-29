'use client'
import { useAuth } from "@/components/auth/auth-provider";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditsProvider } from "@/components/dashboard/AuditsContext";
import { notFound } from "next/navigation";
import ConsultantArchive from "@/components/dashboard/consultant-archive";

export default function ArchivePage() {
    const {user, isAuthenticated, loading} = useAuth()
    if (loading) {
        return (
            <DashboardHeader.Skeleton/>
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <AuditsProvider>
                <ConsultantArchive userId={user?.uid} userAuditsId={user.audits}/>
            </AuditsProvider>
        )
    } else {
        return notFound()
    }
}