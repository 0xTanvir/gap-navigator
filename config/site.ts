import { SiteConfig, SiteFooterConfig } from "@/types"

export const siteConfig: SiteConfig = {
    name: "Gap Navigator",
    stitchedName: "GapNavigator",
    description: "Simplify Audits, Empower Decisions",
    links: {
        twitter: "https://twitter.com/#",
        github: "https://github.com/#",
        facebook: "https://facebook.com/#",
        instagram: "https://instagram.com/#",
    },
}

export enum AccountType {
    Client = 'client',
    Consultant = 'consultant',
}

export const siteFooterConfig: SiteFooterConfig = {
    solutions: [
        {
            title: "Marketing",
            href: "/marketing",
            disabled: true,
        },
        {
            title: "Analytics",
            href: "/analytics",
            disabled: true,
        },
        {
            title: "Commerce",
            href: "/commerce",
            disabled: true,
        },
        {
            title: "Insights",
            href: "/insights",
            disabled: true,
        },
    ],
    support: [
        {
            title: "Help Center",
            href: "/help",
            disabled: true,
        },
        {
            title: "FAQs",
            href: "/faqs",
        },
        {
            title: "Contact",
            href: "/contact",
        },
    ],
    company: [
        {
            title: "About",
            href: "/about",
            disabled: true,
        },
        {
            title: "Blog",
            href: "/blog",
            disabled: true,
        },
        {
            title: "Careers",
            href: "/careers",
            disabled: true,
        },
    ],
    legal: [
        {
            title: "Privacy",
            href: "/privacy",
            disabled: true,
        },
        {
            title: "Terms",
            href: "/terms",
            disabled: true,
        },
    ],
}