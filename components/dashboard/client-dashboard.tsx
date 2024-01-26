import React, { useEffect, useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { useAuth } from "@/components/auth/auth-provider";
import { getEvaluationByIds } from "@/lib/firestore/evaluation";
import { Evaluate, GroupedEvaluation } from "@/types/dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardOverviewChart from "@/components/dashboard/dashboard-overview-chart";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardRecentEvaluation from "@/components/dashboard/dashboard-recent-evaluation";

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

  function countEvaluationsByMonth(evaluations: Evaluate[]): GroupedEvaluation[] {
    const groupedEvaluations: { [key: string]: number } = {};

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    // Initialize counts for all months to 0
    monthNames.forEach((month) => {
      const year = new Date().getFullYear();
      groupedEvaluations[`${month}`] = 0;
    });

    evaluations.forEach((evaluate) => {
      const createdAt = new Date(evaluate.createdAt.seconds * 1000); // Convert seconds to milliseconds
      const monthNameKey = `${monthNames[createdAt.getMonth()]}`;
      groupedEvaluations[monthNameKey]++;
    });

    // Convert the groupedAudits object to an array of MonthTotal objects
    const result: GroupedEvaluation[] = Object.keys(groupedEvaluations).map((key) => ({
      name: key,
      total: groupedEvaluations[key],
    }));
    return result;
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
          />
          <DashboardCard
            title="Incomplete evaluation"
            totalNumber={evaluationIncomplete}
            iconName="evaluate"
          />
          <DashboardCard
            title="Incomplete evaluation"
            totalNumber={evaluationDraft}
            iconName="evaluate"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
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
                    <DashboardRecentEvaluation clients key={evaluation.uid} evaluation={evaluation}/>
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