import React from "react"

import { marketingConfig } from "@/config/marketing"
import { MainNav } from "@/components/nav/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProfileNav } from "@/components/nav/profile-nav"
import { ModeToggle } from "@/components/mode-toggle"

interface MarketingLayoutProps {
    children: React.ReactNode
}

export default async function MarketingLayout({
    children,
}: MarketingLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="container z-40 py-6">
                <div className="flex items-center justify-between">
                    <MainNav items={marketingConfig.mainNav} />
                    <nav className="flex gap-2">
                        <ModeToggle />
                        <ProfileNav />
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    )
}
