import React from 'react';
import { User } from "@/types/dto";
import { Skeleton } from "@/components/ui/skeleton";
import UserOperations from "@/components/admin/user-operations";

interface userItemProps {
  user: User
}

const UserItem = ({user}: userItemProps) => {
  return (
      <div className="flex items-center justify-between p-4">
        <div className="grid gap-1">
          <div className="flex gap-2">
            <p className="font-semibold">
              {(user.firstName + " " + user.lastName).replace(/\b\w/g, (char) => char.toUpperCase())}
            </p>
          </div>

          <div>
            <p className="flex text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <UserOperations/>
      </div>
  );
};

UserItem.Skeleton = function UserItemSkeleton() {
  return (
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-2/5"/>
          <Skeleton className="h-4 w-4/5"/>
        </div>
      </div>
  )
}

export default UserItem;