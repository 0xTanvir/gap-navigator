import React from "react"
import { MainNav } from "@/components/nav/main-nav";
import { dashboardConfig } from "@/config/dashboard";
import { ProfileNav } from "@/components/nav/profile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationComponent from "@/components/marketing/notification-component";

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
                                                children,
                                              }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-20 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav}/>
          <nav className="flex gap-2 items-center">
            <ProfileNav/>
            <ModeToggle/>
            <NotificationComponent/>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
