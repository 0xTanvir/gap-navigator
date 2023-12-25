import React, { useEffect, useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { User, UserRole } from "@/types/dto";
import { fetchUsersByRole } from "@/lib/firestore/user";
import { toast } from "@/components/ui/use-toast";
import UserItem from "@/components/admin/user-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";

const AdminClients = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [users, setUser] = useState<User[] | []>([])

  async function fetchClientData() {
    try {
      const records = await fetchUsersByRole(UserRole.CLIENT)
      setUser(records)
    } catch (err) {
      toast({
        title: "Something went wrong.",
        description: "Failed to fetch audits. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClientData()
  }, [])

  if (isLoading) {
    return (
        <>
          <DashboardHeader heading="Clients" text="Manage clients.">
          </DashboardHeader>
          <div className="divide-border-200 divide-y rounded-md border">
            <UserItem.Skeleton/>
            <UserItem.Skeleton/>
            <UserItem.Skeleton/>
            <UserItem.Skeleton/>
          </div>
        </>
    )
  }

  return (
      <>
        <DashboardHeader heading="Clients" text="Manage clients.">
        </DashboardHeader>

        {
          users?.length ? (
                  <div className="divide-y divide-border rounded-md border">
                    {users.map((user) => (
                        <UserItem key={user.uid} user={user} setUser={setUser}/>
                    ))}
                  </div>
              )
              : (
                  <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="users"/>
                    <EmptyPlaceholder.Title>No clients</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                      You don&apos;t have any clients yet.
                    </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
              )
        }
      </>
  );
};

export default AdminClients;