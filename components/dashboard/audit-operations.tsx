"use client";

import * as React from "react";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteAudit } from "@/lib/firestore/audit";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Icons } from "@/components/icons";
import { setAudit } from "@/lib/firestore/audit";
import { useAuth } from "@/components/auth/auth-provider";
import useAudits from "./AuditsContext";
import {
  auditInviteSchema,
  auditSchema,
  auditShareSchema,
} from "@/lib/validations/audit";
import { Audit, AuditActionType, Audits, Notification } from "@/types/dto";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { getUserByEmail, updateUserById } from "@/lib/firestore/user";
import { setNotificationData } from "@/lib/firestore/notification";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { siteConfig, url } from "@/config/site";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editorjs/editor"), {
  ssr: false,
});

async function deleteAuditFromDB(userId: string, auditId: string) {
  try {
    await deleteAudit(userId, auditId);
    toast.success("Audit deleted successfully!");
    return true;
  } catch (error) {
    toast.error("Something went wrong.", {
      description: "Your audit was not deleted. Please try again.",
    });
  }
}

type FormData = z.infer<typeof auditSchema>;

type formData = z.infer<typeof auditInviteSchema>;

type FormShareData = z.infer<typeof auditShareSchema>;

interface AuditOperationsProps {
  userId: string;
  audit: Audit;
  archive?: boolean;
  setAudits?: React.Dispatch<React.SetStateAction<Audits | []>>;
}

