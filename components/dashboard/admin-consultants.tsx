import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { User, UserRole } from "@/types/dto";
import { fetchUsersByRole } from "@/lib/firestore/user";
import { toast } from "sonner";
import UserItem from "@/components/admin/user-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";

const AdminConsultants = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUser] = useState<User[] | []>([]);

  async function fetchConsultantData() {
    try {
      const records = await fetchUsersByRole(UserRole.CONSULTANT);
      setUser(records);
    } catch (err) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchConsultantData();
  }, []);

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          heading="Consultants"
          text="Manage consultants."
        ></DashboardHeader>
        <div className="divide-border-200 divide-y rounded-md border">
          <UserItem.Skeleton />
          <UserItem.Skeleton />
          <UserItem.Skeleton />
          <UserItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        heading="Consultants"
        text="Manage consultants."
      ></DashboardHeader>

      {users?.length ? (
        <div className="divide-y divide-border rounded-md border">
          {users.map((user) => (
            <UserItem key={user.uid} user={user} setUser={setUser} />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="users" />
          <EmptyPlaceholder.Title>No consultants</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any consultant yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </>
  );
};

export default AdminConsultants;
