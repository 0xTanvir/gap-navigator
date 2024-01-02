import React from "react";

import {MainNav} from "@/components/nav/main-nav";
import {ModeToggle} from "@/components/mode-toggle";
import {ProfileNav} from "@/components/nav/profile-nav";
import {SiteFooter} from "@/components/site-footer";
import NotificationNav from "@/components/nav/notification-nav";
import { dashboardConfig } from "@/config/dashboard";

interface NotificationLayoutProps {
    children: React.ReactNode
}
export default async function NotificationLayout({
    children,
}: NotificationLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col space-y-6">
          <header className="sticky top-0 z-40 border-b bg-background">
            <div className="container flex h-20 items-center justify-between py-4">
              <MainNav items={dashboardConfig.mainNav}/>
              <nav className="flex gap-2 items-center">
                <ProfileNav/>
                <ModeToggle/>
                <NotificationNav/>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <SiteFooter className="border-t"/>
        </div>
    )
}