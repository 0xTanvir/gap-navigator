import { dashboardConfig } from "@/config/dashboard"
import { MainNav } from "@/components/nav/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProfileNav } from "@/components/nav/profile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Suspense } from "react"

interface DashboardLayoutProps {
    children?: React.ReactNode
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-20 items-center justify-between py-4">
                    <MainNav items={dashboardConfig.mainNav} />
                    <nav className="flex gap-2">
                        <ProfileNav />
                        <ModeToggle />
                    </nav>
                </div>
            </header>
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <DashboardShell>{children}</DashboardShell>
            </div>
            <SiteFooter className="border-t" />
        </div>
    )
}
