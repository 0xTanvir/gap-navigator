"use client"
import React, { useEffect, useState } from 'react';
import { Notification } from "@/types/dto";
import NotificationItem from "@/components/notification/notification-item";
import { useAuth } from "@/components/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { getDatabase, onValue, ref } from "firebase/database";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";


const NotificationList = () => {
    const [notifications, setNotifications] = useState<Notification[] | null>([])
    const [isLoading, setIsLoading] = useState(true)
    const {user} = useAuth()
    const db = getDatabase()

    useEffect(() => {
        if (user) {
            onValue(ref(db, `root/audit-notifications/${user.uid}/notifications/`), (snapshot) => {
                setNotifications((snapshot.exists() ? Object.values(snapshot.val()) : null))
                setIsLoading(false)
            });
        }
    }, [user?.uid])

    console.log(notifications)

    if (isLoading) {
        return <>
            <AuditEditorShell>
                <AuditEditorHeader.Skeleton/>
                <div className="divide-border-200 divide-y rounded-md border mt-3">
                    <NotificationList.Skeleton/>
                    <NotificationList.Skeleton/>
                    <NotificationList.Skeleton/>
                </div>
            </AuditEditorShell>
        </>
    }
    return (
        <>
            <AuditEditorShell>
                <Link
                    href="/audits"
                    className={cn(
                        buttonVariants({variant: "ghost"}),
                        "absolute left-[-150px] top-4 hidden xl:inline-flex"
                    )}
                >
                    <Icons.chevronLeft className="mr-2 h-4 w-4"/>
                    See all audits
                </Link>

                <AuditEditorHeader heading="Notification List" text="Manage notification list."/>
                {
                    notifications?.length ? (
                            <div className="divide-y divide-border rounded-md border mt-3">
                                {notifications.map((notification) => (
                                    <NotificationItem key={notification.uid} notification={notification}/>
                                ))}
                            </div>
                        )
                        : (
                            <EmptyPlaceholder className="mt-3">
                                <EmptyPlaceholder.Icon name="audit"/>
                                <EmptyPlaceholder.Title>No notification found</EmptyPlaceholder.Title>
                                <EmptyPlaceholder.Description>
                                    You don&apos;t have any notifications yet.
                                </EmptyPlaceholder.Description>
                            </EmptyPlaceholder>
                        )

                }
            </AuditEditorShell>
        </>
    );
};

NotificationList.Skeleton = function notificationItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-full"/>
            </div>
        </div>
    )
}

export default NotificationList;