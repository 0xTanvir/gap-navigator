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
            title: "Dashboard",
            href: "/dashboard",
            icon: "audit",
        },
        {
            title: "Audits",
            href: "/audits",
            icon: "audit",
        },
        {
            title: "Clients",
            href: "/clients",
            icon: "users",
        },
    ],
}

export const consultantDashboardConfig: DashboardConfig = {
    mainNav: [],
    sidebarNav: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: "layoutDashboard",
        },
        {
            title: "Audits",
            href: "/audits",
            icon: "audit",
        },
        {
            title: "Clients",
            href: "/clients",
            icon: "users",
        },
    ],
}

export const clientDashboardConfig: DashboardConfig = {
    mainNav: [],
    sidebarNav: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: "layoutDashboard",
        },
        {
            title: "Audits",
            href: "/audits",
            icon: "audit",
        },
        {
            title: "Evaluations",
            href: "/evaluations",
            icon: "evaluate",
        },
    ],
}