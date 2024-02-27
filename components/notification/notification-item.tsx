import React from 'react';
import Link from "next/link";
import { Notification } from "@/types/dto";
import { updateNotificationById } from "@/lib/firestore/notification";
import { dateFormat } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useAuth } from "@/components/auth/auth-provider";

interface NotificationItemProps {
  notification: Notification
}

const NotificationItem = ({notification}: NotificationItemProps) => {
  const {user, loading} = useAuth();
  async function updateNotification() {
    try {
      if (user?.uid) {
        await updateNotificationById(user.uid, notification)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <div className="flex gap-2">
          <Link
            href={notification.action_type === "ROLE_CHANGE" ? `/settings` :`${notification.action_value}`}
            onClick={updateNotification}
            className={notification.status ? `font-semibold hover:underline` : `font-bold hover:underline`}
          >
            {notification.title}
          </Link>
        </div>
        <div>
          <p className="flex text-sm text-muted-foreground">
            {dateFormat(notification?.createdAt as any)}
          </p>
        </div>
      </div>
      {
        !notification.status && <Icons.circle fill="blue" stroke="blue" className="mr-2"/>
      }
    </div>
  );
};

export default NotificationItem;