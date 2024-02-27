import React from 'react';
import { Evaluate } from "@/types/dto";
import Link from "next/link";

interface EvaluationItemProps {
  evaluation: Evaluate
}

const EvaluationItem = ({evaluation}: EvaluationItemProps) => {


  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <div className="flex gap-2">
          <Link
            href={`/audit/${evaluation.auditId}/review/${evaluation.uid}`}
            className="font-semibold capitalize hover:underline"
          >
            {evaluation.auditName}
          </Link>
        </div>
        <div>
          <p className="flex text-sm text-muted-foreground">
            {evaluation.participantEmail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvaluationItem;