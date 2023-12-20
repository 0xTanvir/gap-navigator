"use client"
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { getAudit } from "@/lib/firestore/audit";
import { Audit, User } from "@/types/dto";
import QuestionItem from "@/app/(audit)/audit/[auditId]/question-item";
import { getUserByIds } from "@/lib/firestore/user";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import UserItem from "@/app/(audit)/[auditId]/user-item";

interface UserListProps {
    auditId: string
}

const UserList = ({auditId}: UserListProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [audit, setAudit] = useState<Audit | null>(null)
    const [users, setUsers] = useState<User[] | []>([])

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
                <AuditEditorHeader.Skeleton/>
                <div className="divide-border-200 mt-8 divide-y rounded-md border">
                    <QuestionItem.Skeleton/>
                    <QuestionItem.Skeleton/>
                    <QuestionItem.Skeleton/>
                    <QuestionItem.Skeleton/>
                    <QuestionItem.Skeleton/>
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

            {
                users.length ?
                    <div className="divide-y divide-border rounded-md border mt-8">
                        {
                            users.map((user) =>
                                <UserItem key={user.uid} user={user} auditId={auditId}/>
                            )
                        }
                    </div>
                    :
                    <EmptyPlaceholder className="mt-3">
                        <EmptyPlaceholder.Icon name="audit"/>
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