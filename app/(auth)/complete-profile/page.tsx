import Link from "next/link"

import { Icons } from "@/components/icons"
import { UserAuthComplete } from "@/components/auth/user-auth-complete"

export const metadata = {
    title: "Create an account",
    description: "Create an account to get started.",
}

type SearchParams = {
    uid?: string
    fullName?: string
    email?: string
}
type cpProps = {
    searchParams: SearchParams;
};

export default function CompleteProfilePage({ searchParams }: cpProps) {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <Icons.logo className="mx-auto h-6 w-6" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Complete your profile
                    </h1>
                </div>
                {/* TODO: get the call call back url from the query params */}
                <UserAuthComplete uid={searchParams.uid!} fullName={searchParams.fullName!} email={searchParams.email!} callbackUrl="/" />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
