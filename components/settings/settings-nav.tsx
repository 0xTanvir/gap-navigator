"use client"
import React from 'react';
import {Icons} from "@/components/icons";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {SidebarNavItem} from "@/types";
import {usePathname} from "next/navigation";

interface SettingsNavProps {
    items: SidebarNavItem[]
}
const SettingsNav = ({ items }: SettingsNavProps) => {
    const path = usePathname()

    if (!items?.length) {
        return null
    }
    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => {
                // const Icon = Icons[item.icon as keyof typeof Icons || "arrowRight" as keyof typeof Icons]
                return (
                    item.href && (
                        <Link key={index} href={item.disabled ? "/" : item.href}>
                            <span
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                    path === item.href ? "bg-accent" : "transparent",
                                    item.disabled && "cursor-not-allowed opacity-80"
                                )}
                            >
                                {/*<Icon className="mr-2 h-4 w-4" />*/}
                                <span>{item.title}</span>
                            </span>
                        </Link>
                    )
                )
            })}
        </nav>
    );
};

export default SettingsNav;