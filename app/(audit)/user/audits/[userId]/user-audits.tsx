import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { getUserById } from "@/lib/firestore/user";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { AuditActionType, Audits } from "@/types/dto";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import useAudits from "@/components/dashboard/AuditsContext";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditCreateButton } from "@/components/dashboard/audit-create-button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/custom-pagination/custom-pagination";

interface UserAuditsProps {
  userId: string;
}

const UserAudits = ({userId}: UserAuditsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const {audits, dispatch} = useAudits();
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)
  const [auditName, setAuditName] = useState<string>("")
  const [auditType, setAuditType] = useState<string>("all")
  const [currentSliceAudits, setCurrentSliceAudits] = useState<Audits | []>([]);

  const {user} = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);


  const debounce = (call: any, delay: number) => {
    let timer: any
    return function (...args: any) {
      // @ts-ignore
      const context = this
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        call.apply(context, args)
      }, delay)
    }
  }

  const handleChange = (e: any) => {
    setAuditName(e.target.value)
    setCurrentPage(1)
  }
  const inputDebounce = useCallback(debounce(handleChange, 1000), [])

  const handleReset = () => {
    setAuditType("all")
    setCurrentPage(1)
    setAuditName("")
    // @ts-ignore
    inputRef.current.value = '';
  }

  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize

  useEffect(() => {
    if (auditName && auditType === "all") {
      let filterData = audits.filter(audit => audit.name.toLowerCase().includes(auditName.toLowerCase()));
      setTotalData(filterData.length)
      setCurrentSliceAudits(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
    } else if (auditName && auditType !== "all") {
      let filterData = audits.filter(audit => audit.name.toLowerCase().includes(auditName.toLowerCase()) && audit.type === auditType)
      setTotalData(filterData.length)
      setCurrentSliceAudits(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
    } else if (auditType !== "all") {
      let filterData = audits.filter(audit => audit.type === auditType)
      setTotalData(filterData.length)
      setCurrentSliceAudits(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
    } else {
      setTotalData(audits.length)
      setCurrentSliceAudits(audits.slice(indexOfFirstAudit, indexOfLastAudit))
    }
  }, [totalData, audits, indexOfLastAudit, indexOfFirstAudit, auditType, auditName]);

  useEffect(() => {
    async function fetchUserAllAudits() {
      try {
        const dbUser = await getUserById(userId);
        const dbAudits = await getAuditsByIds(dbUser.audits);
        dispatch({
          type: AuditActionType.ADD_MULTIPLE_AUDITS,
          payload: dbAudits,
        });
      } catch (error) {
        toast.error("Failed to fetch audits. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserAllAudits();
  }, []);

  if (isLoading) {
    return (
      <>
        <AuditEditorShell>
          <Link
            href="#"
            className={cn(
              buttonVariants({variant: "ghost"}),
              "absolute left-[-150px] top-4 hidden xl:inline-flex"
            )}
          >
            <Skeleton className="h-10 w-24"/>
          </Link>

          <DashboardHeader heading="Audits" text="Create and manage audits.">
            <Skeleton className="h-10 w-32"/>
          </DashboardHeader>
          <div className="divide-border-200 divide-y rounded-md border mt-3">
            <AuditItem.Skeleton/>
            <AuditItem.Skeleton/>
            <AuditItem.Skeleton/>
            <AuditItem.Skeleton/>
            <AuditItem.Skeleton/>
          </div>
        </AuditEditorShell>
      </>
    );
  }

  return (
    <>
      <AuditEditorShell>
        <Link
          href="/consultants"
          className={cn(
            buttonVariants({variant: "ghost"}),
            "absolute left-[-150px] top-4 hidden xl:inline-flex"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4"/>
          Back
        </Link>

        <DashboardHeader heading="Audits" text="Manage audits.">
          {user?.role === "consultant" && <AuditCreateButton userId={userId}/>}
        </DashboardHeader>

        <div className="px-1.5 flex flex-col sm:flex-row  sm:items-end justify-end gap-3 mr-1">
          <div className="">
            <Input
              placeholder="Audit Name"
              ref={inputRef}
              type="text"
              onChange={(e) => {
                inputDebounce(e)
              }}
            />
          </div>

          <div className="w-full sm:w-44">
            <Select
              defaultValue={auditType}
              onValueChange={(value) => {
                setCurrentPage(1)
                setAuditType(value)
              }}
              value={auditType}
            >
              <SelectTrigger id="auditType">
                <SelectValue placeholder="Select"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(auditName || auditType !== "all") &&
              <Button
                  variant="destructive"
                  type="reset"
                  onClick={handleReset}
              >
                  <Icons.searchX/>
              </Button>
          }
        </div>

        <div>
          {audits?.length ? (
            <>
              {
                currentSliceAudits.length ? (
                    <>
                      <div className="divide-y divide-border rounded-md border mt-10">
                        {currentSliceAudits.map((audit) => (
                          <AuditItem key={audit.uid} userId={userId} audit={audit} />
                        ))}
                      </div>
                      <CustomPagination
                        totalPages={Math.ceil(totalData / pageSize)}
                        setCurrentPage={setCurrentPage}
                      />
                    </>
                  ) :
                  <div className="divide-y divide-border rounded-md border mt-10">
                    <div className="text-center font-semibold py-10">No Data Found</div>
                  </div>
              }
            </>
          ) : (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="audit"/>
              <EmptyPlaceholder.Title>No audits created</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                You don&apos;t have any audits yet. Start creating audit.
              </EmptyPlaceholder.Description>
              <AuditCreateButton userId={userId} variant="outline"/>
            </EmptyPlaceholder>
          )}
        </div>

        <hr className="mt-12 xl:hidden"/>
        <div className="flex justify-center py-6 lg:py-10 xl:hidden">
          <Link
            href="/consultants"
            className={cn(buttonVariants({variant: "ghost"}))}
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4"/>
            Back
          </Link>
        </div>
      </AuditEditorShell>
    </>
  );
};

export default UserAudits;
