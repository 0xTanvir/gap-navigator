import React, { useEffect, useState } from 'react';
import useAudits from "@/components/dashboard/AuditsContext";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { AuditActionType, AuditStatus } from "@/types/dto";
import { toast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";

interface ConsultantArchiveProps {
    userId: string;
    userAuditsId: string[]
}

const ConsultantArchive = ({userId, userAuditsId}: ConsultantArchiveProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {audits, dispatch} = useAudits()

    useEffect(() => {
        async function fetchAudits() {
            try {
                const dbAudits = await getAuditsByIds(userAuditsId, AuditStatus.AUDIT_ARCHIVE)
                dispatch({type: AuditActionType.ADD_MULTIPLE_AUDITS, payload: dbAudits})
            } catch (error) {
                console.log(error)
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
    }, [userAuditsId])

    if (isLoading) {
        return (<>
                <DashboardHeader heading="Audits Archive" text="Manage audits.">
                </DashboardHeader>
                <div className="divide-border-200 divide-y rounded-md border">
                    <AuditItem.Skeleton/>
                    <AuditItem.Skeleton/>
                    <AuditItem.Skeleton/>
                    <AuditItem.Skeleton/>
                    <AuditItem.Skeleton/>
                </div>
            </>
        )
    }
    return (
        <>
            <DashboardHeader heading="Audits Archive" text="Manage audits.">
            </DashboardHeader>

            {audits?.length ? (
                <div className="divide-y divide-border rounded-md border">
                    {audits.map((audit) => (
                        <AuditItem archive={true} key={audit.uid} userId={userId} audit={audit}/>
                    ))}
                </div>
            ) : (
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="audit"/>
                    <EmptyPlaceholder.Title>No archive audits</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        You don&apos;t have any audits yet.
                    </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
            )}

        </>
    );
};

export default ConsultantArchive;