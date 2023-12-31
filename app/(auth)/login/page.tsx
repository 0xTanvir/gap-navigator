import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserAuthLogin } from "@/components/auth/user-auth-login"
import React from "react";

export const metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
      <>

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
              href="/"
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

      </>
  )
}
