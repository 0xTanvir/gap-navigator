export default function AuditSinglePage({params}: { params: { userId: string } }) {
  return (
      <div>
        <h1>Evaluation {params.userId}</h1>
      </div>
  )
}