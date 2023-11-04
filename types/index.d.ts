export interface NavItem {
    title: string
    href: string
    disabled?: boolean
}

export type MainNavItem = NavItem

export type MarketingConfig = {
    mainNav: MainNavItem[]
}

export type SiteConfig = {
    name: string
    stitchedName: string
    description: string
    links: {
        twitter: string
        github: string
        facebook: string
        instagram: string
    }
}

export type DashboardConfig = {
    mainNav: MainNavItem[]
    sidebarNav: SidebarNavItem[]
}

export type SidebarNavItem = {
    title: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
} & (
        | {
            href: string
            items?: never
        }
        | {
            href?: string
            items: NavLink[]
        }
    )

export type SiteFooterConfig = {
    solutions: MainNavItem[]
    support: MainNavItem[]
    company: MainNavItem[]
    legal: MainNavItem[]
}