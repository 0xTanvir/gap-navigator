import React from 'react';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { User, UserAccountStatus, UserRole } from "@/types/dto";
import * as z from "zod";
import { userRoleUpdateSchema, userStatusUpdateSchema } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { updateUserById } from "@/lib/firestore/user";
import { useRouter } from "next/navigation";

interface UserOperationsProps {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User[] | []>>
}

type FormData = z.infer<typeof userRoleUpdateSchema>

type formData = z.infer<typeof userStatusUpdateSchema>

const UserOperations = ({user, setUser}: UserOperationsProps) => {
  const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState<boolean>(false);

  const [isUpdatingAccountStatusLoading, setIsUpdatingAccountStatusLoading] = React.useState<boolean>(false);
  const [showAccountStatusDialogOpen, setShowAccountStatusDialogOpen] = React.useState<boolean>(false);

  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(userRoleUpdateSchema),
    defaultValues: {
      role: user.role
    }
  })

  async function onUpdateSubmit(data: FormData) {
    setIsUpdateLoading(true)
    try {
      const updateUser = {
        ...user,
        role: data.role
      }
      if (user.role !== data.role) {
        const updated = await updateUserById(user.uid, updateUser)
        if (updated) {
          setUser((users) => {
            return users.filter(u => u.uid !== user.uid)
          })
          return toast({
            title: "User updated successfully.",
            description: `Your user was updated.`,
            variant: "success"
          });
        }
      } else {
        return toast({
          title: "User role remains unchanged",
          description: `The user role is the same as before.`,
          variant: "default"
        });
      }
    } catch (err) {
      return toast({
        title: "Something went wrong.",
        description: "Your audit was not updated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdateLoading(false)
      setShowUpdateDialog(false)
      form.reset()
    }
  }

  const formUserStatus = useForm<formData>({
    resolver: zodResolver(userStatusUpdateSchema),
    defaultValues: {
      status: user.status === "" ? UserAccountStatus.ENABLE : user.status
    }
  })

  async function handleUserStatusUpdate(data: formData) {
    setIsUpdatingAccountStatusLoading(true)
    const updateUser = {
      ...user,
      status: data.status === UserAccountStatus.ENABLE ? "" : data.status
    }
    try {
      if (user.status !== data.status) {
        const updated = await updateUserById(user.uid, updateUser);

        if (updated) {
          setUser((users) => {
            return users.map((u) => (u.uid === user.uid ? {...u, status: data.status} : u));
          });

          return toast({
            title: "User account status updated successfully.",
            description: `User account status has been set to ${data.status}.`,
            variant: "success",
          });
        }
      } else {
        return toast({
          title: "User account status remains unchanged",
          description: `The user account status is the same as before.`,
          variant: "default"
        });
      }

    } catch (error) {
      return toast({
        title: "Something went wrong.",
        description: "Your audit was not updated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingAccountStatusLoading(false)
      setShowAccountStatusDialogOpen(false)
      formUserStatus.reset()
    }
  }

  return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger
              className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
            <Icons.ellipsis className="h-4 w-4"/>
            <span className="sr-only">Open</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
                className="flex cursor-pointer items-center"
                onClick={() => setShowUpdateDialog(true)}
            >
              <Icons.userPlus className="mr-2 h-4 w-4"/>
              Role change
            </DropdownMenuItem>

            <DropdownMenuSeparator/>

            <DropdownMenuItem
                className="flex cursor-pointer items-center"
                onClick={() => {
                  router.push(`/user/audits/${user.uid}/evaluations`)
                }}
            >
              <Icons.evaluate className="mr-2 h-4 w-4"/>
              Evaluation
            </DropdownMenuItem>
            <DropdownMenuSeparator/>

            {
                user.role !== 'client' &&
                <>
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center"
                        onClick={() => {
                          router.push(`/user/audits/${user.uid}`)
                        }}
                    >
                        <Icons.audit className="mr-2 h-4 w-4"/>
                        Audits
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                </>
            }


            <DropdownMenuItem
                className="flex cursor-pointer items-center"
                onClick={() => {
                  setShowAccountStatusDialogOpen(true)
                  formUserStatus.setValue("status", user.status ? user.status : '')
                }}
            >
              <Icons.userPlus className="mr-2 h-4 w-4"/>
              Account status change
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onUpdateSubmit)}>
                <DialogHeader>
                  <DialogTitle>Update user role</DialogTitle>
                  <DialogDescription>
                    Make changes to your user role here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                      control={form.control}
                      name="role"
                      render={({field}) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={user.role}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an user role"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={UserRole.CONSULTANT} className="capitalize">
                                  {(UserRole.CONSULTANT).replace(/\b\w/g, (char) => char.toUpperCase())}
                                </SelectItem>
                                <SelectItem value={UserRole.CLIENT} className="capitalize">
                                  {(UserRole.CLIENT).replace(/\b\w/g, (char) => char.toUpperCase())}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage/>
                          </FormItem>
                      )}
                  />
                </div>
                <DialogFooter>
                  <button
                      type="submit"
                      className={cn(buttonVariants({variant: "default"}), {
                        "cursor-not-allowed opacity-60": isUpdateLoading,
                      })}
                      disabled={isUpdateLoading || user.role === form.getValues("role")}
                  >
                    {isUpdateLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                    ) : (
                        <Icons.add className="mr-2 h-4 w-4"/>
                    )}
                    Save changes
                  </button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={showAccountStatusDialogOpen} onOpenChange={setShowAccountStatusDialogOpen}>
          <DialogContent className="s,:max-w-[425px]">
            <Form {...formUserStatus}>
              <form onSubmit={formUserStatus.handleSubmit(handleUserStatusUpdate)}>
                <DialogHeader>
                  <DialogTitle>Update user account status</DialogTitle>
                  <DialogDescription>
                    Make changes to your user status here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <FormField
                      control={formUserStatus.control}
                      name="status"
                      render={({field}) => (
                          <FormItem>
                            <FormLabel>User account status</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={user.status === "" ? UserAccountStatus.ENABLE : user.status}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an user account status"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={UserAccountStatus.DISABLE} className="capitalize">
                                  {(UserAccountStatus.DISABLE).replace(/\b\w/g, (char) => char.toUpperCase())}
                                </SelectItem>

                                <SelectItem value={UserAccountStatus.ENABLE} className="capitalize">
                                  {(UserAccountStatus.ENABLE).replace(/\b\w/g, (char) => char.toUpperCase())}
                                </SelectItem>

                                {/*{*/}
                                {/*    user.status !== "" &&*/}
                                {/*    (*/}
                                {/*        <SelectItem value={UserAccountStatus.ENABLE} className="capitalize">*/}
                                {/*          {(UserAccountStatus.ENABLE).replace(/\b\w/g, (char) => char.toUpperCase())}*/}
                                {/*        </SelectItem>*/}
                                {/*    )*/}
                                {/*}*/}
                              </SelectContent>
                            </Select>
                            <FormMessage/>
                          </FormItem>
                      )}
                  />
                </div>
                <DialogFooter>
                  <button
                      type="submit"
                      className={cn(buttonVariants({variant: "default"}), {
                        "cursor-not-allowed opacity-60": isUpdatingAccountStatusLoading
                      })}
                      disabled={isUpdatingAccountStatusLoading || user.status === formUserStatus.getValues("status")}
                  >
                    {isUpdatingAccountStatusLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                    ) : (
                        <Icons.add className="mr-2 h-4 w-4"/>
                    )}
                    Save changes
                  </button>
                </DialogFooter>

              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </>
  );
};

export default UserOperations;