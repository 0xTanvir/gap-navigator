"use client"

import Link from "next/link"

import { Icons } from "@/components/icons"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider";
import { getNotificationById } from "@/lib/firestore/notification";
import { useEffect, useState } from "react";
import { Notification } from "@/types/dto";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
    image?: string
    email?: string
    logOut?: () => void
}

export function UserAccountNav({name, image, email, logOut}: UserAccountNavProps) {
    const [notifications, setNotifications] = useState<Notification[] | null>([])
    const router = useRouter()
    const {user} = useAuth()

    async function getNotificationList() {
        if (user) {
            let dbNotification = await getNotificationById(user.uid)
            if (dbNotification) {
                setNotifications(dbNotification?.filter(notification => !notification.isSeen))
            }
        }
    }

    useEffect(() => {
        getNotificationList()
    }, [user?.uid])
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    name={name}
                    image={image}
                    className="h-8 w-8"
                />
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

                <DropdownMenuItem>
                    <Icons.user2 className="mr-2 h-4 w-4"/>
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Icons.creditCard className="mr-2 h-4 w-4"/>
                    <span>Billing</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem>
                    <Icons.layoutDashboard className="mr-2 h-4 w-4"/>
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Icons.audit className="mr-2 h-4 w-4"/>
                    <Link href="/audits">Audits</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Icons.users className="mr-2 h-4 w-4"/>
                    <Link href="/clients">Clients</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    {
                        notifications?.length ?
                            <Icons.notificationRing className="mr-2 h-4 w-4"/>
                            : <Icons.notificationOff className="mr-2 h-4 w-4"/>
                    }

                    <Link href="/notification">Notification</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Icons.helpingHand className="mr-2 h-4 w-4"/>
                    <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Icons.lifeBuoy className="mr-2 h-4 w-4"/>
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                        event.preventDefault()
                        logOut?.()
                        router.push("/login")
                    }}
                >
                    <Icons.logOut className="mr-2 h-4 w-4"/>
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
