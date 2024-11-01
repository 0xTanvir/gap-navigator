import React from "react";
import Link from "next/link"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthLogin } from "@/components/auth/user-auth-login";

export default async function IndexPage() {
  return (
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="flex justify-end items-center my-5">
          <Link
              href="/signup"
              className={cn(
                  buttonVariants({variant: "ghost"}), "flex items-center")}
          > Sign Up
            <Icons.chevronRight className="ml-2 h-4 w-4"/>
          </Link>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Icons.logo className="mx-auto h-6 w-6"/>
          <h1 className="text-2xl text-center font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-center text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <UserAuthLogin/>
      </div>
  )
}
