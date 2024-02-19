"use client"
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileInfo from "@/components/user/profile-info";
import { getEvaluationWithUseInfoAndEvaluations } from "@/lib/firestore/evaluation";
import { AuditItem } from "@/components/dashboard/audit-item";
import { useAuth } from "@/components/auth/auth-provider";
import { Evaluate } from "@/types/dto";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
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
          <Card>

            <Card className="border-none shadow-none">
              <CardHeader className="pb-0">
                <CardTitle>User Info</CardTitle>
                <CardContent className="space-y-2 p-0">
                  {
                    isLoading ? <Skeleton className="h-6 w-full mt-2"/> :
                      <div className="flex items-center font-semibold">
                        <div className="">Name<span className="mx-1">:</span></div>
                        <div
                          className="capitalize">{userInfo?.participantFirstName + " " + userInfo?.participantLastName}</div>
                      </div>
                  }
                  {
                    isLoading ? <Skeleton className="h-6 w-full mt-2"/> :
                      <div className="flex items-center font-semibold">
                        <div className="">Email<span className="mx-1">:</span></div>
                        <div className="">{userInfo?.participantEmail}</div>
                      </div>
                  }
                  {
                    userInfo?.participantPhone &&
                      <div className="flex items-center font-semibold">
                          <div className="">Email</div>
                          <div className="">{userInfo?.participantPhone}</div>
                      </div>
                  }
                  {
                    isLoading ? <Skeleton className="h-6 w-full mt-2"/> :
                      <div className="flex items-center font-semibold">
                        <div className="">Complete Evaluation<span className="mx-1">:</span></div>
                        <div className="">{evaluations.length}</div>
                      </div>
                  }
                </CardContent>
              </CardHeader>
            </Card>

            <CardHeader>
              <CardTitle>All Evaluations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {
                isLoading ?
                  <div className="divide-y divide-border rounded-md border mt-3 p-4">
                    <Skeleton className="h-6 w-full mt-2"/>
                    <Skeleton className="h-6 w-full mt-2"/>
                    <Skeleton className="h-6 w-full mt-2"/>
                  </div> :
                  evaluations.length > 0 ?
                    <div className="divide-y divide-border rounded-md border mt-3">
                      {
                        evaluations.map((evaluation, index) => (
                          <div key={index} className="flex items-center justify-between p-4">
                            <div className="grid gap-1">
                              <div className="flex gap-2">
                                <div className="font-semibold">
                                  <Link href={`/evaluate/${evaluation.auditId}`} className="hover:underline">
                                    {evaluation.auditName}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
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