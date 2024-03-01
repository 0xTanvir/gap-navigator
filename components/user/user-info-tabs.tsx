"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileInfo from "@/components/user/profile-info";
import { getEvaluationWithUseInfoAndEvaluations } from "@/lib/firestore/evaluation";
import { useAuth } from "@/components/auth/auth-provider";
import { Evaluate } from "@/types/dto";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from '../icons';
import CustomPagination from "@/components/custom-pagination/custom-pagination";
import { useRouter } from "next/navigation";

interface UserInfoTabsProps {
  userId: string
}

interface useInfo {
  participantFirstName: string,
  participantLastName: string,
  participantEmail: string,
  participantPhone: string,
}

const UserInfoTabs = ({userId}: UserInfoTabsProps) => {
  const [activeTab, setActiveTab] = useState("evaluation")
  const [isLoading, setIsLoading] = useState(true)
  const {user, loading, setUser} = useAuth();
  const [userInfo, setUserInfo] = useState<useInfo | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluate[]>([])

  const [auditName, setAuditName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentSliceEvaluations, setCurrentSliceEvaluations] = useState<Evaluate[] | []>([]);
  const [pageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)

  const inputUserNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter()


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
    async function fetchClientsEvaluationData() {
      try {
        if (user?.audits) {
          const {userInfo, evaluations} = await getEvaluationWithUseInfoAndEvaluations(user.audits, userId)
          setUserInfo(userInfo)
          setEvaluations(evaluations)
          setIsLoading(false)
        }
      } catch (err) {
      }
    }

    fetchClientsEvaluationData()
  }, [loading, isLoading]);

  return (
    <>
      <Tabs defaultValue="evaluation" className="sm:flex sm:justify-start sm:items-start gap-10">
        <TabsList className="mb-10 sm:w-[200px] sm:flex sm:flex-col h-auto sm:justify-start bg-transparent">
          <TabsTrigger
            onClick={(e) => {
              setActiveTab("profile")
            }}
            style={activeTab === "profile" ? {
              background: "hsl(210 40% 96.1%)",
              color: "#000"
            } : {background: "transparent"}}
            className="w-full justify-start"
            value="profile"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            onClick={(e) => {
              setActiveTab("evaluation")
            }}
            className="w-full justify-start"
            style={activeTab === "evaluation" ? {
              background: "hsl(210 40% 96.1%)",
              color: "#000"
            } : {background: "transparent"}}
            value="evaluation"
          >
            Evaluation
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full mt-0" value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Info</CardTitle>
              <CardDescription>
                Change user first name, last name and email here. After saving, then save to database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading && userInfo === null ?
                <ProfileInfo.Skeleton/>
                :
                <ProfileInfo userId={userId} userInfo={userInfo}/>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="w-full mt-0" value="evaluation">
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

          <Card>
            <CardHeader>
              <CardTitle>All Evaluations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">

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

              {
                isLoading ?
                  <div className="divide-y divide-border rounded-md border mt-3 p-4">
                    <Skeleton className="h-6 w-full mt-2"/>
                    <Skeleton className="h-6 w-full mt-2"/>
                    <Skeleton className="h-6 w-full mt-2"/>
                  </div> :
                  currentSliceEvaluations.length > 0 ?
                    <React.Fragment>
                      <div className="divide-y divide-border rounded-md border !my-5">
                        {
                          currentSliceEvaluations.map((evaluation, index) => (
                            <div key={index} className="flex items-center justify-between p-4">
                              <div className="grid gap-1">
                                <div className="flex gap-2">
                                  <div className="font-semibold">
                                    <Link href={`/audit/${evaluation.auditId}/review/${evaluation.uid}`}
                                          className="hover:underline">
                                      {evaluation.auditName}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                      <CustomPagination
                        totalPages={Math.ceil(totalData / pageSize)}
                        setCurrentPage={setCurrentPage}
                      />
                    </React.Fragment>
                    :
                    <div className="divide-y divide-border rounded-md border">
                      <div className="text-center font-semibold py-10">No Data Found</div>
                    </div>
              }
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UserInfoTabs;