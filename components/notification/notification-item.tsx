import React from 'react';
import Link from "next/link";
import { Notification } from "@/types/dto";
import { updateNotificationById } from "@/lib/firestore/notification";

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
            </div>
        </div>
    );
};

export default NotificationItem;