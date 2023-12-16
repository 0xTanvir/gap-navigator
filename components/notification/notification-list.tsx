"use client"
import React, { useEffect, useState } from 'react';
import { Notification } from "@/types/dto";
import NotificationItem from "@/components/notification/notification-item";
import { useAuth } from "@/components/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { getDatabase, onValue, ref } from "firebase/database";


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

    if (isLoading) {
        return <>
            <div className="divide-border-200 divide-y rounded-md border">
                <NotificationList.Skeleton/>
                <NotificationList.Skeleton/>
                <NotificationList.Skeleton/>
            </div>
        </>
    }
    return (
        <>
            {
                notifications?.length ? (
                        <div className="divide-y divide-border rounded-md border">
                            {notifications.map((notification) => (
                                <NotificationItem key={notification.uid} notification={notification}/>
                            ))}
                        </div>
                    )
                    : (
                        <div>No notification found.</div>
                    )

            }

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