"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"

import {SidebarNavItem} from "@/types"
import {cn} from "@/lib/utils"
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";
import {DocsPageHeader} from "@/app/(evaluate)/preview/page-header";
import PreviewsPage from "@/app/(evaluate)/preview/[auditId]/page";

export interface DocsSidebarNavProps {
    items: SidebarNavItem[]
}

export function DocsSidebarNav({items}: DocsSidebarNavProps) {
    const pathname = usePathname()

    return items.length ? (
        <div className="w-full">
            {items.map((item, index) => (
                <div key={index} className={cn("pb-8")}>
                    <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
                        {item.title}
                    </h4>
                    {item.items ? (
                        <DocsSidebarNavItems key={item.title} items={item.items} pathname={pathname}/>
                    ) : null}
                </div>
            ))}
        </div>
    ) : null
}

interface DocsSidebarNavItemsProps {
    items: SidebarNavItem[]
    pathname: string | null
}

export function DocsSidebarNavItems({
                                        items,
                                        pathname,
                                    }: DocsSidebarNavItemsProps) {
    return items?.length ? (
        <div className="grid grid-flow-row auto-rows-max text-sm">
            {items.map((item, index) =>
                    !item.disabled && item.href ? (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex w-full items-center rounded-md p-2 hover:underline",
                                {
                                    "bg-muted": pathname === item.href,
                                }
                            )}
                            target={item.external ? "_blank" : ""}
                            rel={item.external ? "noreferrer" : ""}
                        >
                            {item.title}
                        </Link>
                    ) : (
                        <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60">
            {item.title}
          </span>
                    )
            )}
        </div>
    ) : null
}

interface DocsSidebarNavEditorShellProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function DocsSidebarNavSkeleton({children}: DocsSidebarNavEditorShellProps) {
    return (
        <div className="w-full">
            <div className="pb-8">
                <Skeleton className="h-7 w-full mb-1 rounded-md px-2 py-1"/>
                {children}
            </div>
        </div>
    )
}

DocsSidebarNavItems.Skeleton = function DocsSidebarNavItemsSkeleton() {
    return (
        <div className="grid grid-flow-row auto-rows-max">
            <Skeleton className="h-9 w-full mb-1 rounded-md px-2 py-1"/>
        </div>
    )
}

export function childrenSkeleton() {
    return (
        <div className="py-6 lg:py-10">
            <DocsPageHeader.Skeleton/>
            <PreviewsPage.Skeleton/>
        </div>
    )
}
