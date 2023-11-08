import { dashboardConfig } from "@/config/dashboard"
import { MainNav } from "@/components/nav/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProfileNav } from "@/components/nav/profile-nav"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ModeToggle } from "@/components/mode-toggle"

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
                        <ModeToggle />
                        <ProfileNav />
                    </nav>
                </div>
            </header>
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-[200px] flex-col md:flex">
                    <DashboardNav items={dashboardConfig.sidebarNav} />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
            <SiteFooter className="border-t" />
        </div>
    )
}
