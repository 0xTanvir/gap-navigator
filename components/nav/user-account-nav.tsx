"use client";

import Link from "next/link";

import {Icons} from "@/components/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {UserAvatar} from "@/components/user-avatar";
import {useRouter} from "next/navigation";
import {useAuth} from "@/components/auth/auth-provider";
import {useEffect, useState} from "react";
import {getDatabase, onValue, ref} from "firebase/database";
import {updateNotificationsAlertById} from "@/lib/firestore/notification";
import {toast} from "sonner";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string;
    image?: string;
    email?: string;
    logOut?: () => void;
}

export function UserAccountNav({
                                   name,
                                   image,
                                   email,
                                   logOut,
                               }: UserAccountNavProps) {
    const router = useRouter();
    const {user} = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar name={name} image={image} className="h-8 w-8"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {name && <p className="font-medium">{name}</p>}
                        {email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {email}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator/>
                <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                        <Icons.user2 className="mr-2 h-4 w-4"/>
                        Profile
                    </DropdownMenuItem>
                </Link>
                {/* <DropdownMenuItem>
            <Icons.creditCard className="mr-2 h-4 w-4"/>
            <span>Billing</span>
        </DropdownMenuItem> */}

                <DropdownMenuSeparator/>

                <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                        <Icons.layoutDashboard className="mr-2 h-4 w-4"/>
                        Dashboard
                    </DropdownMenuItem>
                </Link>
                <Link href="/audits">
                    <DropdownMenuItem className="cursor-pointer">
                        <Icons.audit className="mr-2 h-4 w-4"/>
                        Audits
                    </DropdownMenuItem>
                </Link>
                {user?.role === "admin" && (
                    <Link href="/consultants">
                        <DropdownMenuItem className="cursor-pointer">
                            <Icons.users className="mr-2 h-4 w-4"/>
                            Consultants
                        </DropdownMenuItem>
                    </Link>
                )}
                {((user?.role === "consultant") || (user?.role === "admin")) && (
                    <Link href="/clients">
                        <DropdownMenuItem className="cursor-pointer">
                            <Icons.users className="mr-2 h-4 w-4"/>
                            Clients
                        </DropdownMenuItem>
                    </Link>
                )}
                <DropdownMenuSeparator/>
                <Link href="faqs">
                    <DropdownMenuItem className="cursor-pointer">
                        <Icons.helpingHand className="mr-2 h-4 w-4"/>
                        Help
                    </DropdownMenuItem>
                </Link>
                <Link href="/contact">
                    <DropdownMenuItem className="cursor-pointer">
                        <Icons.lifeBuoy className="mr-2 h-4 w-4"/>
                        Support
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                        event.preventDefault();
                        logOut?.();
                        router.push("/");
                    }}
                >
                    <Icons.logOut className="mr-2 h-4 w-4"/>
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
