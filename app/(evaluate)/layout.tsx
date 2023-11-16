
import { SiteFooter } from "@/components/site-footer"
import { DocsSidebarNav } from "./sidebar-nav"
import { MainNav } from "@/components/nav/main-nav"
import { dashboardConfig } from "@/config/dashboard"
import { ProfileNav } from "@/components/nav/profile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { AuditsConfig, SidebarNavItem } from "@/types"

interface DocsLayoutProps {
  children: React.ReactNode
}

export const audit = {
  title: "Data Security and Privacy Audit",
  description: "Complete this audit to generate your report.",
  questions: [
    {
      id: "1",
      title: "How do I use Next.js with TypeScript?",
      answers: [
        {
          id: "1",
          text: "Use the Next.js TypeScript quick start",
        },
        {
          id: "2",
          text: "Use the Next.js TypeScript example",
        },
        {
          id: "3",
          text: "Use the Next.js TypeScript starter",
        },
        {
          id: "4",
          text: "Use the Next.js TypeScript boilerplate",
        },
      ],
    },
    {
      id: "2",
      title: "How do I use Golang?",
      answers: [
        {
          id: "1",
          text: "Use the Golang quick start",
        },
        {
          id: "2",
          text: "Use the Golang example",
        },
        {
          id: "3",
          text: "Use the Golang starter",
        },
        {
          id: "4",
          text: "Use the Golang boilerplate",
        },
      ],
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/preview/2e6d211f-a0fe-4667-936a-1d5f34455a3e",
        },
      ],
    },
    {
      title: "Questions",
      items: [
        {
          title: "How do I use Next.js with TypeScript?",
          href: "/preview/2e6d211f-a0fe-4667-936a-1d5f34455a3e/1",
        },
        {
          title: "How do I use Golang?",
          href: "/preview/2e6d211f-a0fe-4667-936a-1d5f34455a3e/2",
        },
        {
          title: "How do I use PHP?",
          href: "/preview/2e6d211f-a0fe-4667-936a-1d5f34455a3e/3",
          disabled: true,
        },
      ],
    }
  ],
}

// TODO: audits fetching and authentication validation should happen here
// later all the child should use the hook
// to use value for audits, questions and answer

export default function DocsLayout({ children }: DocsLayoutProps) {
  // const sideBarNav = getSidebarNav()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav items={dashboardConfig.mainNav}>
            <DocsSidebarNav items={audit.sidebarNav} />
          </MainNav>
          <nav className="flex gap-2">
            <ProfileNav />
            <ModeToggle />
          </nav>
        </div>
      </header>
      <div className="container flex-1">{children}</div>
      <SiteFooter className="border-t" />
    </div>
  )
}

export function getSidebarNav(): SidebarNavItem[] {
  return [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
      ],
    },
    {
      title: "Questions",
      items: [
        {
          title: "Introduction",
          href: "/docs/documentation",
        },
        {
          title: "Contentlayer",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Components",
          href: "/docs/documentation/components",
        },
        {
          title: "Code Blocks",
          href: "/docs/documentation/code-blocks",
        },
        {
          title: "Style Guide",
          href: "/docs/documentation/style-guide",
        },
        {
          title: "Search",
          href: "/docs/in-progress",
          disabled: true,
        },
      ],
    }
  ]
}