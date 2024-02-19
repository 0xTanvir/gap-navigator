import ReviewComponent from "@/components/review/review-component";

export default function IndexPage({params}: { params: { auditId: string } }) {
  return (
    <div className="container">
      <ReviewComponent auditId={params.auditId}/>
    </div>
  )
}