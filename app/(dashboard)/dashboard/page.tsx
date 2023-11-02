'use client'
import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export default function DashboardPage() {
    const { user, isAuthenticated, loading, logOut } = useAuth()
    if (isAuthenticated && user && user.role === "client") {
        return (
            <div>Hello from client dashboard</div>
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <div>Hello from consultant dashboard</div>
        )
    } else {
        return notFound()
    }
}