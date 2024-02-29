import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Evaluate } from "@/types/dto";
import Link from "next/link";

interface DashboardRecentEvaluationProps {
  evaluation: Evaluate
}

const DashboardRecentEvaluation = ({evaluation}: DashboardRecentEvaluationProps) => {
  return (
    <div className="flex items-center">
      <div className="space-y-1">
        <Link href={`evaluate/${evaluation.auditId}`} className="hover:underline text-sm font-medium leading-none">
          {evaluation.auditName}
        </Link>
        <p className="text-sm text-muted-foreground">
          {evaluation.participantEmail}
        </p>
      </div>
    </div>
  );
};

export default DashboardRecentEvaluation;