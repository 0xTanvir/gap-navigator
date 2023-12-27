import EvaluationList from "@/app/(audit)/user/audits/[userId]/evaluations/evaluation-list";

export default function AuditSinglePage({params}: { params: { userId: string } }) {
  return (
      <div>
        <EvaluationList userId={params.userId}/>
      </div>
  )
}