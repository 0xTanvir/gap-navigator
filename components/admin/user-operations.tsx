import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, dateFormat } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { User, UserAccountStatus, UserRole } from "@/types/dto";
import * as z from "zod";
import {
  userRoleUpdateSchema,
  userStatusUpdateSchema,
} from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateUserById, updateUserProfile } from "@/lib/firestore/user";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { profileFormSchema } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageData, userImageUpload } from "@/components/settings/profile-form";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { setRoleChangeNotification, setUserStatusChangeNotification } from "@/lib/firestore/notification";

interface UserOperationsProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User[] | []>>;
}

type FormData = z.infer<typeof userRoleUpdateSchema>;

type formData = z.infer<typeof userStatusUpdateSchema>;

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const UserOperations = ({user, setUser}: UserOperationsProps) => {
  const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] =
    React.useState<boolean>(false);

  const [isUpdatingAccountStatusLoading, setIsUpdatingAccountStatusLoading] =
    React.useState<boolean>(false);
  const [showAccountStatusDialogOpen, setShowAccountStatusDialogOpen] =
    React.useState<boolean>(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileName, setFileName] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(userRoleUpdateSchema),
    defaultValues: {
      role: user.role,
    },
  });

  async function onUpdateSubmit(data: FormData) {
    setIsUpdateLoading(true);
    try {
      const updateUser = {
        ...user,
        role: data.role,
      };
      if (user.role !== data.role) {
        const updated = await updateUserById(user.uid, updateUser);
        if (updated) {
          setUser((users) => {
            return users.filter((u) => u.uid !== user.uid);
          });

          let roleChangeNotification = {
            uid: uuidv4(),
            title: `${updateUser.firstName + " " + updateUser.lastName} role change`,
            action_type: "ROLE_CHANGE",
            action_value: "role change",
            message: "",
            status: false,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          }

          roleChangeNotification.message = `<b class="capitalize">${updateUser.firstName + " " + updateUser.lastName}'s</b> role has been updated <br/> from 
          <b class="capitalize">${user.role}</b> to <b>${updateUser.role}</b> on ${dateFormat(roleChangeNotification.createdAt)}.`

          await setRoleChangeNotification(updateUser.uid, roleChangeNotification)

          return toast.info("User role updated successfully.");
        }
      } else {
        return toast.info("Same user role", {
          description: `The user role is the same as before.`,
        });
      }
    } catch (err) {
      return toast.error("Something went wrong.", {
        description: "Failed to update user role. Please try again.",
      });
    } finally {
      setIsUpdateLoading(false);
      setShowUpdateDialog(false);
      form.reset();
    }
  }

  const formUserStatus = useForm<formData>({
    resolver: zodResolver(userStatusUpdateSchema),
    defaultValues: {
      status: user.status === "" ? UserAccountStatus.ENABLE : user.status,
    },
  });

  async function handleUserStatusUpdate(data: formData) {
    setIsUpdatingAccountStatusLoading(true);
    const updateUser = {
      ...user,
      status: data.status === UserAccountStatus.ENABLE ? "" : data.status,
    };
    try {
      if (user.status !== data.status) {
        const updated = await updateUserById(user.uid, updateUser);

        if (updated) {
          setUser((users) => {
            return users.map((u) =>
              u.uid === user.uid ? {...u, status: data.status} : u
            );
          });

          let userStatusNotification = {
            uid: uuidv4(),
            title: `${updateUser.firstName} ${updateUser.lastName} account ${updateUser.status === "" ? "Activated" : "Deactivated"}`,
            action_type: "USER_STATUS",
            action_value: "user status",
            message: "",
            status: false,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          }
          userStatusNotification.message = `<b class="capitalize">${updateUser.firstName + " " + updateUser.lastName}'s</b>
            account has been <br> <b>${updateUser.status === "" ? "Activated" : "Deactivated"} </b> on 
          ${dateFormat(userStatusNotification.createdAt)}.`;
          await setUserStatusChangeNotification(updateUser.uid, userStatusNotification)

          return toast.info(`User account status has been set to ${data.status}.`);
        }
      } else {
        return toast.info("Same user account status", {
          description: `The user account status is the same as before.`,
        });
      }
    } catch (error) {
      return toast.error("Something went wrong.", {
        description: "Failed to update user account status. Please try again.",
      });
    } finally {
      setIsUpdatingAccountStatusLoading(false);
      setShowAccountStatusDialogOpen(false);
      formUserStatus.reset();
    }
  }

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      image: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setLoader(true);
    try {
      let url: any | string
      if (fileName) {
        url = await userImageUpload(fileName, file as File, user?.uid)
          .then((url) => {
            return url;
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }
      let dbUser = await updateUserProfile(user?.uid as string, {
        firstName: data.firstName,
        lastName: data.lastName,
        image: fileName ? url : data.image,
        email: user.email
      });
      setUser(users => users.map(user => user.uid === dbUser.uid ? dbUser : user));
      toast.success("Profile Updated.");
      setLoader(false);
      setFileName("")
      setPreview("");
      setShowUpdateProfile(false)
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("failed to update profile, please try again.");
      setLoader(false);
    }
  }

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        image: user?.image || "",
      });
    }
  }, [user, profileForm]);

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
            onClick={() => setShowUpdateProfile(true)}
          >
            <Icons.fileEdit className="mr-2 h-4 w-4"/>
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator/>

          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onClick={() => {
              router.push(`/user/audits/${user.uid}/evaluations`);
            }}
          >
            <Icons.evaluate className="mr-2 h-4 w-4"/>
            Evaluation
          </DropdownMenuItem>
          <DropdownMenuSeparator/>

          {user.role !== "client" && (
            <>
              <DropdownMenuItem
                className="flex cursor-pointer items-center"
                onClick={() => {
                  router.push(`/user/audits/${user.uid}`);
                }}
              >
                <Icons.audit className="mr-2 h-4 w-4"/>
                Audits
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
            </>
          )}

          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onClick={() => {
              setShowAccountStatusDialogOpen(true);
              formUserStatus.setValue("status", user.status ? user.status : "");
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
                  Make changes to your user role here. Click save when you're
                  done.
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
                          <SelectItem
                            value={UserRole.CONSULTANT}
                            className="capitalize"
                          >
                            {UserRole.CONSULTANT.replace(/\b\w/g, (char) =>
                              char.toUpperCase()
                            )}
                          </SelectItem>
                          <SelectItem
                            value={UserRole.CLIENT}
                            className="capitalize"
                          >
                            {UserRole.CLIENT.replace(/\b\w/g, (char) =>
                              char.toUpperCase()
                            )}
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
                  disabled={
                    isUpdateLoading || user.role === form.getValues("role")
                  }
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

      <Dialog
        open={showAccountStatusDialogOpen}
        onOpenChange={setShowAccountStatusDialogOpen}
      >
        <DialogContent className="s,:max-w-[425px]">
          <Form {...formUserStatus}>
            <form
              onSubmit={formUserStatus.handleSubmit(handleUserStatusUpdate)}
            >
              <DialogHeader>
                <DialogTitle>Update user account status</DialogTitle>
                <DialogDescription>
                  Make changes to your user status here. Click save when you're
                  done.
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
                        defaultValue={
                          user.status === ""
                            ? UserAccountStatus.ENABLE
                            : user.status
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an user account status"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value={UserAccountStatus.DISABLE}
                            className="capitalize"
                          >
                            {UserAccountStatus.DISABLE.replace(
                              /\b\w/g,
                              (char) => char.toUpperCase()
                            )}
                          </SelectItem>

                          <SelectItem
                            value={UserAccountStatus.ENABLE}
                            className="capitalize"
                          >
                            {UserAccountStatus.ENABLE.replace(/\b\w/g, (char) =>
                              char.toUpperCase()
                            )}
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
                    "cursor-not-allowed opacity-60":
                    isUpdatingAccountStatusLoading,
                  })}
                  disabled={
                    isUpdatingAccountStatusLoading ||
                    user.status === formUserStatus.getValues("status")
                  }
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

      <Sheet open={showUpdateProfile} onOpenChange={setShowUpdateProfile}>
        <SheetContent className="sm:max-w-[80vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Update User Information</SheetTitle>
            <SheetDescription>
              Make changes to your audit here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={profileForm.control}
                name="firstName"
                disabled={loader}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input variant="ny" placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="lastName"
                disabled={loader}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input variant="ny" placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                disabled={true}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input variant="ny" placeholder="Please enter email" {...field} />
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="image"
                render={({field: {value, onChange, ...rest}}) => (
                  <div className="relative w-40 h-40">
                    <div className="space-y-2">
                      <Avatar className="w-40 h-40">
                        <AvatarImage src={preview ? preview : user?.image}/>
                        <AvatarFallback>
                          {user &&
                            user?.firstName[0].toUpperCase() +
                            user?.lastName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/*{*/}
                      {/*  user.image !== "" ?*/}
                      {/*    <Avatar className="w-40 h-40">*/}
                      {/*      <AvatarImage src={user?.image}/>*/}
                      {/*    </Avatar>*/}
                      {/*    :*/}
                      {/*    <Avatar className="w-40 h-40">*/}
                      {/*      <AvatarImage src={preview ? preview : user?.image}/>*/}
                      {/*      <AvatarFallback>*/}
                      {/*        {user &&*/}
                      {/*          user?.firstName[0].toUpperCase() +*/}
                      {/*          user?.lastName[0].toUpperCase()}*/}
                      {/*      </AvatarFallback>*/}
                      {/*    </Avatar>*/}
                      {/*}*/}

                    </div>

                    {preview ? (
                      <div
                        className="absolute z-10 bottom-5 right-0 bg-white border border-transparent rounded-2xl transition-all duration-75 ease-in-out"
                        style={{
                          boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <div className="cursor-pointer rounded-2xl grid place-items-center">
                          <Icons.cancel
                            onClick={() => setPreview("")}
                            className="h-6 w-6"
                          />
                        </div>
                      </div>
                    ) : (
                      <FormItem
                        className="absolute z-10 bottom-5 right-0 w-8 h-8 bg-white border border-transparent rounded-2xl transition-all duration-75 ease-in-out"
                        style={{
                          boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <FormLabel
                          htmlFor="thumbnail"
                          className="cursor-pointer w-8 h-8 rounded-2xl grid place-items-center"
                        >
                          <Icons.fileEdit className="h-5 w-5"/>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="hidden"
                            type="file"
                            id="thumbnail"
                            accept=".png, .jpg, .jpeg"
                            {...rest}
                            onChange={async (event) => {
                              const {files, displayUrl} = getImageData(event);
                              setFile(files);
                              setFileName(files.name);
                              setPreview(displayUrl);
                            }}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}

                  </div>
                )}
              />

              <Button
                className={cn(buttonVariants({variant: "default"}))}
                disabled={loader}
                type="submit"
              >
                {loader && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                Update Profile
              </Button>

            </form>
          </Form>

        </SheetContent>
      </Sheet>

    </>
  );
};

export default UserOperations;
