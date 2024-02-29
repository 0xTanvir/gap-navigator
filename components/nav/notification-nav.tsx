"use client"
import React, { useEffect, useState } from 'react';
import { Icons } from "@/components/icons";
import {
  getNavNotificationById,
  updateNotificationById,
  updateNotificationsAlertById
} from "@/lib/firestore/notification";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { getDatabase, onValue, ref } from "firebase/database";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/dto";
import { dateFormat } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotificationNav = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notificationAlert, setNotificationAlert] = useState<boolean>(false);
  const {user, loading} = useAuth();
  const db = getDatabase();
  const router = useRouter()
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

  async function fetchNotifications() {
    try {
      let dbNotifications = await getNavNotificationById(user?.uid as string)
      setNotifications(dbNotifications)
    } catch (e) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setIsLoading(false)
    }
  }

  async function updateNotification(notification: Notification) {
    try {
      if (user?.uid) {
        await updateNotificationById(user?.uid, notification)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (user) {
      if (user) {
        onValue(
          ref(db, `root/gn-notifications/${user.uid}/`),
          (snapshot) => {
            let alert = snapshot.val()?.alert?.notificationAlert
            setNotificationAlert(alert);
          }
        );
        fetchNotifications()
      }
    }
  }, [user?.uid]);

  if (loading) {
    return (
      <NotificationNavSkeleton/>
    )
  }

  return (
    <DropdownMenu
      onOpenChange={() => {
        notificationAlertUpdate()
        fetchNotifications()
      }}
    >
      <DropdownMenuTrigger>
        <div className="cursor-pointer">
          {notificationAlert ? (
            <Icons.notificationRing
              fill="blue"
              stroke="blue"
            />
          ) : (
            <Icons.notificationOff/>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl">
        <Card className="border-0 shadow-none">
          <CardHeader>
            {notifications.length > 0 && <CardTitle>Notifications</CardTitle>}
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              {
                notifications.length > 0 ?
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                    >
                      {
                        notification.status ?
                          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-gray-500"/> :

                          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
                      }
                      <div className="space-y-1 w-[280px]">
                        <p
                          onClick={() => {
                            updateNotification(notification)
                            if (notification.action_type === "ROLE_CHANGE") {
                              router.push(`/settings`)
                            } else {
                              router.push(`${notification.action_value}`)
                            }
                          }}
                          className="text-sm font-medium cursor-pointer leading-[1.5] hover:underline truncate ..."
                          dangerouslySetInnerHTML={{__html: notification.message}}
                        >
                          {/*<div dangerouslySetInnerHTML={{__html: notification.message}} /> ...*/}
                          {/*{notification.message}*/}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {dateFormat(notification?.createdAt)}
                        </p>
                      </div>
                    </div>
                  )) :
                  <div className="text-center space-y-1">
                    <div className="flex justify-center ">
                      <Icons.notificationRing className="w-16 h-16"/>
                    </div>
                    <p className="font-bold text-2xl">No Notifications</p>
                    <p>We'll notify you when something arrives.</p>
                  </div>
              }
            </div>
          </CardContent>
          <CardFooter>
            {
              notifications.length > 0 &&
                <Link href="/notification" className="w-full">
                    <Button className="w-full">
                        View All
                    </Button>
                </Link>
            }
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function NotificationNavSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-6 w-6 rounded-full"/>
    </div>
  )
}

export default NotificationNav;