import React, { useEffect, useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { useAuth } from "@/components/auth/auth-provider";
import { getEvaluationByIds } from "@/lib/firestore/evaluation";
import { Evaluate, GroupedAudits, GroupedEvaluation } from "@/types/dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardOverviewChart from "@/components/dashboard/dashboard-overview-chart";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardRecentEvaluation from "@/components/dashboard/dashboard-recent-evaluation";
import { useRouter } from "next/navigation";

const ClientDashboard = () => {
  const [evaluationComplete, setEvaluationComplete] = useState<number>(0)
  const [evaluationIncomplete, setEvaluationIncomplete] = useState<number>(0)
  const [evaluationDraft, setEvaluationDraft] = useState<number>(0)
  const [evaluations, setEvaluations] = useState<Evaluate[] | []>([])
  const [evaluationsGroupByMonth, setEvaluationsGroupByMonth] = useState<GroupedEvaluation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const {user} = useAuth()
  const router = useRouter()

  function countEvaluationsByMonth(evaluations: Evaluate[]): GroupedEvaluation[] {
    const groupedDates: { [key: string]: Date[] } = evaluations.reduce((acc: { [key: string]: Date[] }, evaluate) => {
      const createdAt = new Date(evaluate.createdAt.seconds * 1000); // Convert seconds to milliseconds
      const yearMonth = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[yearMonth]) {
        acc[yearMonth] = [];
      }
      acc[yearMonth].push(createdAt);
      return acc;
    }, {});

    const groupedEvaluation: GroupedEvaluation[] = Object.keys(groupedDates).map((yearMonth) => {
      const monthName = groupedDates[yearMonth][0].toLocaleString('default', {month: 'short'});
      const total = groupedDates[yearMonth].length;
      return {
        name: `${monthName}`,
        total: total,
      };
    });
    return groupedEvaluation.slice(-12);
  }

  useEffect(() => {
    async function fetchAuditsEvaluation() {
      if (user?.invitedAuditsList) {
        let evaluation = await getEvaluationByIds(user?.invitedAuditsList, user.email)
        let completed = evaluation.filter(evaluate => evaluate.isCompleted)
        setEvaluations(completed)
        let draft = evaluation.filter(evaluate => !evaluate.isCompleted)
        setEvaluationComplete(completed.length)
        setEvaluationIncomplete((user?.invitedAuditsList.length) - (completed.length + draft.length))
        setEvaluationDraft(draft.length)
        let groupedEvaluations = countEvaluationsByMonth(completed)
        setEvaluationsGroupByMonth(groupedEvaluations)
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Complete evaluation"
            totalNumber={evaluationComplete} iconName="evaluate"
            handleClick={() => {
              router.push("/audits?status=complete");
            }}
          />
          <DashboardCard
            title="Incomplete evaluation"
            totalNumber={evaluationIncomplete}
            iconName="evaluate"
            handleClick={() => {
              router.push("/audits?status=invited");
            }}
          />
          <DashboardCard
            title="Draft evaluation"
            totalNumber={evaluationDraft}
            iconName="evaluate"
            handleClick={() => {
              router.push("/audits?status=draft");
            }}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Evaluation Per Months</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardOverviewChart auditsGroupByMonth={evaluationsGroupByMonth}/>
            </CardContent>
          </Card>

          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Evaluation</CardTitle>
            </CardHeader>
            <CardContent>

              <div className="space-y-8">
                {evaluations.length > 0 ?
                  evaluations.slice(0, 5).map((evaluation) => (
                    <DashboardRecentEvaluation key={evaluation.uid} evaluation={evaluation}/>
                  )) :
                  <p className="text-center">No data found</p>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;