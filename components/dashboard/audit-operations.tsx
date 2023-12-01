"use client";

import * as React from "react";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { deleteAudit } from "@/lib/firestore/audit";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Icons } from "@/components/icons";
import { setAudit } from "@/lib/firestore/audit";
import { useAuth } from "@/components/auth/auth-provider";
import useAudits from "./AuditsContext";
import { auditInviteSchema, auditSchema } from "@/lib/validations/audit";
import { Audit, AuditActionType, User } from "@/types/dto";
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
import { getUserByEmail } from "@/lib/firestore/user";

async function deleteAuditFromDB(userId: string, auditId: string) {
    try {
        await deleteAudit(userId, auditId);
        toast({
            title: 'Audit deleted successfully!',
            variant: 'success'
        })
        return true;
    } catch (error) {
        toast({
            title: "Something went wrong.",
            description: "Your audit was not deleted. Please try again.",
            variant: "destructive",
        });
    }
}

type FormData = z.infer<typeof auditSchema>;

type formData = z.infer<typeof auditInviteSchema>

interface AuditOperationsProps {
    userId: string;
    audit: Audit;
}

export function AuditOperations({userId, audit}: AuditOperationsProps) {
    const {dispatch} = useAudits();
    const {user, updateUser} = useAuth();
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
    const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);

    const [inviteAlert, setInviteAlert] = React.useState<boolean>(false);
    const [isInviteLoading, setIsInviteLoading] = React.useState<boolean>(false);

    const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false);
    const [showUpdateDialog, setShowUpdateDialog] =
        React.useState<boolean>(false);
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(auditSchema),
        defaultValues: {
            auditName: audit.name,
            auditType: audit.type,
        },
    });

    async function onUpdateSubmit(data: FormData) {
        setIsUpdateLoading(true);
        try {
            const updatedAudit: Audit = {
                name: data.auditName,
                type: data.auditType,
                uid: audit.uid,
                authorId: audit.authorId,
                createdAt: audit.createdAt,
            };

            await setAudit(userId, updatedAudit);
            dispatch({type: AuditActionType.UPDATE_AUDIT, payload: updatedAudit});
            form.reset();

            return toast({
                title: "Audit updated successfully.",
                description: `Your audit was updated.`,
                variant: "success"
            });
        } catch (error) {
            // Handle the error, which could come from the setAudit
            return toast({
                title: "Something went wrong.",
                description: "Your audit was not updated. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUpdateLoading(false);
            setShowUpdateDialog(false);
        }
    }

    const inviteForm = useForm<formData>({
        resolver: zodResolver(auditInviteSchema),
        defaultValues: {
            email: ''
        }
    })

    async function onInviteSubmit(data: formData) {
        setIsInviteLoading(true)
        try {
            let user = await getUserByEmail(data.email)
            if (user) {
                const exclusiveExists = (audit.exclusiveList || []).includes(user.uid);
                if (!exclusiveExists) {
                    // Check if exclusiveList exists, if not, initialize it as an empty array
                    const exclusiveList = audit.exclusiveList || [];

                    const formattedAudit = {
                        ...audit,
                        exclusiveList: [...exclusiveList, user.uid]
                    };
                    await setAudit(userId, formattedAudit);
                    dispatch({type: AuditActionType.UPDATE_AUDIT, payload: formattedAudit});

                    return toast({
                        title: "Audit invited successfully.",
                        description: `Your audit was updated.`,
                        variant: "success"
                    });
                } else {
                    return toast({
                        title: "Already audit invited.",
                        variant: "success"
                    });
                }

            } else {
                console.log('User not found');
                return toast({
                    title: "User not found.",
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
            setIsInviteLoading(false)
            setInviteAlert(false)
            inviteForm.reset();
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
                    {audit.type === "public" && (
                        <>
                            <DropdownMenuItem className="flex cursor-pointer items-center">
                                <Icons.copy className="mr-2 h-4 w-4"/>
                                Share Audit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                        </>
                    )}
                    {audit.type === "exclusive" && (
                        <>
                            <DropdownMenuItem
                                className="flex cursor-pointer items-center"
                                onClick={() => setInviteAlert(true)}
                            >
                                <Icons.userPlus className="mr-2 h-4 w-4"/>
                                Invite
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                        </>
                    )}
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center"
                        onClick={() => router.push(`/preview/${audit.uid}`)}
                    >
                        <Icons.preview className="mr-2 h-4 w-4"/>
                        Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center"
                        onClick={() => router.push(`/evaluate/${audit.uid}`)}
                    >
                        <Icons.evaluate className="mr-2 h-4 w-4"/>
                        Evaluate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center"
                        onSelect={() => setShowUpdateDialog(true)}
                    >
                        <Icons.fileEdit className="mr-2 h-4 w-4"/>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        <Icons.trash className="mr-2 h-4 w-4"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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

                                    dispatch({
                                        type: AuditActionType.DELETE_AUDIT,
                                        payload: audit.uid,
                                    });
                                    user?.audits.splice(user?.audits.indexOf(audit.uid), 1);
                                    updateUser(user);
                                }
                            }}
                            className="bg-red-600 focus:ring-red-600"
                        >
                            {isDeleteLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4"/>
                            )}
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onUpdateSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Update audit</DialogTitle>
                                <DialogDescription>
                                    Make changes to your audit here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="auditName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input variant="ny" placeholder="Audit Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="auditType"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={audit.type}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an audit type"/>
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
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <button
                                    type="submit"
                                    // onClick={onClick}
                                    className={cn(buttonVariants({variant: "default"}), {
                                        "cursor-not-allowed opacity-60": isUpdateLoading,
                                    })}
                                    disabled={isUpdateLoading}
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
            <Dialog open={inviteAlert} onOpenChange={setInviteAlert}>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...inviteForm}>
                        <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Audit invite</DialogTitle>
                                <DialogDescription>
                                    lorem ipsum
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={inviteForm.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input variant="ny" placeholder="Please enter email" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <button
                                    type="submit"
                                    className={cn(buttonVariants({variant: "default"}), {
                                        "cursor-not-allowed opacity-60": isInviteLoading,
                                    })}
                                    disabled={isInviteLoading}
                                >
                                    {isInviteLoading ? (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        <Icons.filePlus className="mr-2 h-4 w-4"/>
                                    )}
                                    Invite
                                </button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
