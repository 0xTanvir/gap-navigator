import React from 'react'

import { useState, useEffect } from 'react'
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AuditItem } from "@/components/dashboard/audit-item"
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AuditCreateButton } from "@/components/dashboard/audit-create-button"
import { getAuditsByUserId } from "@/lib/firestore/audit"
import { AuditActionType } from '@/types/dto'
import { toast } from "@/components/ui/use-toast"
import useAudits from './AuditsContext'


interface ConsultantDashboardProps {
    userId: string;
}

export default function ConsultantDashboard({ userId }: ConsultantDashboardProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { audits, dispatch } = useAudits()

    useEffect(() => {
        async function fetchAudits() {
            try {
                const dbAudits = await getAuditsByUserId(userId)
                dispatch({ type: AuditActionType.ADD_MULTIPLE_AUDITS, payload: dbAudits })
            } catch (error) {
                toast({
                    title: "Something went wrong.",
                    description: "Failed to fetch audits. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchAudits()
    }, [userId]) // Run this effect when the userId changes

    if (isLoading) {
        return (
            <DashboardShell>
                <DashboardHeader heading="Audits" text="Create and manage audits.">
                    <AuditCreateButton userId={userId} />
                </DashboardHeader>
                <div className="divide-border-200 divide-y rounded-md border">
                    <AuditItem.Skeleton />
                    <AuditItem.Skeleton />
                    <AuditItem.Skeleton />
                    <AuditItem.Skeleton />
                    <AuditItem.Skeleton />
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Audits" text="Create and manage audits.">
                <AuditCreateButton userId={userId} />
            </DashboardHeader>
            <div>
                {audits?.length ? (
                    <div className="divide-y divide-border rounded-md border">
                        {audits.map((audit) => (
                            <AuditItem key={audit.uid} userId={userId} audit={audit} />
                        ))}
                    </div>
                ) : (
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="audit" />
                        <EmptyPlaceholder.Title>No audits created</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any audits yet. Start creating audit.
                        </EmptyPlaceholder.Description>
                        <AuditCreateButton userId={userId} variant="outline" />
                    </EmptyPlaceholder>
                )}
            </div>
        </DashboardShell>
    )
}
