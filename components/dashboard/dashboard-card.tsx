import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardCardProps {
    title: string
    totalNumber: number
    iconName: string
}

const DashboardCard = ({title, totalNumber, iconName}: DashboardCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {
                    iconName === 'users' ? <Icons.users/> :
                        iconName === 'evaluate' ? <Icons.evaluate/> :
                            <Icons.audit/>
                }
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {totalNumber}
                </div>
            </CardContent>
        </Card>
    );
};

DashboardCard.Skeleton = function DashboardCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    <Skeleton className="h-5 w-24"/>
                </CardTitle>
                <Skeleton className="h-6 w-6"/>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-full"/>
            </CardContent>
        </Card>
    )
}

export default DashboardCard;