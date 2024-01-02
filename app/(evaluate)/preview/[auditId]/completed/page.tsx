import PreviewPdfDownload from "@/app/(evaluate)/preview/[auditId]/completed/preview-pdf-download";

export default async function CompletedPage() {

  return (
      <div className="py-6 lg:py-10">
        <PreviewPdfDownload/>
      </div>
  )
}