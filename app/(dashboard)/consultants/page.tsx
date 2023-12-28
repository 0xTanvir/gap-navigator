'use client'

import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import AdminConsultants from "@/components/dashboard/admin-consultants";

// Only admin have access to this page
export default function ConsultantsPage() {
  const {user, isAuthenticated, loading} = useAuth()
  if (loading) {
    return (
        <DashboardHeader.Skeleton/>
    )
  }
  if (isAuthenticated && user && user.role === "admin") {
    return (
        <AdminConsultants/>
    )
  } else {
    return notFound()
  }
}
