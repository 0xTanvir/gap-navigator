import React from 'react';
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardRecentEvaluation from "@/components/dashboard/dashboard-recent-evaluation";
import DashboardOverviewChart from "@/components/dashboard/dashboard-overview-chart";

const ConsultantDashboard = () => {
    return (
        <>
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <DashboardCard title="Total Client" totalNumber={450} iconName="users"/>
                    <DashboardCard title="Public Audits" totalNumber={40} iconName="audit"/>
                    <DashboardCard title="Private Audits" totalNumber={50} iconName="audit"/>
                    <DashboardCard title="Exclusive Audits" totalNumber={60} iconName="audit"/>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <DashboardOverviewChart/>
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