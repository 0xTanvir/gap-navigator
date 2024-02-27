import React, { useCallback, useEffect, useRef, useState } from "react";
import { getAudits, } from "@/lib/firestore/audit";
import { AuditActionType, Audits } from "@/types/dto";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuditItem } from "@/components/dashboard/audit-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import useAudits from "@/components/dashboard/AuditsContext";
import CustomPagination from "@/components/custom-pagination/custom-pagination";

interface AdminAuditsProps {
  userId: string;
}

const AdminAudits = ({userId}: AdminAuditsProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [audit, setAudit] = useState<Audits | []>([]);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)
  const [auditName, setAuditName] = useState<string>("")
  const [auditType, setAuditType] = useState<string>("all")
  const {audits, dispatch} = useAudits();
  const [currentSliceAudits, setCurrentSliceAudits] = useState<Audits | []>([]);
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
    async function fetchAudits() {
      try {
        const dbAudits = await getAudits();
        dispatch({
          type: AuditActionType.ADD_MULTIPLE_AUDITS,
          payload: dbAudits,
        });
        setAudit(dbAudits)
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
  }, []);

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          heading="Audits"
          text="Manage audits."
        ></DashboardHeader>
        <div className="divide-border-200 divide-y rounded-md border">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <AuditItem.Skeleton key={index}/>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader heading="Audits" text="Manage audits."></DashboardHeader>

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
        {
          audit?.length ? (
            <>
              {
                currentSliceAudits.length ? (
                    <>
                      <div className="divide-y divide-border rounded-md border">
                        {currentSliceAudits.map((audit) => (
                          <AuditItem
                            key={audit.uid}
                            userId={userId}
                            audit={audit}
                            setAudits={setAudit}
                          />
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
              <EmptyPlaceholder.Title>No audits</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                You don&apos;t have any audits yet.
              </EmptyPlaceholder.Description>
            </EmptyPlaceholder>
          )}
      </div>
    </>
  );
};

export default AdminAudits;
