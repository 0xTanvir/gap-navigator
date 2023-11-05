import { SiteConfig } from "@/types"

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
export enum AuditsType{
    Private = 'private',
    Public = 'public',
}

export type AuditsDataType = {
    id: number
    name: string
    type: string
}