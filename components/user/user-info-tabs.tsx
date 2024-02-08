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

interface UserInfoTabsProps {
  userId: string
}

const UserInfoTabs = ({userId}: UserInfoTabsProps) => {
  const [activeTab, setActiveTab] = useState("evaluation")
  const [isLoading, setIsLoading] = useState(true)
  const {user, loading, setUser} = useAuth();
  const [userInfo, setUserInfo] = useState(null)
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
            <CardHeader>
              <CardTitle>All Evaluations</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae, perspiciatis?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {
                evaluations.length > 0 ?
                  <div className="divide-y divide-border rounded-md border mt-3">
                    {
                      isLoading ?
                        <>
                          <AuditItem.Skeleton/>
                          <AuditItem.Skeleton/>
                          <AuditItem.Skeleton/>
                        </> :

                        evaluations.map(evaluation => (
                          <div key={evaluation.uid} className="flex items-center justify-between p-4">
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