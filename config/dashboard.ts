import { DashboardConfig } from "@/types"

export const dashboardConfig: DashboardConfig = {
    mainNav: [
        {
            title: "Guide",
            href: "/",
        },
        {
            title: "Support",
            href: "/",
        },
    ],
    sidebarNav: [
        {
            title: "Audits",
            href: "/dashboard",
            icon: "audit",
        },
        {
            title: "Clients",
            href: "/dashboard/clients",
            icon: "users",
        },
    ],
}
