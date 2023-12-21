import React from 'react';
import Link from "next/link";
import { Notification } from "@/types/dto";
import { updateNotificationById } from "@/lib/firestore/notification";
import { dateFormat, formatDate } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface NotificationItemProps {
    notification: Notification
}

const NotificationItem = ({notification}: NotificationItemProps) => {
    async function updateNotification() {
        try {
            await updateNotificationById(notification.inviteUserId, notification)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <div className="flex gap-2">
                    <Link
                        href={`/evaluate/${notification.auditId}`}
                        onClick={updateNotification}
                        className={notification.isSeen ? `font-semibold hover:underline` : `font-bold hover:underline`}
                    >
                        {notification.auditName}
                    </Link>
                </div>
                <div>
                    <p className="flex text-sm text-muted-foreground">
                        {dateFormat(notification?.createdAt as any)}
                    </p>
                </div>
            </div>
            {
                !notification.isSeen && <Icons.circle fill="blue" stroke="blue" className="mr-2"/>
            }
        </div>
    );
};

export default NotificationItem;