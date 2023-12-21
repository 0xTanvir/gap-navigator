import React, { useEffect, useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { useAuth } from "@/components/auth/auth-provider";
import { getEvaluationByIds } from "@/lib/firestore/evaluation";

const ClientDashboard = () => {
    const [evaluationComplete, setEvaluationComplete] = useState<number>(0)
    const [evaluationIncomplete, setEvaluationIncomplete] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {user} = useAuth()

    useEffect(() => {
        async function fetchAuditsEvaluation() {
            if (user?.invitedAuditsList) {
                let evaluation = await getEvaluationByIds(user?.invitedAuditsList, user.email)
                setEvaluationComplete(evaluation.length)
                setEvaluationIncomplete((user?.invitedAuditsList.length) - (evaluation.length))
                setIsLoading(false)
            }
        }

        fetchAuditsEvaluation()
    }, [])

    if (isLoading) {
        return <>
            <div className="flex-1 space-y-4">
                <DashboardHeader heading="Dashboard" text="Performance metrics"/>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DashboardCard.Skeleton/>
                    <DashboardCard.Skeleton/>
                </div>
            </div>
        </>
    }

    return (
        <>
            <div className="flex-1 space-y-4">
                <DashboardHeader heading="Dashboard" text="Performance metrics"/>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DashboardCard
                        title="Complete evaluation"
                        totalNumber={evaluationComplete} iconName="evaluate"
                    />
                    <DashboardCard
                        title="Incomplete evaluation"
                        totalNumber={evaluationIncomplete}
                        iconName="evaluate"
                    />
                </div>
            </div>
        </>
    );
};

export default ClientDashboard;