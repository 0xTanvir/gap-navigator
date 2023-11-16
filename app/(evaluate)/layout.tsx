import {SidebarNavItem} from "@/types"
import {SingleAuditProvider} from "@/app/(evaluate)/auditContext";
import {AllQuestionProvider} from "@/app/(evaluate)/questionsContext";

interface DocsLayoutProps {
    children: React.ReactNode
}

// TODO: audits fetching and authentication validation should happen here
// later all the child should use the hook
// to use value for audits, questions and answer

export default function DocsLayout({children}: DocsLayoutProps) {
    // const sideBarNav = getSidebarNav()
    return (
        <SingleAuditProvider>
            <AllQuestionProvider>
                {children}
            </AllQuestionProvider>
        </SingleAuditProvider>
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