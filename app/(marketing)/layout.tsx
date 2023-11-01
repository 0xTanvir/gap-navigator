import { marketingConfig } from "@/config/marketing"
import { MainNav } from "@/components/nav/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProfileNav } from "@/components/nav/profile-nav"

interface MarketingLayoutProps {
    children: React.ReactNode
}

export default async function MarketingLayout({
    children,
}: MarketingLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="container my-4 z-40 bg-background">
                <div className="flex items-center justify-between">
                    <MainNav items={marketingConfig.mainNav} />
                    <nav >
                        <ProfileNav />
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    )
}
