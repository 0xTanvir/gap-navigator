import { Metadata } from "next";
import { settingsConfig } from "@/config/settings";
import { MainNav } from "@/components/nav/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { ProfileNav } from "@/components/nav/profile-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Client Page",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({children}: SettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-20 items-center justify-between py-4">
          <MainNav items={settingsConfig.mainNav}/>
          <nav className="flex gap-2">
            <ProfileNav/>
            <ModeToggle/>
          </nav>
        </div>
      </header>

      <div className="container">
        {children}
      </div>
      <SiteFooter className="border-t"/>
    </div>
  );
}
