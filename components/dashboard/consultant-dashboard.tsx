import React, { useEffect, useState } from 'react';
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardRecentEvaluation from "@/components/dashboard/dashboard-recent-evaluation";
import DashboardOverviewChart from "@/components/dashboard/dashboard-overview-chart";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { useAuth } from "@/components/auth/auth-provider";
import { Audit } from "@/types/dto";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditsCounts {
    publicAuditsCount: number | undefined;
    privateAuditsCount: number | undefined;
    exclusiveAuditsCount: number | undefined;
}

export interface GroupedAudits {
    name: string;
    total: number;
}

const ConsultantDashboard = () => {
    const [auditsCounts, setAuditsCounts] = useState<AuditsCounts>({
        publicAuditsCount: undefined,
        privateAuditsCount: undefined,
        exclusiveAuditsCount: undefined,
    })
    const [auditsGroupByMonth, setAuditsGroupByMonth] = useState<GroupedAudits[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {user} = useAuth()
    const userAuditsId = user?.audits

    function countAuditsByMonth(audits: Audit[]): GroupedAudits[] {
        const groupedAudits: { [key: string]: number } = {};

        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        // Initialize counts for all months to 0
        monthNames.forEach(month => {
            const year = new Date().getFullYear();
            groupedAudits[`${month}`] = 0;
        });

        audits.forEach(audit => {
            const createdAt = new Date(audit.createdAt.seconds * 1000); // Convert seconds to milliseconds
            const monthNameKey = `${monthNames[createdAt.getMonth()]}`;
            groupedAudits[monthNameKey]++;
        });

        // Convert the groupedAudits object to an array of MonthTotal objects
        const result: GroupedAudits[] = Object.keys(groupedAudits).map(key => ({
            name: key,
            total: groupedAudits[key],
        }));
        return result;
    }

    async function fetchAuditsCount() {
        if (userAuditsId) {
            const dbAudits = await getAuditsByIds(userAuditsId)

            if (dbAudits) {
                const groupedAudits: GroupedAudits[] = countAuditsByMonth(dbAudits);
                setAuditsGroupByMonth(groupedAudits);
            }

            const publicAuditsCount = dbAudits?.filter(audit => audit.type === "public").length
            const privateAuditsCount = dbAudits?.filter(audit => audit.type === "private").length
            const exclusiveAuditsCount = dbAudits?.filter(audit => audit.type === "exclusive").length

            setAuditsCounts({
                publicAuditsCount,
                privateAuditsCount,
                exclusiveAuditsCount
            })
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchAuditsCount()
    }, [])

    if (isLoading) {
        return <>
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <DashboardCard.Skeleton/>
                    <DashboardCard.Skeleton/>
                    <DashboardCard.Skeleton/>
                    <DashboardCard.Skeleton/>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">
                        <Skeleton className="w-full h-96"/>
                    </div>
                    <div className="col-span-3">
                        <Skeleton className="w-full h-96"/>
                    </div>
                </div>
            </div>
        </>
    }


    return (
        <>
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <DashboardCard
                        title="Total Client"
                        totalNumber={450} iconName="users"
                    />
                    <DashboardCard
                        title="Public Audits"
                        totalNumber={auditsCounts?.publicAuditsCount ?? 0}
                        iconName="audit"
                    />
                    <DashboardCard
                        title="Private Audits"
                        totalNumber={auditsCounts?.privateAuditsCount ?? 0}
                        iconName="audit"
                    />
                    <DashboardCard
                        title="Exclusive Audits"
                        totalNumber={auditsCounts?.exclusiveAuditsCount ?? 0}
                        iconName="audit"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <DashboardOverviewChart auditsGroupByMonth={auditsGroupByMonth}/>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Evaluation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {
                                    [1, 2, 3, 4, 5].map((number) => (
                                        <DashboardRecentEvaluation key={number}/>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default ConsultantDashboard;