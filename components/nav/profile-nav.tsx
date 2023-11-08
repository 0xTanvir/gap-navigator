'use client'

import React from "react"
import Link from "next/link"

import { useAuth } from "../auth/auth-provider"
import { UserAccountNav } from "./user-account-nav"
import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ProfileNav() {
    const { user, loading, logOut } = useAuth()
    if (loading) {
        return (
            <AvatarSkeleton />
        )
    }

    return (
        <>
            {!loading && user && <div className="flex gap-4">
                <UserAccountNav
                    name={user.firstName + ' ' + user.lastName}
                    image={user.image}
                    email={user.email}
                    logOut={logOut}
                /></div>}
            {!loading && !user && <div className="flex gap-4">
                <Link
                    href="/login"
                    className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "px-4"
                    )}
                >
                    Log In
                </Link>
            </div>}
        </>
    )
}

function AvatarSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <div className="space-y-2">
                <Skeleton className="h-3 w-[50px]" />
                <Skeleton className="h-3 w-[25px]" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
        </div>
    )
}
