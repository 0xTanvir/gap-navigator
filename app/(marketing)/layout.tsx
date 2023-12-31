import React from "react"

import { marketingConfig } from "@/config/marketing"
import { MainNav } from "@/components/nav/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProfileNav } from "@/components/nav/profile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
                                                children,
                                              }: MarketingLayoutProps) {
  return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter/>
      </div>
  )
}
