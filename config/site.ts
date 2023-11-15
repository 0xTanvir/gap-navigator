import {
    SiteConfig,
    SiteFooterConfig,
    FAQs,
} from "@/types"

export const siteConfig: SiteConfig = {
    name: "Gap Navigator",
    stitchedName: "GapNavigator",
    description: "Simplify Audits, Empower Decisions",
    emailFrom: "team@gapnavigator.com",
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

export const faqs: FAQs = [
    {
        question: "What types of accounts are available on Gap Navigator?",
        answer: "There are two types of accounts available: Consultant/Agency accounts and Prospect/Client accounts."
    },
    {
        question: "Can an agency add company staff to their account?",
        answer: "Currently, this feature is not available, but the system is designed to accommodate this functionality in the future."
    },
    {
        question: "What capabilities does a Consultant/Agency account have?",
        answer: "Consultants or agencies can manage, create, edit, and archive audits, view client lists, and results by clients or by audits."
    },
    {
        question: "What can a Prospect/Client account do?",
        answer: "Clients can view shared audits, track ongoing or running audits, view completed audits, and edit responses which generate a different analysis report."
    },
    {
        question: "How does creating a new audit work?",
        answer: "Consultants choose an audit name and type (private or public), and then add questions to the audit. They can also assign clients to public audits if they are registered on Gap Navigator."
    },
    {
        question: "What types of questions can be added to an audit?",
        answer: "Audits can contain multiple-choice questions, which can be either range-based or standard multiple choices. Each question comes with a recommendation document for consultants to fill out."
    },
    {
        question: "Can additional notes be added to questions in an audit?",
        answer: "Yes, consultants and clients can add additional notes to questions. Consultants can also add recommended notes and internal notes for private audits."
    },
    {
        question: "Who can see the internal notes added by consultants?",
        answer: "Internal notes are exclusively for consultant use and are never visible to the client. These notes are indicated with a hint for internal use only."
    },
    {
        question: "How are analysis reports generated?",
        answer: "Reports are generated when a client completes an audit or when a consultant completes an audit. These can be exported as PDFs and sent via email or link."
    },
    {
        question: "Can a consultant or agency view past audits?",
        answer: "Yes, consultants and agencies can view a list of clients who have previously taken audits and access results by each client or by each audit."
    },
    {
        question: "What is a public audit URL?",
        answer: "It is a link provided by consultants to clients for conducting public audits. For premium features, consultants can customize this URL with their domain."
    },
]