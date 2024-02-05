import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditCreateButton } from "@/components/dashboard/audit-create-button";
import { getAuditsByIds } from "@/lib/firestore/audit";
import { AuditActionType, Audits } from "@/types/dto";
import { toast } from "sonner";
import useAudits from "./AuditsContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/custom-pagination/custom-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";

interface ConsultantAuditsProps {
  userId: string;
  userAuditsId: string[];
}

export default function ConsultantAudits({
                                           userId,
                                           userAuditsId,
                                         }: ConsultantAuditsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)
  const [auditName, setAuditName] = useState<string>("")
  const [auditType, setAuditType] = useState<string>("all")
  const {audits, dispatch} = useAudits();
  const [currentSliceAudits, setCurrentSliceAudits] = useState<Audits | []>([]);

  const params = useSearchParams()
  const searchParams = params.get("auditType")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null);


  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize

  useEffect(() => {
    if (searchParams) {
      if (searchParams && auditName) {
        let filterData = audits.filter(audit => audit.name === auditName && audit.type === searchParams)
        setTotalData(filterData.length)
        setCurrentSliceAudits(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
      } else {
        let filterData = audits.filter(audit => audit.type === searchParams)
        setTotalData(filterData.length)
        setCurrentSliceAudits(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
      }
    } else if (auditName && auditType === "all") {
      let filterData = audits.filter(audit => audit.name === auditName);
      setTotalData(filterData.length)
      setCurrentSliceAudits(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
    } else if (auditName && auditType !== "all") {
      let filterData = audits.filter(audit => audit.name === auditName && audit.type === auditType)
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
  }, [totalData, audits, indexOfLastAudit, indexOfFirstAudit, searchParams, auditType, auditName]);

  useEffect(() => {
    async function fetchAudits() {
      try {
        const dbAudits = await getAuditsByIds(userAuditsId);
        dispatch({
          type: AuditActionType.ADD_MULTIPLE_AUDITS,
          payload: dbAudits,
        });
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.", {
          description: "Failed to fetch audits. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAudits();
  }, [userAuditsId]); // Run this effect when the userId changes

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
    router.push("/audits")
    setAuditType("all")
    setCurrentPage(1)
    setAuditName("")
    // @ts-ignore
    inputRef.current.value = '';
  }

  if (isLoading) {
    return (
      <>
        <DashboardHeader heading="Audits" text="Create and manage audits.">
          <AuditCreateButton userId={userId}/>
        </DashboardHeader>
        <div className="divide-border-200 divide-y rounded-md border">
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
        </div>
      </>
    );
  }

  return (
    <Suspense>
      <DashboardHeader heading="Audits" text="Create and manage audits.">
        <AuditCreateButton userId={userId}/>
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
            defaultValue={searchParams || auditType}
            onValueChange={(value) => {
              setCurrentPage(1)
              setAuditType(value)
              if (searchParams) {
                if (value === "all") {
                  router.push(`/audits`);
                } else {
                  router.push(`/audits?auditType=${value}`);
                }
              }
            }}
            value={searchParams || auditType}
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

        {searchParams &&
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
                    <div className="divide-y divide-border rounded-md border">
                      {currentSliceAudits.map((audit) => (
                        <AuditItem key={audit.uid} userId={userId} audit={audit}/>
                      ))}
                    </div>
                    <CustomPagination
                      totalPages={Math.ceil(totalData / pageSize)}
                      setCurrentPage={setCurrentPage}
                    />
                  </>
                ) :
                <div className="divide-y divide-border rounded-md border">
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
    </Suspense>
  );
}
