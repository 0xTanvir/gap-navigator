import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

interface DashboardCardProps {
    title: string
    totalNumber: number
    iconName: string
}

const DashboardCard = ({title, totalNumber, iconName}: DashboardCardProps) => {
    console.log(iconName)
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {
                    iconName === 'users' ? <Icons.users/> : <Icons.audit/>
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

export default DashboardCard;