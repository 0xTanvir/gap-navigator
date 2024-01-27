import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Evaluate } from "@/types/dto";
import Link from "next/link";

interface DashboardRecentEvaluationProps {
  evaluation: Evaluate
  clients?: boolean
}

const DashboardRecentEvaluation = ({evaluation, clients}: DashboardRecentEvaluationProps) => {
  return (
    <>
      {
        clients ?
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{evaluation.participantFirstName[0].toUpperCase() + evaluation.participantLastName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p
                className="text-sm font-medium leading-none">{evaluation.auditName}</p>
              <p className="text-sm text-muted-foreground">
                {evaluation.participantEmail}
              </p>
            </div>
          </div>
          :
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{evaluation.participantFirstName[0].toUpperCase() + evaluation.participantLastName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <Link href={`user/${evaluation.uid}`} className="hover:underline text-sm font-medium leading-none">
                {evaluation.participantFirstName + " " + evaluation.participantLastName}
              </Link>
              <p className="text-sm text-muted-foreground">
                {evaluation.participantEmail}
              </p>
            </div>
          </div>
      }

    </>
  );
};

export default DashboardRecentEvaluation;