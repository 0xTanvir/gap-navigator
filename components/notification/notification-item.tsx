import React from 'react';
import Link from "next/link";
import {Notification} from "@/types/dto";

interface NotificationItemProps {
    notification: Notification
}

const NotificationItem = ({notification}: NotificationItemProps) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <div className="flex gap-2">
                    <Link
                        href={`/notification/${notification.id}`}
                        className="font-semibold hover:underline"
                    >
                        {notification.title}
                    </Link>
                </div>

                <p className="text-center text-sm font-normal leading-6 text-muted-foreground">
                    {notification.body.length > 30 ? notification.body.substring(0, 30) + "..." : notification.body}
                </p>

            </div>
        </div>
    );
};

export default NotificationItem;