"use client"

import {useEffect, useState} from "react";
import {DocsSidebarNav, DocsSidebarNavItems, DocsSidebarNavSkeleton, childrenSkeleton} from "../sidebar-nav"
import {MainNav} from "@/components/nav/main-nav";
import {dashboardConfig} from "@/config/dashboard";
import {ProfileNav} from "@/components/nav/profile-nav";
import {ModeToggle} from "@/components/mode-toggle";
import {SiteFooter} from "@/components/site-footer";
import {redirect, useParams} from "next/navigation";
import {SidebarNavItem} from "@/types";
import usePreview from "../preview-context";
import {getAudit, allQuestions} from "@/lib/firestore/audit";
import {toast} from "@/components/ui/use-toast";
import {Audit, PreviewActionType, Questions} from "@/types/dto";
import {useAuth} from "@/components/auth/auth-provider";

interface DocsLayoutProps {
    children: React.ReactNode
}

export default function DocsLayout({children}: DocsLayoutProps) {
    const {loading, user, isAuthenticated} = useAuth()
    const {auditId} = useParams()
    const {preview, dispatch} = usePreview()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchPreview = async (auditId: string) => {
            try {
                const audit = await getAudit(auditId)
                const questions = await allQuestions(auditId)
                const sideBarNav = getSidebarNav(audit, questions)

                const currentPreview = {
                    ...audit,
                    questions,
                    sideBarNav,
                }

                dispatch({type: PreviewActionType.ADD_PREVIEW, payload: currentPreview})
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: `Error fetching preview: ${error}.`,
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (auditId) {
            fetchPreview(auditId as string)
        } else {
            setIsLoading(false)
        }
    }, [auditId])


    let content: any;
    let childrenContent: any;
    if (isLoading) {
        content = <>
            <DocsSidebarNavSkeleton>
                <DocsSidebarNavItems.Skeleton/>
            </DocsSidebarNavSkeleton>

            <DocsSidebarNavSkeleton>
                <DocsSidebarNavItems.Skeleton/>
                <DocsSidebarNavItems.Skeleton/>
                <DocsSidebarNavItems.Skeleton/>
                <DocsSidebarNavItems.Skeleton/>
            </DocsSidebarNavSkeleton>
        </>
        childrenContent = childrenSkeleton()
    } else {
        content = <DocsSidebarNav items={preview.sideBarNav}/>
        childrenContent = children
    }

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-40 w-full border-b bg-background">
                    <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                        <MainNav items={dashboardConfig.mainNav}>
                        </MainNav>
                        <nav className="flex gap-2">
                            <ProfileNav/>
                            <ModeToggle/>
                        </nav>
                    </div>
                </header>
                <div className="container flex-1">
                    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">

                    </div>

                </div>
                <SiteFooter className="border-t"/>
            </div>
        )
    } else if (isAuthenticated && user && user.role === "consultant") {
        return (
            <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-40 w-full border-b bg-background">
                    <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                        <MainNav items={dashboardConfig.mainNav}>
                            <DocsSidebarNav items={preview.sideBarNav}/>
                        </MainNav>
                        <nav className="flex gap-2">
                            <ProfileNav/>
                            <ModeToggle/>
                        </nav>
                    </div>
                </header>
                <div className="container flex-1">
                    <div
                        className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
                        <aside
                            className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
                            {content}
                        </aside>
                        {childrenContent}
                    </div>
                </div>
                <SiteFooter className="border-t"/>
            </div>
        )
    } else {
        redirect('/')
    }
}


export function getSidebarNav(audit: Audit, questions: Questions): SidebarNavItem[] {
    const items = questions.map(question => ({
        title: question.name,
        href: `/preview/${audit.uid}/${question.uid}`,
    }))

    return [
        {
            title: "Getting Started",
            items: [
                {
                    title: audit.name,
                    href: `/preview/${audit.uid}`,
                },
            ],
        },
        {
            title: "Questions",
            items: items,
        }
    ]
}