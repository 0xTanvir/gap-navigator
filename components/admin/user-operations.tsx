import React from 'react';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
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
import { User, UserRole } from "@/types/dto";
import * as z from "zod";
import { userRoleUpdateSchema } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { updateUserById } from "@/lib/firestore/user";

interface UserOperationsProps {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User[] | []>>
}

type FormData = z.infer<typeof userRoleUpdateSchema>

const UserOperations = ({user, setUser}: UserOperationsProps) => {
  const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState<boolean>(false);

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
      </>
  );
};

export default UserOperations;