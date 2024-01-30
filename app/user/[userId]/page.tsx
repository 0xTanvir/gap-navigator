"use client"
import UserInfoTabs from "@/components/user/user-info-tabs";

export default function IndexPage({params}: { params: { userId: string; } }) {
  return (
    <div className=" space-y-6" style={{minHeight: "calc(100vh - 226px)"}}>
      <div>
        <h3 className="text-lg font-medium">User Page</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <UserInfoTabs userId={params.userId.replace(/%40/g, "@")}/>
    </div>
  )
}