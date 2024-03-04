"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getUserById } from "@/lib/firestore/user";
import { getAllEvaluationWithAuditName } from "@/lib/firestore/evaluation";
import { Evaluate, User } from "@/types/dto";
import { fetchAuditsWithCount } from "@/lib/firestore/audit";
import EvaluationItem from "@/app/(audit)/user/audits/[userId]/evaluations/evaluation-item";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { AuditEditorShell } from "@/app/(audit)/audit/[auditId]/audit-editor-shell";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditItem } from "@/components/dashboard/audit-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/custom-pagination/custom-pagination";

interface EvaluationListProps {
  userId: string;
}

const EvaluationList = ({userId}: EvaluationListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [evaluations, setEvaluations] = useState<Evaluate[] | []>([]);
  const [userInfo, setUserInfo] = useState({
    participantFirstName: "",
    participantLastName: "",
    participantEmail: "",
    participantPhone: "",
  });
  const [user, setUser] = useState<User | null>(null)

  const [auditName, setAuditName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentSliceEvaluations, setCurrentSliceEvaluations] = useState<Evaluate[] | []>([]);
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)

  const router = useRouter();
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
    setAuditName(e.target.value)
    setCurrentPage(1)
  }
  const inputDebounce = useCallback(debounce(handleChange, 1000), [])

  const handleReset = () => {
    setCurrentPage(1)
    setAuditName("")
    // @ts-ignore
    inputUserNameRef.current.value = '';
  }

  const indexOfLastAudit = currentPage * pageSize
  const indexOfFirstAudit = indexOfLastAudit - pageSize

  useEffect(() => {
    if (auditName) {
      let filterData = evaluations.filter(evaluation => evaluation?.auditName?.toLowerCase().includes(auditName.toLowerCase()));
      setTotalData(filterData.length)
      setCurrentSliceEvaluations(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
    } else {
      setTotalData(evaluations.length)
      setCurrentSliceEvaluations(evaluations.slice(indexOfFirstAudit, indexOfLastAudit))
    }
  }, [totalData, auditName, indexOfLastAudit, indexOfFirstAudit, evaluations]);


  useEffect(() => {
    async function fetchUserEvaluation() {
      try {
        const dbUser = await getUserById(userId);
        setUser(dbUser)
        const {audits} = await fetchAuditsWithCount();
        const newEvaluation: any = [];
        for (const audit of audits) {
          const evaluations = await getAllEvaluationWithAuditName(audit.uid);
          const uniqueEvaluations = new Set();
          evaluations.forEach((evaluation) => {
            const key = `${evaluation.auditName}-${evaluation.participantEmail}`;
            if (!uniqueEvaluations.has(key)) {
              uniqueEvaluations.add(key);
              newEvaluation.push(evaluation);
            }
          });
        }
        setEvaluations(
          newEvaluation.filter(
            (evaluation: Evaluate) => evaluation.participantEmail === dbUser.email
          )
        );
        newEvaluation.filter((evaluation: Evaluate) => {
          if (evaluation.participantEmail === dbUser.email) {
            let result = {
              participantFirstName: evaluation.participantFirstName,
              participantLastName: evaluation.participantLastName,
              participantEmail: evaluation.participantEmail,
              participantPhone: evaluation.participantPhone
            }
            setUserInfo(result)
          }
        })
      } catch (error) {
        toast.error("Failed to fetch evaluations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserEvaluation();
  }, []);

  if (isLoading) {
    return (
      <>
        <AuditEditorShell className="!max-w-7xl">
          <Link
            href="#"
            className={cn(
              buttonVariants({variant: "ghost"}),
              "absolute left-[-150px] top-4 hidden xl:inline-flex"
            )}
          >
            <Skeleton className="h-10 w-24"/>
          </Link>

          <Card className="mb-5">
            <CardHeader className="">
              <CardContent
                className="p-0 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card className="p-3 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <CardTitle className="text-[12px] uppercase font-normal">
                      Name
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {
                      isLoading ?
                        <Skeleton className="h-6 w-full mt-2"/> :
                        <div className="text-md capitalize font-medium">
                          {userInfo?.participantFirstName + " " + userInfo?.participantLastName}
                        </div>
                    }
                  </CardContent>
                </Card>

                <Card className="p-3 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <CardTitle className="text-[12px] uppercase font-normal">
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {
                      isLoading ?
                        <Skeleton className="h-6 w-full mt-2"/> :
                        <div className="text-md font-medium">
                          {userInfo?.participantEmail}
                        </div>
                    }
                  </CardContent>
                </Card>

                <Card className="p-3 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <CardTitle className="text-[12px] uppercase font-normal">
                      Phone Number
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {
                      isLoading ?
                        <Skeleton className="h-6 w-full mt-2"/> :
                        <div className="text-md capitalize font-medium">
                          {userInfo?.participantPhone ? userInfo?.participantPhone : "N/A"}
                        </div>
                    }
                  </CardContent>
                </Card>

                <Card className="p-3 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <CardTitle className="text-[12px] uppercase font-normal">
                      Complete Evaluation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {
                      isLoading ?
                        <Skeleton className="h-6 w-full mt-2"/> :
                        <div className="text-md capitalize font-medium">
                          {evaluations.length}
                        </div>
                    }
                  </CardContent>
                </Card>
              </CardContent>
            </CardHeader>
          </Card>

          <DashboardHeader
            heading="Evaluations"
            text=""
          ></DashboardHeader>
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
      <AuditEditorShell className="!max-w-7xl">
        <Link
          href="#"
          onClick={() => router.back()}
          className={cn(
            buttonVariants({variant: "ghost"}),
            "absolute left-[-150px] top-4 hidden xl:inline-flex"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4"/>
          Back
        </Link>

        <Card className="mb-5">
          <CardHeader className="">
            <CardContent
              className="p-0 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="p-3 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between p-0">
                  <CardTitle className="text-[12px] uppercase font-normal">
                    Name
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {
                    isLoading ?
                      <Skeleton className="h-6 w-full mt-2"/> :
                      <div className="text-md capitalize font-medium">
                        {
                          userInfo.participantFirstName ?
                            userInfo?.participantFirstName + " " + userInfo?.participantLastName : user?.firstName + " " + user?.lastName
                        }
                      </div>
                  }
                </CardContent>
              </Card>

              <Card className="p-3 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between p-0">
                  <CardTitle className="text-[12px] uppercase font-normal">
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {
                    isLoading ?
                      <Skeleton className="h-6 w-full mt-2"/> :
                      <div className="text-md font-medium">
                        {userInfo?.participantEmail || user?.email}
                      </div>
                  }
                </CardContent>
              </Card>

              <Card className="p-3 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between p-0">
                  <CardTitle className="text-[12px] uppercase font-normal">
                    Phone Number
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {
                    isLoading ?
                      <Skeleton className="h-6 w-full mt-2"/> :
                      <div className="text-md capitalize font-medium">
                        {userInfo?.participantPhone ? userInfo?.participantPhone : "N/A"}
                      </div>
                  }
                </CardContent>
              </Card>

              <Card className="p-3 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between p-0">
                  <CardTitle className="text-[12px] uppercase font-normal">
                    Complete Evaluation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {
                    isLoading ?
                      <Skeleton className="h-6 w-full mt-2"/> :
                      <div className="text-md capitalize font-medium">
                        {evaluations.length}
                      </div>
                  }
                </CardContent>
              </Card>
            </CardContent>
          </CardHeader>
        </Card>

        <DashboardHeader
          heading="Evaluations"
          text=""
        ></DashboardHeader>

        <div className="px-1.5 flex flex-col sm:flex-row  sm:items-end justify-end gap-3 mr-1 mb-5">
          <div className="">
            <Input
              placeholder="Aduit Name"
              ref={inputUserNameRef}
              type="text"
              onChange={(e) => {
                inputDebounce(e)
              }}
            />
          </div>
          {auditName &&
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
            evaluations.length ?
              <>
                {currentSliceEvaluations?.length ? (
                  <>
                    <div className="divide-y divide-border rounded-md border mt-3">
                      {currentSliceEvaluations.map((evaluation, index) => (
                        <EvaluationItem key={index} evaluation={evaluation}/>
                      ))}
                    </div>
                    <CustomPagination
                      totalPages={Math.ceil(totalData / pageSize)}
                      setCurrentPage={setCurrentPage}
                    />
                  </>
                ) : (
                  <div className="divide-y divide-border rounded-md border">
                    <div className="text-center font-semibold py-10">No Data Found</div>
                  </div>
                )}
              </>
              :
              <EmptyPlaceholder className="mt-3">
                <EmptyPlaceholder.Icon name="evaluate"/>
                <EmptyPlaceholder.Title>No evaluations</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  You don&apos;t have any evaluations yet.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
          }
        </div>

        <hr className="mt-12 xl:hidden"/>
        <div className="flex justify-center py-6 lg:py-10 xl:hidden">
          <Link
            href="#"
            onClick={() => router.back()}
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

export default EvaluationList;
