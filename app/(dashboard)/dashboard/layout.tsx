'use client'
import { notFound } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { dashboardConfig } from "@/config/dashboard"
import { MainNav } from "@/components/nav/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProfileNav } from "@/components/nav/profile-nav"

interface DashboardLayoutProps {
    children?: React.ReactNode
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const { user, isAuthenticated, loading, logOut } = useAuth()
    if (loading) {
        return (
            <div>Loading...</div>
        )
    } else {
        if (!isAuthenticated) {
            return notFound()
        }

        return (
            <div className="flex min-h-screen flex-col space-y-6">
                <header className="sticky top-0 z-40 border-b bg-background">
                    <div className="container flex h-16 items-center justify-between py-4">
                        <MainNav items={dashboardConfig.mainNav} />
                        <nav >
                            <ProfileNav />
                        </nav>
                    </div>
                </header>
                <main className="flex-1">{children}</main>
                <SiteFooter className="border-t" />
            </div>
        )
    }
}
