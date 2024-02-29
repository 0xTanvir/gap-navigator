import Link from "next/link"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { AuditOperations } from "@/components/dashboard/audit-operations"
import { Audit, Audits } from "@/types/dto"
import { Icons } from "../icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react";
import { getAllCompletedEvaluations } from "@/lib/firestore/evaluation";

interface AuditItemProps {
  userId: string
  audit: Audit
  archive?: boolean
  setAudits?: React.Dispatch<React.SetStateAction<Audits | []>>;
}

export function AuditItem({userId, audit, archive, setAudits}: AuditItemProps) {
  const [countEvaluations, setCountEvaluations] = useState<number | 0>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    async function fetchEvaluation() {
      try {
        const {evaluations} = await getAllCompletedEvaluations(audit.uid)
        setCountEvaluations(evaluations.length)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvaluation()
  }, []);
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <div className="flex gap-2">
          <Link
            href={archive ? '#' : `/audit/${audit.uid}`}
            className="font-semibold hover:underline"
          >
            {audit.name}
          </Link>
        </div>

        {
          isLoading ? <Skeleton className="h-4 w-full"/> :
            <p className="text-sm text-muted-foreground">
              Total Evaluation : {countEvaluations}
            </p>
        }


        <div>
          <div className="flex text-sm text-muted-foreground">
            {/* TODO: Use it from enums */}
            {audit.type === "public" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.users className="w-4 h-4 mr-1"/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Public Audit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {audit.type === "exclusive" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.userPlus className="w-4 h-4 mr-1"/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exclusive Audit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {audit.type === "private" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.lock className="w-4 h-4 mr-1"/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Private Audit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {formatDate(audit.createdAt)}
          </div>
        </div>
      </div>
      <AuditOperations
        archive={archive}
        userId={userId}
        audit={audit}
        setAudits={setAudits}
        countEvaluations={countEvaluations}
      />
    </div>
  )
}

AuditItem.Skeleton = function AuditItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5"/>
        <Skeleton className="h-4 w-4/5"/>
      </div>
    </div>
  )
}
