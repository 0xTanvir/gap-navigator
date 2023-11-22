import React from 'react';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { GroupedAudits } from "@/components/dashboard/consultant-dashboard";

interface DashboardOverviewChartProps{
  auditsGroupByMonth: GroupedAudits[]
}

const DashboardOverviewChart = ({auditsGroupByMonth}:DashboardOverviewChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={auditsGroupByMonth}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DashboardOverviewChart;