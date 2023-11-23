import React from 'react';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { GroupedAudits } from "@/types/dto";

interface DashboardOverviewChartProps{
  auditsGroupByMonth: GroupedAudits[]
}

const DashboardOverviewChart = ({auditsGroupByMonth}:DashboardOverviewChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={auditsGroupByMonth}>
                <XAxis
                    dataKey="name"
                    stroke="#2662EB"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#2662EB"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill="#2662EB" radius={[4, 4, 0, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DashboardOverviewChart;