export function AuditOperations({
  userId,
  audit,
  archive,
  setAudits,
}: AuditOperationsProps) {
  const { dispatch } = useAudits();
  const { user, updateUser } = useAuth();

  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);

  const [isArchiveLoading, setIsArchiveLoading] =
    React.useState<boolean>(false);
  const [showArchiveAlert, setShowArchiveAlert] =
    React.useState<boolean>(false);

  const [isArchiveRestoreLoading, setIsArchiveRestoreLoading] =
    React.useState<boolean>(false);
  const [showArchiveRestoreAlert, setShowArchiveRestoreAlert] =
    React.useState<boolean>(false);

  const [inviteAlert, setInviteAlert] = React.useState<boolean>(false);
  const [isInviteLoading, setIsInviteLoading] = React.useState<boolean>(false);

  const [shareAlert, setShareAlert] = React.useState<boolean>(false);
  const [isShareLoading, setIsShareLoading] = React.useState<boolean>(false);

  const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] =
    React.useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      auditName: audit.name,
      auditType: audit.type,
      description: audit.description,
    },
  });

  const handleEditorSave = (data: any) => {
    setIsTyping(true);
    setTimeout(() => {
      if (!isTyping) {
        form.trigger("description");
      }
    }, 100);

    if (data.length > 0) {
      form.setValue("description", JSON.stringify(data));
    } else {
      form.setValue("description", JSON.stringify(undefined));
    }
  };

  async function onUpdateSubmit(data: FormData) {
    setIsUpdateLoading(true);
    try {
      const updatedAudit: Audit = {
        name: data.auditName,
        type: data.auditType,
        description: data.description,
        uid: audit.uid,
        authorId: audit.authorId,
        createdAt: audit.createdAt,
      };
      await setAudit(userId, updatedAudit);

      if (user?.role === "admin" && setAudits) {
        setAudits((audits) => {
          // Update the specific audit in the state
          return audits.map((audit) =>
            audit.uid === updatedAudit.uid ? updatedAudit : audit
          );
        });
      } else {
        dispatch({ type: AuditActionType.UPDATE_AUDIT, payload: updatedAudit });
      }
      form.reset();
      return toast.success("Audit updated.", {
        description: `Your audit was updated.`,
      });
    } catch (error) {
      // Handle the error, which could come from the setAudit
      return toast.error("Something went wrong.", {
        description: "Your audit was not updated. Please try again.",
      });
    } finally {
      setIsUpdateLoading(false);
      setShowUpdateDialog(false);
    }
  }

  const inviteForm = useForm<formData>({
    resolver: zodResolver(auditInviteSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onInviteSubmit(data: formData) {
    setIsInviteLoading(true);
    try {
      let inviteUser = await getUserByEmail(data.email);
      if (inviteUser) {
        if (audit.authorId === inviteUser.uid) {
          return toast.info("Audit owner ID and invited user ID are the same");
        } else {
          const exclusiveExists = (audit.exclusiveList || []).includes(
            inviteUser.uid
          );
          if (!exclusiveExists) {
            // Check if exclusiveList exists, if not, initialize it as an empty array
            const exclusiveList = audit.exclusiveList || [];

            const formattedAudit = {
              ...audit,
              exclusiveList: [...exclusiveList, inviteUser.uid],
            };
            const notificationData: Notification = {
              uid: uuidv4(),
              auditName: audit.name,
              type: "AUDIT_INVITED",
              ownerAuditUserId: audit.authorId,
              inviteUserId: inviteUser.uid,
              auditId: audit.uid,
              isSeen: false,
              createdAt: Timestamp.now(),
            };
            let isSuccess = await setNotificationData(
              inviteUser.uid,
              notificationData
            );
            if (isSuccess) {
              await setAudit(userId, formattedAudit);
              inviteUser.invitedAuditsList.push(audit.uid);
              await updateUserById(inviteUser.uid, inviteUser);
              dispatch({
                type: AuditActionType.UPDATE_AUDIT,
                payload: formattedAudit,
              });
              let requestBody = {
                inviterEmail: inviteUser.email,
                inviterFirstName: inviteUser.firstName,
                receiverEmail: inviteUser.email,
                receiverFirstName: inviteUser.firstName,
                auditLink: `${siteConfig.url}/evaluate/${audit.uid}`,
              };
              const response = await fetch("/api/mailer", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
              });
              if (response.ok) {
                const data = await response.json();
              } else {
                const error = await response.json();
                console.error("Error sending email:", error);
              }
              return toast.success("Audit invitation send.");
            }
          } else {
            return toast.success("User already invited to this audit");
          }
        }
      } else {
        return toast.error("User not found.");
      }
    } catch (error) {
      console.log(error);
      return toast.error("Something went wrong.", {
        description: "Your audit was not updated. Please try again.",
      });
    } finally {
      setIsInviteLoading(false);
      setInviteAlert(false);
      inviteForm.reset();
    }
  }

  const shareForm = useForm<FormShareData>({
    resolver: zodResolver(auditShareSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onShareSubmit(data: FormShareData) {
    setIsShareLoading(true);
    try {
      let shareUser = await getUserByEmail(data.email);
      if (shareUser) {
        if (audit.authorId === shareUser.uid) {
          return toast.info("Audit owner ID and share user ID are the same");
        } else {
          let requestBody = {
            inviterEmail: shareUser.email,
            inviterFirstName: shareUser.firstName,
            receiverEmail: shareUser.email,
            receiverFirstName: shareUser.firstName,
            auditLink: `${siteConfig.url}/evaluate/${audit.uid}`,
          };
          const responseData = await fetch("/api/mailer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });
          if (responseData.ok) {
            const data = await responseData.json();
          } else {
            const error = await responseData.json();
            console.error("Error sending email:", error);
          }
          return toast.success("Invitation email send with email address.");
        }
      } else {
        return toast.error("User not found.");
      }
    } catch (err) {
      return toast.error("Something went wrong.", {
        description: `Your audit was not updated. Please try again. ${err}`,
      });
    } finally {
      setIsShareLoading(false);
      setShareAlert(false);
      shareForm.reset();
    }
  }

  return (
    <>
      {archive ? (
        <Button
          variant="secondary"
          onClick={() => {
            setShowArchiveRestoreAlert(true);
          }}
        >
          <Icons.archiveRestore className="mr-2 h-4 w-4" />
          Restore
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
            <Icons.ellipsis className="h-4 w-4" />
            <span className="sr-only">Open</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {audit.type === "public" && (
              <>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center"
                  onClick={() => {
                    let shareURL = url + `/evaluate/${audit.uid}`;
                    navigator.clipboard.writeText(shareURL).then(
                      () => {
                        toast.success(`Audit url copied: ${shareURL}`);
                      },
                      (err) => {
                        console.error(err);
                      }
                    );
                  }}
                >
                  <Icons.copy className="mr-2 h-4 w-4" />
                  Copy Audit Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {audit.type === "exclusive" && (
              <>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center"
                  onClick={() => setInviteAlert(true)}
                >
                  <Icons.userPlus className="mr-2 h-4 w-4" />
                  Tag client
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {audit.type === "public" && (
              <>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center"
                  onClick={() => setShareAlert(true)}
                >
                  <Icons.userPlus className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {audit.type === "exclusive" && (
              <>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center"
                  onClick={() => router.push(`/${audit?.uid}`)}
                >
                  <Icons.users className="mr-2 h-4 w-4" />
                  Tag list
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              className="flex cursor-pointer items-center"
              onClick={() => router.push(`/preview/${audit.uid}`)}
            >
              <Icons.preview className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center"
              onClick={() => router.push(`/evaluate/${audit.uid}`)}
            >
              <Icons.evaluate className="mr-2 h-4 w-4" />
              Evaluate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center"
              onSelect={() => {
                setShowUpdateDialog(true);
                form.setValue("auditName", audit.name);
                form.setValue("auditType", audit.type);
              }}
            >
              <Icons.fileEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user?.role !== "admin" && (
              <>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                  onSelect={() => setShowArchiveAlert(true)}
                >
                  <Icons.archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              className="flex cursor-pointer items-center text-destructive focus:text-destructive"
              onSelect={() => setShowDeleteAlert(true)}
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AlertDialog
        open={showArchiveRestoreAlert}
        onOpenChange={setShowArchiveRestoreAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to Restore this audit?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action can be restore.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary"
              onClick={async (event) => {
                event.preventDefault();
                setIsArchiveRestoreLoading(true);
                const updatedAudit = {
                  ...audit,
                  status: "",
                };
                try {
                  await setAudit(userId, updatedAudit);
                  dispatch({
                    type: AuditActionType.UPDATE_AUDIT_RESTORE,
                    payload: updatedAudit,
                  });
                  return toast.info("Audit updated.");
                } catch (error) {
                  // Handle the error, which could come from the setAudit
                  return toast.error("Something went wrong.", {
                    description:
                      "Your audit was not updated. Please try again.",
                  });
                } finally {
                  setIsArchiveRestoreLoading(false);
                  setShowArchiveRestoreAlert(false);
                }
              }}
            >
              {isArchiveRestoreLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.archiveRestore className="mr-2 h-4 w-4" />
              )}
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this audit?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();
                setIsDeleteLoading(true);

                const deleted = await deleteAuditFromDB(userId, audit.uid);

                if (deleted) {
                  setIsDeleteLoading(false);
                  setShowDeleteAlert(false);

                  if (user?.role === "admin" && setAudits) {
                    // Assuming audits is a state variable in the parent component
                    setAudits((prevAudits) =>
                      prevAudits.filter((a) => a.uid !== audit.uid)
                    );
                  } else {
                    dispatch({
                      type: AuditActionType.DELETE_AUDIT,
                      payload: audit.uid,
                    });
                  }
                  user?.audits.splice(user?.audits.indexOf(audit.uid), 1);
                  updateUser(user);
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

      <AlertDialog open={showArchiveAlert} onOpenChange={setShowArchiveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to archive this audit?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();
                setIsArchiveLoading(true);

                const updatedAudit = {
                  ...audit,
                  status: "archive",
                };
                try {
                  await setAudit(userId, updatedAudit);
                  dispatch({
                    type: AuditActionType.UPDATE_AUDIT_ARCHIVE,
                    payload: updatedAudit,
                  });
                  return toast.info("Audit updated.");
                } catch (error) {
                  // Handle the error, which could come from the setAudit
                  return toast.error("Something went wrong.", {
                    description: "Failed to update audit. Please try again.",
                  });
                } finally {
                  setShowArchiveAlert(false);
                  setIsArchiveLoading(false);
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isArchiveLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Archive</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <SheetContent className="sm:max-w-[50vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Update audit</SheetTitle>
            <SheetDescription>
              Make changes to your audit here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onUpdateSubmit)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="auditName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          variant="ny"
                          placeholder="Audit Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="auditType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={audit.type}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an audit type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Only public type can be sharable with client. Private
                        type is only for consultant.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Editor
                          id="description"
                          onSave={handleEditorSave}
                          initialData={
                            audit?.description
                              ? JSON?.parse(audit?.description)
                              : ""
                          }
                          placeHolder="Let`s write description!"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SheetFooter>
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "default" }), {
                    "cursor-not-allowed opacity-60": isUpdateLoading,
                  })}
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.add className="mr-2 h-4 w-4" />
                  )}
                  Save changes
                </button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <Dialog open={inviteAlert} onOpenChange={setInviteAlert}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...inviteForm}>
            <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)}>
              <DialogHeader>
                <DialogTitle>Audit invite</DialogTitle>
                <DialogDescription>lorem ipsum</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          variant="ny"
                          placeholder="Please enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "default" }), {
                    "cursor-not-allowed opacity-60": isInviteLoading,
                  })}
                  disabled={isInviteLoading}
                >
                  {isInviteLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.filePlus className="mr-2 h-4 w-4" />
                  )}
                  Invite
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={shareAlert} onOpenChange={setShareAlert}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...shareForm}>
            <form onSubmit={shareForm.handleSubmit(onShareSubmit)}>
              <DialogHeader>
                <DialogTitle>Share audit</DialogTitle>
                <DialogDescription>lorem ipsum</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <FormField
                  control={shareForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          variant="ny"
                          placeholder="Please enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "default" }), {
                    "cursor-not-allowed opacity-60": isShareLoading,
                  })}
                  disabled={isShareLoading}
                >
                  {isShareLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.filePlus className="mr-2 h-4 w-4" />
                  )}
                  Share
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
