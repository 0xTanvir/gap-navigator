import React, { useCallback, useEffect, useRef, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { User, UserRole } from "@/types/dto";
import { fetchUsersByRole } from "@/lib/firestore/user";
import { toast } from "sonner";
import UserItem from "@/components/admin/user-item";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import CustomPagination from "@/components/custom-pagination/custom-pagination";

const AdminClients = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUser] = useState<User[] | []>([]);
  const [userName, setUserName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentSliceUsers, setCurrentSliceUsers] = useState<User[] | []>([]);
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
      let filterData = users.filter(user => (user.firstName + user.lastName).toLowerCase().includes(userName.toLowerCase()));
      setTotalData(filterData.length)
      setCurrentSliceUsers(filterData.slice(indexOfFirstAudit, indexOfLastAudit))
    } else {
      setTotalData(users.length)
      setCurrentSliceUsers(users.slice(indexOfFirstAudit, indexOfLastAudit))
    }
  }, [totalData, userName, indexOfLastAudit, indexOfFirstAudit, users]);

  useEffect(() => {
    async function fetchClientData() {
      try {
        const records = await fetchUsersByRole(UserRole.CLIENT);
        setUser(records);
      } catch (err) {
        toast.error("Something went wrong.", {
          description: "Failed to fetch audits. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchClientData();
  }, []);

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          heading="Clients"
          text="Manage clients."
        ></DashboardHeader>
        <div className="divide-border-200 divide-y rounded-md border">
          <UserItem.Skeleton/>
          <UserItem.Skeleton/>
          <UserItem.Skeleton/>
          <UserItem.Skeleton/>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        heading="Clients"
        text="Manage clients."
      ></DashboardHeader>

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

      {users?.length ? (
        <>
          {
            currentSliceUsers.length ? (
                <>
                  <div className="divide-y divide-border rounded-md border">
                    {currentSliceUsers.map((user) => (
                      <UserItem key={user.uid} user={user} setUser={setUser}/>
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
          <EmptyPlaceholder.Icon name="users"/>
          <EmptyPlaceholder.Title>No clients</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any clients yet.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </>
  );
};

export default AdminClients;
