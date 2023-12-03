import React, { useEffect, useState } from 'react';
import { useAuth } from "@/components/auth/auth-provider";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { Audits } from "@/types/dto";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import ClientAuditItem from "@/components/dashboard/client-audit-item";
import { Skeleton } from "@/components/ui/skeleton";

const ClientAudits = () => {
    const [audits, setAudits] = useState<Audits | []>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {user} = useAuth()

    useEffect(() => {
        async function fetchAuditsEvaluation() {
            if (user?.invitedAuditsList) {
                let dbAudits = await getAuditsByIds(user?.invitedAuditsList)
                setAudits(dbAudits)
                setIsLoading(false)
            }
        }

        fetchAuditsEvaluation()
    }, [])

    if (isLoading) {
        return <>
            <DashboardHeader heading="Audits" text="Manage audits."/>
            <div className="divide-border-200 divide-y rounded-md border">
                <ClientAudits.Skeleton/>
                <ClientAudits.Skeleton/>
                <ClientAudits.Skeleton/>
            </div>
        </>
    }

    return (
        <>
            <div className="flex-1 space-y-4">
                <DashboardHeader heading="Audits" text="Manage audits."/>
                {
                    audits.length ? (
                            <div className="divide-y divide-border rounded-md border">
                                {audits.map(audit => (
                                    <ClientAuditItem key={audit.uid} audit={audit}/>
                                ))}
                            </div>
                        )
                        : (
                            <div>No audit found.</div>
                        )
                }
            </div>
        </>
    );
};

ClientAudits.Skeleton = function ClientAuditsSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-full"/>
            </div>
        </div>
    )
}

export default ClientAudits;