import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Evaluate } from "@/types/dto";

interface DashboardRecentEvaluationProps {
  evaluation: Evaluate
}

const DashboardRecentEvaluation = ({evaluation}: DashboardRecentEvaluationProps) => {
  return (
      <>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{evaluation.participantFirstName[0].toUpperCase() + evaluation.participantLastName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{evaluation.participantFirstName + " " + evaluation.participantLastName}</p>
            <p className="text-sm text-muted-foreground">
              {evaluation.participantEmail}
            </p>
          </div>
          {/*<div className="ml-auto font-medium">+$1,999.00</div>*/}
        </div>
      </>
  );
};

export default DashboardRecentEvaluation;