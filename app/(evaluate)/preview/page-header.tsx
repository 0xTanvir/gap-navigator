import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface DocsPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
  id: string
}

export function DocsPageHeader({
                                 heading,
                                 text,
                                 id,
                                 className,
                                 ...props
                               }: DocsPageHeaderProps) {
  return (
    <>
      <div className={cn("space-y-4", className)} {...props}>
        <h1 className="inline-block font-heading text-4xl lg:text-5xl">
          {id && <span className="mr-0.5">{id}.</span>}{heading}
        </h1>
        {text && <p className="text-xl text-muted-foreground">{text}</p>}
      </div>
      <hr className="my-4"/>
    </>
  )
}

DocsPageHeader.Skeleton = function DocsPageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full mb-1 rounded-md px-2 py-1"/>
      <p className="text-xl text-muted-foreground">
        Complete this audit to generate your report.
      </p>
      <hr className="my-4"/>
    </div>
  )
}
