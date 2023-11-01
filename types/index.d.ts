export interface NavItem {
    title: string
    href?: string
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