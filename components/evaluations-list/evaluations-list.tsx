"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAllCompletedEvaluations } from "@/lib/firestore/evaluation";
import { Evaluate, User } from "@/types/dto";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AuditEditorShell } from '@/app/(audit)/audit/[auditId]/audit-editor-shell';
import { AuditEditorHeader } from "@/app/(audit)/audit/[auditId]/audit-editor-header";
import { AuditItem } from "@/components/dashboard/audit-item";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/custom-pagination/custom-pagination";

interface EvaluationsListProps {
  auditId: string
}

const EvaluationsList = ({auditId}: EvaluationsListProps) => {
  const [evaluations, setEvaluations] = useState<Evaluate[]>([])
  const [audit, setAudit] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userName, setUserName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentSliceEvaluations, setCurrentSliceEvaluations] = useState<Evaluate[] | []>([]);
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)

  const inputUserNameRef = useRef<HTMLInputElement>(null);


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
    setUserName(e.target.value)
    setCurrentPage(1)
  }
  const inputDebounce = useCallback(debounce(handleChange, 1000), [])

  const handleReset = () => {
    setCurrentPage(1)
    setUserName("")
    // @ts-ignore
    inputUserNameRef.current.value = '';
  }

  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize

  useEffect(() => {
    if (userName) {
      let filterData = evaluations.filter(evaluation => (evaluation.participantFirstName + evaluation.participantLastName).toLowerCase().includes(userName.toLowerCase()));
      setTotalData(filterData.length)
      setCurrentSliceEvaluations(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
    } else {
      setTotalData(evaluations.length)
      setCurrentSliceEvaluations(evaluations.slice(indexOfFirstAudit, indexOfLastAudit))
    }
  }, [totalData, userName, indexOfLastAudit, indexOfFirstAudit, evaluations]);

  useEffect(() => {
    async function fetchEvaluation() {
      try {
        const {auditName, evaluations} = await getAllCompletedEvaluations(auditId)
        setAudit(auditName)
        setEvaluations(evaluations)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvaluation()
  }, []);

  if (isLoading) {
    return (
      <AuditEditorShell>
        <AuditEditorHeader.Skeleton/>
        <div className="divide-border-200 divide-y rounded-md border mt-8">
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
          <AuditItem.Skeleton/>
        </div>
      </AuditEditorShell>
    );
  }

  return (
    <AuditEditorShell>
      <Link
        href="/audits"
        className={cn(
          buttonVariants({variant: "ghost"}),
          "absolute left-[-150px] top-4 hidden xl:inline-flex"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4"/>
        See all audits
      </Link>
      <AuditEditorHeader
        heading={audit}
        text=""
      />

      <div className="px-1.5 flex flex-col sm:flex-row  sm:items-end justify-end gap-3 mr-1">
        <div className="">
          <Input
            placeholder="User Name"
            ref={inputUserNameRef}
            type="text"
            onChange={(e) => {
              inputDebounce(e)
            }}
          />
        </div>
        {userName &&
            <Button
                variant="destructive"
                type="reset"
                onClick={handleReset}
            >
                <Icons.searchX/>
            </Button>
        }
      </div>

      {
        currentSliceEvaluations.length > 0 ?
          <>
            <div className="divide-y divide-border rounded-md border mt-8">
              {currentSliceEvaluations.map(evaluation => (
                <div key={evaluation.uid} className="divide-y divide-border border">
                  <div className="flex items-center justify-between p-4">
                    <div className="grid gap-1">
                      <div className="flex gap-2">
                        <Link
                          href={`/audit/${auditId}/review/${evaluation.uid}`}
                          className="font-semibold capitalize hover:underline"
                        >
                          {evaluation.participantFirstName + " " + evaluation.participantLastName}
                        </Link>
                      </div>

                      <div>
                        <p className="flex text-sm text-muted-foreground">
                          {formatDate(evaluation.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CustomPagination
              totalPages={Math.ceil(totalData / pageSize)}
              setCurrentPage={setCurrentPage}
            />
          </>
          :
          <div className="divide-y divide-border rounded-md border mt-8">
            <div className="text-center font-semibold py-10">No Data Found</div>
          </div>
      }

    </AuditEditorShell>
  );
};

export default EvaluationsList;