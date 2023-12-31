import React, { useEffect, useState } from "react";
import { fetchAuditsWithCount } from "@/lib/firestore/audit";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { retrieveUserCounts } from "@/lib/firestore/user";
import { toast } from "sonner";

interface DashboardCounts {
  auditsCounts: number | 0;
  consultantCounts: number | 0;
  clientCounts: number | 0;
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardCounts>({
    auditsCounts: 0,
    consultantCounts: 0,
    clientCounts: 0,
  });

  async function fetchDashboardData() {
    try {
      const { totalCount } = await fetchAuditsWithCount();
      const { totalConsultantCounts, totalClientCounts } =
        await retrieveUserCounts();
      const newData = {
        auditsCounts: totalCount,
        consultantCounts: totalConsultantCounts,
        clientCounts: totalClientCounts,
      };
      setDashboardData(newData);
    } catch (err) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex-1 space-y-4">
          <DashboardHeader heading="Dashboard" text="Performance metrics" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard.Skeleton />
            <DashboardCard.Skeleton />
            <DashboardCard.Skeleton />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4">
        <DashboardHeader heading="Dashboard" text="Performance metrics" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title={`Total ${
              dashboardData.consultantCounts > 1 ? "Consultants" : "Consultant"
            }`}
            totalNumber={dashboardData.consultantCounts}
            iconName="users"
          />
          <DashboardCard
            title={`Total ${
              dashboardData.clientCounts > 1 ? "Clients" : "client"
            }`}
            totalNumber={dashboardData.clientCounts}
            iconName="users"
          />
          <DashboardCard
            title={`Total ${
              dashboardData.auditsCounts > 1 ? "Audits" : "Audit"
            }`}
            totalNumber={dashboardData.auditsCounts}
            iconName="audit"
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
