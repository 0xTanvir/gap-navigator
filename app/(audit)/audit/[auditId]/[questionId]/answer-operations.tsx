import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { deleteAnswerById, updateQuestionAnswerById } from "@/lib/firestore/answer";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { answerSchema } from "@/lib/validations/question";
import * as z from "zod";
import { Answer } from "@/types/dto";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editorjs/editor"),
    {
        ssr: false
    }
)

type FormData = z.infer<typeof answerSchema>

interface AnswerOperationProps {
    auditId: string
    questionId: string
    answerId: string
    answer: Answer
    singleQuestionFetch: Function
}

async function deleteAuditFromDB(auditId: string, questionId: string, answerId: string) {
    try {
        await deleteAnswerById(auditId, questionId, answerId)
        return toast({
            title: "Answer deleted successfully!",
            description: "Your answer was deleted.",
            variant: "success",
        })
    } catch (error) {
        toast({
            title: "Something went wrong.",
            description: "Your answer was not deleted. Please try again.",
            variant: "destructive",
        })
    }
}

const AnswerOperations = ({auditId, questionId, answerId, singleQuestionFetch, answer}: AnswerOperationProps) => {
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)
    const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false)
    const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
    const [showUpdateDialog, setShowUpdateDialog] = React.useState<boolean>(false)

    const [isTyping, setIsTyping] = useState<boolean>(false);
    const handleEditorSave = (data: any) => {
        setIsTyping(true);
        setTimeout(() => {
            if (!isTyping) {
                form.trigger('recommendationDocument');
            }
        }, 100);

        if (data.length > 0) {
            form.setValue('recommendationDocument', JSON.stringify(data));
        } else {
            form.setValue('recommendationDocument', JSON.stringify(undefined));
        }
    };

    const form = useForm<FormData>({
        resolver: zodResolver(answerSchema),
        defaultValues: {
            name: answer.name,
            recommendationDocument: answer.recommendationDocument
        },
    })

    async function onUpdateSubmit(data: FormData) {
        setIsUpdateLoading(true)
        const updateAnswer = {
            uid: answer.uid,
            name: data.name,
            recommendationDocument: data.recommendationDocument,
            createdAt: answer.createdAt
        }
        try {
            const response = await updateQuestionAnswerById(auditId, questionId, answerId, updateAnswer)
            if (response) {
                toast({
                    title: "Answer updated successfully!",
                    description: `Your answer was updated ${answerId}`,
                    variant: "success",
                });
            } else {
                toast({
                    title: "Answer not found in the DB.",
                    description: `Your answer was updated ${answerId}`,
                    variant: "default",
                });
            }
            setIsUpdateLoading(false)
            setShowUpdateDialog(false)
            singleQuestionFetch()
        } catch (error) {
            setIsUpdateLoading(false)
            toast({
                title: "Answer document not found.",
                description: `Your answer was updated ${answerId}`,
                variant: "destructive",
            });
        }

        return true
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
                                event.preventDefault()
                                setIsDeleteLoading(true)

                                const deleted = await deleteAuditFromDB(auditId, questionId, answerId)
                                singleQuestionFetch()

                                if (deleted) {
                                    setIsDeleteLoading(false)
                                    setShowDeleteAlert(false)
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
                <DialogContent className="sm:max-w-lg">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onUpdateSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Update Answer</DialogTitle>
                                <DialogDescription>
                                    Make changes to your question answer here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    variant="ny"
                                                    placeholder="Answer Name" {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="recommendationDocument"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Recommendation Document</FormLabel>
                                            <FormControl>
                                                <Editor
                                                    onSave={handleEditorSave}
                                                    initialData={JSON.parse(answer.recommendationDocument)}
                                                    placeHolder="Let`s write recommendation document!"
                                                />
                                                {/*<Textarea*/}
                                                {/*    variant="ny"*/}
                                                {/*    placeholder="Recommendation Document"*/}
                                                {/*    {...field}*/}
                                                {/*/>*/}
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <button
                                    type="submit"
                                    className={cn(
                                        buttonVariants({variant: "default"}),
                                        {
                                            "cursor-not-allowed opacity-60": isUpdateLoading,
                                        }
                                    )}
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
        </>

    );
};

export default AnswerOperations;