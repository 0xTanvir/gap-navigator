import React from 'react';
import { AuditEvaluations } from "@/types/dto";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";

interface ClientAuditItemProps {
  audit: AuditEvaluations
}

const ClientAuditItem = ({audit}: ClientAuditItemProps) => {
  const router = useRouter()
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <div className="flex gap-2">
          <Link
            href={`/evaluate/${audit.auditUid}`}
            className="font-semibold hover:underline"
          >
            {audit.name}
          </Link>

          {
            audit.isCompleted === true &&
              <Badge variant="outline" className="h-4 py-2 text-blue-600">Complete</Badge>
          }
          {
            audit.isCompleted === false &&
              <Badge variant="outline" className="h-4 py-2 text-gray-600">Incomplete</Badge>
          }
          {
            audit.isCompleted === "invited" &&
              <Badge variant="outline" className="h-4 py-2 text-blue-600">New</Badge>
          }

        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4"/>
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onClick={() => {
              router.push(`/evaluate/${audit.auditUid}`)
            }}
          >
            {audit.isCompleted === true ?
              <><Icons.fileEdit className="mr-2 h-4 w-4"/>Edit</> :
              <>
                <Icons.evaluate className="mr-2 h-4 w-4"/>
                Evaluate
              </>
            }
          </DropdownMenuItem>

          {/*{*/}
          {/*  audit.isCompleted === true &&*/}
          {/*    <>*/}
          {/*        <DropdownMenuSeparator/>*/}

          {/*        <DropdownMenuItem*/}
          {/*            className="flex cursor-pointer items-center"*/}
          {/*            onClick={() => {*/}
          {/*              router.push(`/evaluate/${audit.auditUid}/completed`)*/}
          {/*            }}*/}
          {/*        >*/}
          {/*            <Icons.fileEdit className="mr-2 h-4 w-4"/>*/}
          {/*            Reports*/}
          {/*        </DropdownMenuItem>*/}
          {/*    </>*/}
          {/*}*/}

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

ClientAuditItem.Skeleton = function clientAuditItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-full"/>
      </div>
    </div>
  )
}

export default ClientAuditItem;