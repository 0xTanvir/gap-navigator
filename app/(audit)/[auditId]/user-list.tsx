"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { getAudit } from "@/lib/firestore/audit";
import { Audit, User } from "@/types/dto";
import QuestionItem from "@/app/(audit)/audit/[auditId]/question-item";
import { getUserByIds } from "@/lib/firestore/user";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import UserItem from "@/app/(audit)/[auditId]/user-item";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/custom-pagination/custom-pagination";

interface UserListProps {
  auditId: string
}

const UserList = ({auditId}: UserListProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [audit, setAudit] = useState<Audit | null>(null)
  const [users, setUsers] = useState<User[] | []>([])

  const [userName, setUserName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentSliceUsers, setCurrentSliceUsers] = useState<User[] | []>([]);
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)

  const inputUserNameRef = useRef<HTMLInputElement>(null);


  const debounce = (call: any, delay: number) => {
    let timer: any
    return function (...args: any) {
      // @ts-ignore
      const context = this
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        call.apply(context, args)
      }, delay)
    }
  }

  const handleChange = (e: any) => {
    setUserName(e.target.value)
    setCurrentPage(1)
  }
  const inputDebounce = useCallback(debounce(handleChange, 1000), [])

  const handleReset = () => {
    setCurrentPage(1)
    setUserName("")
    // @ts-ignore
    inputUserNameRef.current.value = '';
  }

  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize

  useEffect(() => {
    if (userName) {
      let filterData = users.filter(user => (user.firstName + user.lastName).toLowerCase().includes(userName.toLowerCase()));
      setTotalData(filterData.length)
      setCurrentSliceUsers(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
    } else {
      setTotalData(users.length)
      setCurrentSliceUsers(users.slice(indexOfFirstAudit, indexOfLastAudit))
    }
  }, [totalData, userName, indexOfLastAudit, indexOfFirstAudit, users]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const dbAudit = await getAudit(auditId)
        setAudit(dbAudit)
        const dbUsers = await getUserByIds(dbAudit?.exclusiveList as string[])
        setUsers(dbUsers)
      } catch (err) {

      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [auditId])

  if (isLoading) {
    return (<AuditEditorShell>
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
        <AuditEditorHeader.Skeleton/>
        <div className="divide-border-200 mt-8 divide-y rounded-md border">
          <QuestionItem.Skeleton/>
          <QuestionItem.Skeleton/>
          <QuestionItem.Skeleton/>
          <QuestionItem.Skeleton/>
          <QuestionItem.Skeleton/>
        </div>
        <hr className="mt-12"/>
        <div className="flex justify-center py-6 lg:py-10">
          <Link href="/audits" className={cn(buttonVariants({variant: "ghost"}))}>
            <Icons.chevronLeft className="mr-2 h-4 w-4"/>
            See all audits
          </Link>
        </div>
      </AuditEditorShell>
    )
  }

  return (
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

      <AuditEditorHeader heading={audit?.name as string} text="Invited user list.">
      </AuditEditorHeader>

      <div className="px-1.5 flex flex-col sm:flex-row  sm:items-end justify-end gap-3 mr-1">
        <div className="">
          <Input
            placeholder="User Name"
            ref={inputUserNameRef}
            type="text"
            onChange={(e) => {
              inputDebounce(e)
            }}
          />
        </div>
        {userName &&
            <Button
                variant="destructive"
                type="reset"
                onClick={handleReset}
            >
                <Icons.searchX/>
            </Button>
        }
      </div>

      {
        users.length ?
          <>
            {
              currentSliceUsers.length > 0 ?
                <>
                  <div className="divide-y divide-border rounded-md border mt-8">
                    {
                      currentSliceUsers.map((user) =>
                        <UserItem
                          key={user.uid}
                          user={user}
                          auditId={auditId}
                          setUsers={setUsers}
                        />
                      )
                    }
                  </div>
                  <CustomPagination
                    totalPages={Math.ceil(totalData / pageSize)}
                    setCurrentPage={setCurrentPage}
                  />
                </>
                :
                <div className="divide-y divide-border rounded-md border mt-8">
                  <div className="text-center font-semibold py-10">No Data Found</div>
                </div>
            }
          </>
          :
          <EmptyPlaceholder className="mt-3">
            <EmptyPlaceholder.Icon name="users"/>
            <EmptyPlaceholder.Title>No user invited</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any users yet. Start invite user.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
      }

      <hr className="mt-12"/>
      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/audits" className={cn(buttonVariants({variant: "ghost"}))}>
          <Icons.chevronLeft className="mr-2 h-4 w-4"/>
          See all audits
        </Link>
      </div>
    </AuditEditorShell>
  )
}
export default UserList;