import { DashboardConfig } from "@/types"

export const dashboardConfig: DashboardConfig = {
    mainNav: [
        {
            title: "Audits",
            href: "/audits",
        },
        {
            title: "Clients",
            href: "/clients",
            disabled: true,
        },
    ],
    sidebarNav: [],
}
