'use client'

import React from "react"
import Link from "next/link"
import { useAuth } from "../auth/auth-provider"
import { UserAccountNav } from "./user-account-nav"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ProfileNav() {
    const { user, loading, logOut } = useAuth()

    return (
        <>
            {!loading && user && <UserAccountNav
                user={{
                    name: user.displayName!,
                    image: user.photoURL!,
                    email: user.email!,
                }}
                logOut={logOut}
            />}
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
                <Link
                    href="/signup"
                    className={cn(
                        buttonVariants({ size: "sm" }),
                        "px-4"
                    )}
                >
                    Sign Up
                </Link>
            </div>}
        </>
    )
}