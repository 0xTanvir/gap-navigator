import React from 'react';
import EvaluationReport from "@/components/report/evaluation-report";

export default function IndexPage({params}: { params: { auditId: string } }) {
  return (
    <div className="container">
      <EvaluationReport auditId={params.auditId} />
    </div>
  );
};