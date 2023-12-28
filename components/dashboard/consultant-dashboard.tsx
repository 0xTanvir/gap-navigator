import React, { useEffect, useState } from 'react';
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardRecentEvaluation from "@/components/dashboard/dashboard-recent-evaluation";
import DashboardOverviewChart from "@/components/dashboard/dashboard-overview-chart";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { Audit, Evaluate, GroupedAudits } from "@/types/dto";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllEvaluations } from "@/lib/firestore/evaluation";
import { toast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useRouter } from "next/navigation";

interface AuditsCounts {
  publicAuditsCount: number | undefined;
  privateAuditsCount: number | undefined;
  exclusiveAuditsCount: number | undefined;
}

interface ConsultantDashboardProps {
  userAuditsId: string[]
}

const ConsultantDashboard = ({userAuditsId}: ConsultantDashboardProps) => {
  const [auditsCounts, setAuditsCounts] = useState<AuditsCounts>({
    publicAuditsCount: undefined,
    privateAuditsCount: undefined,
    exclusiveAuditsCount: undefined,
  })
  const [clientsUniqueEvaluation, setClientsUniqueEvaluation] = useState<Evaluate[] | []>([]);
  const [auditsGroupByMonth, setAuditsGroupByMonth] = useState<GroupedAudits[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

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

  async function fetchUniqueEvaluations() {
    try {
      // Use Set to store unique uids
      const uniqueUids = new Set<string>();
      // Use Promise.all to wait for all evaluations to be fetched
      const evaluationPromises = userAuditsId.map(async (auditId) => {
        const evaluations = await getAllEvaluations(auditId);
        // Filter evaluations to keep only unique uids
        const uniqueEvaluations = evaluations.filter((evaluation) => {
          if (!uniqueUids.has(evaluation.uid)) {
            uniqueUids.add(evaluation.uid);
            return true;
          }
          return false;
        });
        return uniqueEvaluations;
      });

      const evaluationsArray = await Promise.all(evaluationPromises);

      // Flatten the array of arrays into a single array
      const flattenedEvaluations = evaluationsArray.flat();

      // Update evaluations state
      setClientsUniqueEvaluation(flattenedEvaluations);

    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Failed to fetch audits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAuditsCount()
    fetchUniqueEvaluations()
  }, [userAuditsId])

  if (isLoading) {
    return <>
      <div className="flex-1 space-y-4">
        <DashboardHeader heading="Dashboard" text="Performance metrics"/>
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
          <DashboardHeader heading="Dashboard" text="Performance metrics"/>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
                title="Total Client"
                totalNumber={clientsUniqueEvaluation?.length} iconName="users"
                handleClick={() => {
                  router.push("/clients")
                }}
            />
            <DashboardCard
                title="Public Audits"
                totalNumber={auditsCounts?.publicAuditsCount ?? 0}
                iconName="audit"
                handleClick={() => {
                  router.push("/audits/public")
                }}
            />
            <DashboardCard
                title="Private Audits"
                totalNumber={auditsCounts?.privateAuditsCount ?? 0}
                iconName="audit"
                handleClick={() => {
                  router.push("/audits/private")
                }}
            />
            <DashboardCard
                title="Exclusive Audits"
                totalNumber={auditsCounts?.exclusiveAuditsCount ?? 0}
                iconName="audit"
                handleClick={() => {
                  router.push("/audits/exclusive")
                }}
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