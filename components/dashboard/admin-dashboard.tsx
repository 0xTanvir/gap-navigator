import React, { useEffect, useState } from "react";
import { fetchAuditsWithCount } from "@/lib/firestore/audit";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { retrieveUserCounts } from "@/lib/firestore/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardOverviewChart from "@/components/dashboard/dashboard-overview-chart";
import DashboardRecentEvaluation from "@/components/dashboard/dashboard-recent-evaluation";
import { Audit, GroupedAudits } from "@/types/dto";
import { log } from "node:util";

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
  const [auditsGroupByMonths, setAuditsGroupByMonths] = useState<GroupedAudits[]>(
    []
  );
  const router = useRouter()

  function countAuditsByMonths(audits: Audit[]): GroupedAudits[] {
    const groupedDates: { [key: string]: Date[] } = audits.reduce((acc: { [key: string]: Date[] }, audit) => {
      const createdAt = new Date(audit.createdAt.seconds * 1000);
      const yearMonth = `${createdAt.toLocaleString('default', {month: 'short'})} ${createdAt.getFullYear()}`;
      if (!acc[yearMonth]) {
        acc[yearMonth] = [];
      }
      acc[yearMonth].push(createdAt);
      return acc;
    }, {});

    const comparator = (a: GroupedAudits, b: GroupedAudits) => {
      const aDate = new Date(a.name);
      const bDate = new Date(b.name);
      return aDate.getTime() - bDate.getTime();
    };

    const groupedAudits: GroupedAudits[] = Object.keys(groupedDates)
      .map((yearMonth) => {
        const total = groupedDates[yearMonth].length;
        // console.log(yearMonth.split(" ")[0] + " " + yearMonth.split(" ")[1].slice(-2))
        return {
          name: `${yearMonth}`,
          total: total,
        };
      })
      .sort(comparator);

    let result = groupedAudits.map(audit => {
      return {
        name: audit.name.split(" ")[0] + " " + audit.name.split(" ")[1].slice(-2),
        total: audit.total
      }
    })
    return result.slice(-12);
  }


  async function fetchDashboardData() {
    try {
      const {totalCount, audits} = await fetchAuditsWithCount();
      const {totalConsultantCounts, totalClientCounts} =
        await retrieveUserCounts();
      const newData = {
        auditsCounts: totalCount,
        consultantCounts: totalConsultantCounts,
        clientCounts: totalClientCounts,
      };
      if (audits) {
        const groupedAudits: GroupedAudits[] = countAuditsByMonths(audits);
        setAuditsGroupByMonths(groupedAudits)
      }
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
          <DashboardHeader heading="Dashboard" text="Performance metrics"/>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4">
        <DashboardHeader heading="Dashboard" text="Performance metrics"/>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title={`Total ${
              dashboardData.consultantCounts > 1 ? "Consultants" : "Consultant"
            }`}
            totalNumber={dashboardData.consultantCounts}
            iconName="users"
            handleClick={() => router.push("/consultants")}
          />
          <DashboardCard
            title={`Total ${
              dashboardData.clientCounts > 1 ? "Clients" : "client"
            }`}
            totalNumber={dashboardData.clientCounts}
            iconName="users"
            handleClick={() => router.push("/clients")}
          />
          <DashboardCard
            title={`Total ${
              dashboardData.auditsCounts > 1 ? "Audits" : "Audit"
            }`}
            totalNumber={dashboardData.auditsCounts}
            iconName="audit"
            handleClick={() => router.push("/audits")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Audits Per Months</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardOverviewChart auditsGroupByMonth={auditsGroupByMonths}/>
            </CardContent>
          </Card>

          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
