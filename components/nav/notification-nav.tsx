"use client"
import React, { useEffect, useState } from 'react';
import { Icons } from "@/components/icons";
import { updateNotificationsAlertById } from "@/lib/firestore/notification";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";
import { getDatabase, onValue, ref } from "firebase/database";
import { Skeleton } from "@/components/ui/skeleton";

const NotificationNav = () => {
  const [notificationAlert, setNotificationAlert] = useState<boolean>(false);
  const {user, loading} = useAuth();
  const db = getDatabase();
  const notificationAlertUpdate = async () => {
    if (notificationAlert) {
      if (user?.uid) {
        const notification = await updateNotificationsAlertById(user?.uid);
        if (notification) {
          toast.success("Notification alert update!");
        } else {
          toast.error("Something went wrong.", {
            description:
                "Failed to notification alert update. Please try again.",
          });
        }
      }
    }
  };
  useEffect(() => {
    if (user) {
      if (user) {
        onValue(
            ref(db, `root/audit-notifications/${user.uid}/`),
            (snapshot) => {
              setNotificationAlert(snapshot.val()?.notificationAlert);
            }
        );
      }
    }
  }, [user?.uid]);

  if (loading) {
    return (
        <NotificationNavSkeleton/>
    )
  }

  return (
      <Link href="/notification">
        <div
            onClick={notificationAlertUpdate}
            className="cursor-pointer"
        >
          {notificationAlert ? (
              <Icons.notificationRing
                  fill="blue"
                  stroke="blue"
              />
          ) : (
              <Icons.notificationOff/>
          )}
        </div>
      </Link>
  );
};

function NotificationNavSkeleton() {
  return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-6 rounded-full"/>
      </div>
  )
}

export default NotificationNav;