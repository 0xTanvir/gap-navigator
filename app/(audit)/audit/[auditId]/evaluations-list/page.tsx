import EvaluationsList from "@/components/evaluations-list/evaluations-list";

export default function IndexPage({params}: { params: { auditId: string } }) {
  return(
    <div className="container">
      <EvaluationsList auditId={params.auditId} />
    </div>
  )
}