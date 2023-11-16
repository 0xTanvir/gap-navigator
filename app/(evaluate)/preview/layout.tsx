"use client"
import React, {useEffect} from "react";
import {DocsSidebarNav} from "../sidebar-nav"
import {MainNav} from "@/components/nav/main-nav";
import {dashboardConfig} from "@/config/dashboard";
import {ProfileNav} from "@/components/nav/profile-nav";
import {ModeToggle} from "@/components/mode-toggle";
import {SiteFooter} from "@/components/site-footer";
import {useSingleAudit} from "@/app/(evaluate)/auditContext";
import {useParams} from "next/navigation";
import {useAllQuestion} from "@/app/(evaluate)/questionsContext";
import {SidebarNavItem} from "@/types";

interface DocsLayoutProps {
    children: React.ReactNode
}

export default function DocsLayout({children}: DocsLayoutProps) {
    const {singleAudit, fetchSingleAudit} = useSingleAudit()
    const {allQuestion, fetchAllQuestion} = useAllQuestion()
    const {auditId} = useParams()

    useEffect(() => {
        fetchSingleAudit(auditId as string)
        fetchAllQuestion(auditId as string)
    }, [auditId])

    const transformedAudit = {
        title: singleAudit?.name,
        description: "Complete this audit to generate your report.",
        questions: allQuestion?.map(question => ({
            id: question.uid,
            title: question.name,
            answers: question.answers.map(answer => ({
                id: answer.uid,
                text: answer.name,
            })),
        })),
        sidebarNav: [
            {
                title: "Getting Started",
                items: [
                    {
                        title: singleAudit?.name,
                        href: `/preview/${singleAudit?.uid}`,
                    },
                ],
            },
            {
                title: "Questions",
                items: allQuestion?.map(question => ({
                    title: question.name,
                    href: `/preview/${singleAudit?.uid}/${question?.uid}`,
                })),
            },
        ] as SidebarNavItem[]
    };


    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
                <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                    <MainNav items={dashboardConfig.mainNav}>
                        <DocsSidebarNav items={transformedAudit?.sidebarNav}/>
                    </MainNav>
                    <nav className="flex gap-2">
                        <ProfileNav/>
                        <ModeToggle/>
                    </nav>
                </div>
            </header>
            <div className="container flex-1">
                <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
                    <aside
                        className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
                        {/* This should populated from api call data */}
                        <DocsSidebarNav items={transformedAudit?.sidebarNav}/>
                    </aside>
                    {children}
                </div>
            </div>
            <SiteFooter className="border-t"/>
        </div>
    )
}
