import AuditsList from "@/app/(audit)/audits/[auditType]/audits-list";

export default function AuditSinglePage({params}: { params: { auditType: string } }) {
  const {auditType} = params

  return (
      <>
        <AuditsList auditType={auditType}/>
      </>
  )
}