"use client";
import React, { useState } from "react";
import { DocsPageHeader } from "@/app/(evaluate)/preview/page-header";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth/auth-provider";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { evaluateParticipant } from "@/lib/validations/question";
import * as z from "zod";

import { Evaluate, EvaluationActionType } from "@/types/dto";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { getEvaluationById, setEvaluation } from "@/lib/firestore/evaluation";

type FormData = z.infer<typeof evaluateParticipant>;

export default function EvaluatePage({
                                         params,
                                     }: {
    params: { auditId: string };
}) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const {evaluation, dispatch} = useEvaluation();
    const {user, loading, isAuthenticated} = useAuth();
    const router = useRouter();
    const {auditId} = params;

    const form = useForm<FormData>({
        resolver: zodResolver(evaluateParticipant),
        defaultValues: {
            participantFirstName: "",
            participantLastName: "",
            participantEmail: "",
        },
    });

    async function onSubmit(data: FormData) {
        // setIsLoading(true);
        let evaluate = {
            uid: data.participantEmail,
            participantFirstName: data.participantFirstName,
            participantLastName: data.participantLastName,
            participantEmail: data.participantEmail,
        };
        const emailExists = evaluation.evaluations.some(item => item.participantEmail === data.participantEmail);

        if (emailExists) {
            toast({
                title: "This email already evaluation created.",
                variant: "error"
            });
        } else {
            dispatch({
                type: EvaluationActionType.ADD_EVALUATE,
                payload: evaluate,
            });
            form.reset();
            setShowDialog(false);
            if (evaluation.questions.length > 0) {
                router.push(
                    `/evaluate/${params.auditId}/${evaluation.questions[0]?.uid}`
                );
            }
        }

        // try {
        //     // First fetch evaluation from firestore
        //     // if evaluation exist then populate it to state
        //     // else create new evaluation at firestore and populate it to state
        //     let evaluate = await getEvaluationById(auditId, data.participantEmail);
        //     if (evaluate) {
        //         // Save it to state and redirect to first question
        //         dispatch({
        //             type: EvaluationActionType.ADD_EVALUATE,
        //             payload: evaluate,
        //         });
        //         form.reset();
        //         setShowDialog(false);
        //         if (evaluation.questions.length > 0) {
        //             router.push(
        //                 `/evaluate/${params.auditId}/${evaluation.evaluate?.runningStatus}`
        //             );
        //         }
        //     } else {
        //         // Create new evaluation and save it to state and redirect to first question
        //         evaluate = {
        //             uid: data.participantEmail,
        //             participantFirstName: data.participantFirstName,
        //             participantLastName: data.participantLastName,
        //             participantEmail: data.participantEmail,
        //             // runningStatus: evaluation?.questions[0]?.uid,
        //         };
        //
        //         await setEvaluation(auditId, evaluate);
        //         dispatch({
        //             type: EvaluationActionType.ADD_EVALUATE,
        //             payload: evaluate,
        //         });
        //         toast({
        //             title: "Evaluation created successfully.",
        //             description: `Your evaluation was created with id ${evaluate.uid}.`,
        //         });
        //         form.reset();
        //         setShowDialog(false);
        //         if (evaluation.questions.length > 0) {
        //             router.push(
        //                 `/evaluate/${params.auditId}/${evaluation.questions[0]?.uid}`
        //             );
        //         }
        //     }
        // } catch (error) {
        //     toast({
        //         title: "Something went wrong.",
        //         description: "Your evaluation was not created. Please try again.",
        //         variant: "destructive",
        //     });
        // } finally {
        //     setIsLoading(false);
        // }
    }

    return (
        <div className="py-6 lg:py-10">
            <DocsPageHeader
                heading={evaluation.name}
                text={"Complete this audit to generate your report."}
            />
            <EmptyPlaceholder>
                <Image
                    src="/images/audit-start.svg"
                    alt="audit start image"
                    width={480}
                    height={270}
                    className="rounded-md transition-colors"
                />
                <EmptyPlaceholder.Title>
                    Total {evaluation.questions.length}
                    {evaluation.questions.length >= 2 ? " Questions" : " Question"}
                </EmptyPlaceholder.Title>
                {user && user.role == "client" ? (
                    <Button
                        size="xl"
                        className="mt-8 text-sm font-semibold rounded-full"
                        asChild
                    >
                        {evaluation.questions.length > 0 && (
                            <Link
                                className="flex-none"
                                href={`/evaluate/${params.auditId}/${evaluation.questions[0]?.uid}`}
                            >
                                Lets Get Started
                            </Link>
                        )}
                    </Button>
                ) : (
                    <Button
                        size="xl"
                        className="mt-8 text-sm font-semibold rounded-full"
                        onClick={() => setShowDialog(true)}
                    >
                        Lets Get Started
                    </Button>
                )}
            </EmptyPlaceholder>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Add Information</DialogTitle>
                                <DialogDescription>
                                    Type Participant First Name, Last Name and Email.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="participantFirstName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    variant="ny"
                                                    placeholder="Participant First Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="participantLastName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    variant="ny"
                                                    placeholder="Participant Last Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="participantEmail"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    variant="ny"
                                                    placeholder="Participant Email"
                                                    {...field}
                                                />
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
                                        "cursor-not-allowed opacity-60": isLoading,
                                    })}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        <Icons.filePlus className="mr-2 h-4 w-4"/>
                                    )}
                                    Save
                                </button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

EvaluatePage.Skeleton = function EvaluatePageSkeleton() {
    return (
        <EmptyPlaceholder className="mt-4">
            <Image
                src="/images/audit-start.svg"
                alt="audit start image"
                width={480}
                height={270}
                className="rounded-md transition-colors"
            />
            <div className="mt-6 text-xl font-semibold flex">
                Total <Skeleton className="w-28 ml-2"/>
            </div>
            <Button
                disabled={true}
                size="xl"
                className="mt-8 text-sm font-semibold rounded-full"
            >
                Lets Get Started
            </Button>
        </EmptyPlaceholder>
    );
};
