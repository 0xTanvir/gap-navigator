import Link from "next/link"

import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {Icons} from "@/components/icons"
import {UserAuthSignup} from "@/components/auth/user-auth-signup"
import React from "react";

export const metadata = {
    title: "Create an account",
    description: "Create an account to get started.",
}

export default function RegisterPage() {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center">

            <div className="flex justify-between items-center my-5">
                <Link
                    href="/"
                    className={cn(
                        buttonVariants({variant: "ghost"}), "flex items-center")}
                >
                    <>
                        <Icons.chevronLeft className="mr-2 h-4 w-4"/>
                        Home
                    </>
                </Link>
                <Link
                    href="/login"
                    className={cn(
                        buttonVariants({variant: "ghost"}), "flex items-center")}
                > Login
                    <Icons.chevronRight className="ml-2 h-4 w-4"/>
                </Link>
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Icons.logo className="mx-auto h-6 w-6"/>
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight">
                    Sign in to your account
                </h2>
            </div>
            <UserAuthSignup/>

        </div>
    )
}
