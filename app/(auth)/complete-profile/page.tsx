import Link from "next/link"

import {Icons} from "@/components/icons"
import {UserAuthComplete} from "@/components/auth/user-auth-complete"
import React from "react";

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

export default function CompleteProfilePage({searchParams}: cpProps) {
    let name = {
        firstName: '',
        lastName: ''
    }
    if (searchParams.fullName) {
        let nameParts = searchParams.fullName.split(" ");
        name.firstName = nameParts.slice(0, -1).join(" ");
        name.lastName = nameParts.slice(-1).join(" ");
    }
    return (
        <div className="flex min-h-full lg:h-screen flex-1 flex-col justify-center my-5 lg:my-0">

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Icons.logo className="mx-auto h-6 w-6"/>
                <h1 className="text-2xl mt-4 text-center font-semibold tracking-tight">
                    Complete your profile
                </h1>
            </div>

            <UserAuthComplete
                uid={searchParams.uid!}
                firstName={name.firstName!}
                lastName={name.lastName}
                email={searchParams.email!}
                callbackUrl="/"
            />

        </div>
    )
}
