import React, { useState } from "react";
import { AuditActionType, User } from "@/types/dto";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateAuditUser } from "@/lib/firestore/audit";
import { toast } from "sonner";

interface UserItemProps {
  auditId: string;
  user: User;
  setUsers: (updatedUsers: (prevUsers: User[]) => User[]) => void;
}

const UserItem = ({ user, auditId, setUsers }: UserItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="grid gap-1">
          <div className="flex gap-2">
            <div className="font-semibold">
              {user.firstName + " " + user.lastName}
            </div>
          </div>
          <div>
            <p className="flex text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button
          className={cn(buttonVariants({ variant: "destructive" }))}
          onClick={() => setShowDeleteAlert(true)}
        >
          <Icons.trash className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to remove this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();
                setIsDeleteLoading(true);

                const updated = await updateAuditUser(user.uid, auditId);

                if (updated) {
                  setIsDeleteLoading(false);
                  setShowDeleteAlert(false);
                  // Call the setUsers function to update the state in UserList
                  setUsers((prevUsers: User[]) =>
                    prevUsers.filter((u) => u.uid !== user.uid)
                  );
                  toast.success("User removed from the audit.", {
                    description: `The user was successfully removed from the audit, and AuditId (${auditId}) was successfully removed from the user's exclusive list.`,
                  });
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserItem;
