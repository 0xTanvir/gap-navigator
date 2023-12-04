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
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import { updateNotificationsAlertById } from "@/lib/firestore/notification";
import { toast } from "@/components/ui/use-toast";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string
    image?: string
    email?: string
    logOut?: () => void
}

export function UserAccountNav({name, image, email, logOut}: UserAccountNavProps) {
    const [notificationAlert, setNotificationAlert] = useState<boolean>(false)
    const router = useRouter()
    const {user} = useAuth()
    const db = getDatabase()

    const notificationAlertUpdate = async () => {
        if (notificationAlert) {
            if (user?.uid) {
                const notification = await updateNotificationsAlertById(user?.uid)
                if (notification) {
                    toast({
                        title: 'Notification alert update successfully',
                        variant: "success"
                    })
                } else {
                    toast({
                        title: "Something went wrong.",
                        description: "Failed to notification alert update. Please try again.",
                        variant: "destructive",
                    })
                }
            }
        }
    }

    useEffect(() => {
        if (user) {
            if (user) {
                onValue(ref(db, `root/audit-notifications/${user.uid}/`), (snapshot) => {
                    setNotificationAlert(snapshot.val()?.notificationAlert)
                });
            }
        }
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

                <DropdownMenuItem onClick={notificationAlertUpdate}>
                    {
                        notificationAlert ?
                            <Icons.notificationRing fill="blue" stroke="blue" className="mr-2 h-4 w-4"/> :
                            <Icons.notificationOff className="mr-2 h-4 w-4"/>
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
