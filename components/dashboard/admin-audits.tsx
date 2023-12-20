import React, { useEffect, useState } from 'react';
import { getAudits } from "@/lib/firestore/audit";
import useAudits from "@/components/dashboard/AuditsContext";
import { AuditActionType } from "@/types/dto";
import { toast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditCreateButton } from "@/components/dashboard/audit-create-button";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";

interface AdminAuditsProps {
    userId: string
}

const AdminAudits = ({userId}: AdminAuditsProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {audits, dispatch} = useAudits()

    useEffect(() => {
        async function fetchAllAudits() {
            try {
                const dbAudits = await getAudits()
                console.log(dbAudits)
                dispatch({type: AuditActionType.ADD_MULTIPLE_AUDITS, payload: dbAudits})
            } catch (err) {
                toast({
                    title: "Something went wrong.",
                    description: `Failed to fetch audits. Please try again, ${err}`,
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchAllAudits()
    }, [])

    if (isLoading) {
        return (<>
                <DashboardHeader heading="Audits" text="Manage audits.">
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
            <DashboardHeader heading="Audits" text="Manage audits.">
            </DashboardHeader>

            <div>
                {audits?.length ? (
                    <div className="divide-y divide-border rounded-md border">
                        {audits.map((audit) => (
                            <AuditItem key={audit.uid} userId={userId} audit={audit}/>
                        ))}
                    </div>
                ) : (
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="audit"/>
                        <EmptyPlaceholder.Title>No audits created</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any audits yet. Start creating audit.
                        </EmptyPlaceholder.Description>
                        <AuditCreateButton userId={userId} variant="outline"/>
                    </EmptyPlaceholder>
                )}
            </div>
        </>
    );
};

export default AdminAudits;