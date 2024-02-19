"use client"
import UserInfoTabs from "@/components/user/user-info-tabs";

export default function IndexPage({params}: { params: { userId: string; } }) {
  return (
    <div className="space-y-6" style={{minHeight: "calc(100vh - 226px)"}}>
      <UserInfoTabs userId={params.userId.replace(/%40/g, "@")}/>
    </div>
  )
}