"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Notification } from "@/types/dto";
import NotificationItem from "@/components/notification/notification-item";
import { useAuth } from "@/components/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import CustomPagination from "@/components/custom-pagination/custom-pagination";
import { toast } from "sonner";
import { getNotificationById } from "@/lib/firestore/notification";
import * as z from "zod";
import { auditFilterSchema } from "@/lib/validations/audit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof auditFilterSchema>
const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)
  const [currentNotifications, setCurrentNotifications] = useState<Notification[]>([]);
  const [currentSliceNotifications, setCurrentSliceNotifications] = useState<Notification[]>([]);
  const [filterData, setFilterData] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);
  const {user} = useAuth()
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(auditFilterSchema),
    defaultValues: {
      auditName: ""
    },
  })

  function onSubmit(data: FormData) {
    setFilterData(true)
    if (data.auditName) {
      let filterData = notifications.filter(notification => notification.title.toLowerCase().includes(data?.auditName?.toLowerCase() as string));
      setCurrentNotifications(filterData)
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    if (inputRef?.current?.value === "") {
      setCurrentNotifications(notifications)
      setFilterData(false)
    }
  }, [inputRef?.current?.value === ""]);

  async function fetchNotifications() {
    try {
      let dbNotifications = await getNotificationById(user?.uid as string)
      setTotalData(dbNotifications.length)
      setNotifications(dbNotifications)
    } catch (e) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setIsLoading(false)
    }
  }

  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize

  useEffect(() => {
    if (filterData) {
      setTotalData(currentNotifications.length)
      setCurrentSliceNotifications(currentNotifications.slice(indexOfFirstAudit, indexOfLastAudit))
    } else {
      setTotalData(notifications.length)
      setCurrentSliceNotifications(notifications?.slice(indexOfFirstAudit, indexOfLastAudit))
    }
  }, [indexOfLastAudit, indexOfFirstAudit, notifications, filterData, totalData]);

  useEffect(() => {
    fetchNotifications()
  }, [user?.uid])


  if (isLoading) {
    return <>
      <AuditEditorShell>
        <Link
          href="#"
          onClick={() => router.back()}
          className={cn(
            buttonVariants({variant: "ghost"}),
            "absolute left-[-150px] top-4 hidden xl:inline-flex"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4"/>
          Back
        </Link>

        <AuditEditorHeader heading="Notification List" text="Manage notification list."/>

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
          href="#"
          onClick={() => router.back()}
          className={cn(
            buttonVariants({variant: "ghost"}),
            "absolute left-[-150px] top-4 hidden xl:inline-flex"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4"/>
          Back
        </Link>

        <AuditEditorHeader heading="Notification List" text="Manage notification list."/>
        <div className="px-1.5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row  sm:items-end justify-end gap-3">
              <FormField
                control={form.control}
                name="auditName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="sr-only">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Audit Name"
                        {...field}
                        ref={inputRef}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              {/*<Button type="submit">*/}
              {/*  Submit*/}
              {/*</Button>*/}
              {form.getValues("auditName") &&
                  <Button
                      variant="destructive"
                      type="reset"
                      onClick={() => {
                        form.reset({
                          auditName: "",
                        })
                        form.setValue("auditName", "")
                        setCurrentNotifications(notifications)
                        setFilterData(false)
                      }}
                  >
                      <Icons.searchX/>
                  </Button>
              }

            </form>

          </Form>
        </div>
        {
          notifications?.length ? (
              <>
                {
                  currentSliceNotifications.length ? (
                      <>
                        <div className="divide-y divide-border rounded-md border mt-3">
                          {currentSliceNotifications.map((notification) => (
                            <NotificationItem
                              key={notification.uid}
                              notification={notification}
                            />
                          ))}
                        </div>

                        <CustomPagination
                          totalPages={Math.ceil(totalData / pageSize)}
                          setCurrentPage={setCurrentPage}
                        />
                      </>
                    ) :
                    <div className="divide-y divide-border rounded-md border mt-3">
                      <div className="text-center font-semibold py-10">No Data Found</div>
                    </div>
                }
              </>
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

NotificationList.Skeleton = function NotificationListSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-full"/>
      </div>
    </div>
  )
}

export default NotificationList;