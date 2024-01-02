import PdfDownload from "@/app/(evaluate)/evaluate/[auditId]/completed/pdf-download";

export default async function CompletedPage() {

  return (
      <div className="py-6 lg:py-10">
        <PdfDownload/>
      </div>
  )
}