import React from "react"

import {auditEditorConfig} from "@/config/marketing"
import {MainNav} from "@/components/nav/main-nav"
import {SiteFooter} from "@/components/site-footer"
import {ProfileNav} from "@/components/nav/profile-nav"
import {ModeToggle} from "@/components/mode-toggle"
import NotificationNav from "@/components/nav/notification-nav";

interface AuditLayoutProps {
    children: React.ReactNode
}

export default async function AuditLayout({
                                              children,
                                          }: AuditLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-20 items-center justify-between py-4">
                    <MainNav items={auditEditorConfig.mainNav}/>
                    <nav className="flex gap-2 items-center">
                        <ProfileNav/>
                        <ModeToggle/>
                        <NotificationNav/>
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <SiteFooter/>
        </div>
    )
}
