import { Metadata } from "next";
import SettingsNav from "@/components/settings/settings-nav";
import { settingsConfig } from "@/config/settings";
import { MainNav } from "@/components/nav/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { ProfileNav } from "@/components/nav/profile-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Settings",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-20 items-center justify-between py-4">
          <MainNav items={settingsConfig.mainNav} />
          <nav className="flex gap-2">
            <ProfileNav />
            <ModeToggle />
          </nav>
        </div>
      </header>

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <SettingsNav items={settingsConfig.sidebarNav} />
        </aside>
        <div className="flex w-full flex-1 flex-col">{children}</div>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
