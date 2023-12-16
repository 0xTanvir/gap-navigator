import React from "react";

import {MainNav} from "@/components/nav/main-nav";
import {marketingConfig} from "@/config/marketing";
import {ModeToggle} from "@/components/mode-toggle";
import {ProfileNav} from "@/components/nav/profile-nav";
import {SiteFooter} from "@/components/site-footer";

interface NotificationLayoutProps {
    children: React.ReactNode
}
export default async function NotificationLayout({
    children,
}: NotificationLayoutProps) {
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