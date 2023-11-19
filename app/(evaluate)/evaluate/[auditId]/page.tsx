"use client"
import React, {useState} from 'react';
import {DocsPageHeader} from "@/app/(evaluate)/preview/page-header";
import {EmptyPlaceholder} from "@/components/dashboard/empty-placeholder";
import Image from "next/image";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import {Skeleton} from "@/components/ui/skeleton";
import {useAuth} from "@/components/auth/auth-provider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {evaluateParticipant} from "@/lib/validations/question";
import * as z from "zod";
import {setEvaluation, unAuthenticatedUserData} from "@/lib/firestore/audit";
import {Evaluate, EvaluationActionType} from "@/types/dto";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";

type FormData = z.infer<typeof evaluateParticipant>

export default function EvaluatePage({params}: { params: { auditId: string } }) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const {evaluation, dispatch} = useEvaluation()
    const {user, loading, isAuthenticated} = useAuth()
    const router = useRouter();
    const {auditId} = params

    const form = useForm<FormData>({
        resolver: zodResolver(evaluateParticipant),
        defaultValues: {
            participantFirstName: '',
            participantLastName: '',
            participantEmail: '',
        }
    })


    async function onSubmit(data: FormData) {
        setIsLoading(true)
        let newData: Evaluate = {
            uid: data.participantEmail,
            ...data
        }
        let uid: string | null = await unAuthenticatedUserData(auditId, newData)
        console.log(uid)
        if (uid) {
            console.log("upcoming update function")
            if (evaluation.questions.length > 0) {
                const questionUid = evaluation?.questions[0]?.uid;
                const url = `/evaluate/${auditId}/${questionUid}`
                router.push(url)
            }
        } else {
            try {
                await setEvaluation(auditId, newData)
                dispatch({type: EvaluationActionType.ADD_EVALUATE, payload: newData})
                toast({
                    title: "Evaluation created successfully.",
                    description: `Your evaluation was created with id ${newData.uid}.`,
                })
                form.reset()
                setIsLoading(false)
                setShowDialog(false)
                if (evaluation.questions.length > 0) {
                    router.push(`/evaluate/${params.auditId}/${evaluation.questions[0]?.uid}`)
                }
            } catch (error) {
                console.log(error)
                setIsLoading(false)
                toast({
                    title: "Something went wrong.",
                    description: "Your evaluation was not created. Please try again.",
                    variant: "destructive",
                })
            }
        }
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
                    {evaluation.questions.length >= 2 ? ' Questions' : ' Question'}
                </EmptyPlaceholder.Title>
                {
                    isAuthenticated && user ?

                        <Button size="xl" className="mt-8 text-sm font-semibold rounded-full" asChild>
                            {evaluation.questions.length > 0 && (
                                <Link className="flex-none"
                                      href={`/evaluate/${params.auditId}/${evaluation.questions[0]?.uid}`}>
                                    Lets Get Started
                                </Link>)
                            }
                        </Button>
                        :
                        <Button
                            size="xl"
                            className="mt-8 text-sm font-semibold rounded-full"
                            onClick={() => setShowDialog(true)}
                        >
                            Lets Get Started
                        </Button>
                }
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
                                                <Input type="text" variant="ny"
                                                       placeholder="Participant First Name" {...field} />
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
                                                <Input type='text' variant="ny"
                                                       placeholder="Participant Last Name" {...field} />
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
                                                <Input type="email" variant="ny"
                                                       placeholder="Participant Email" {...field} />
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
                                            "cursor-not-allowed opacity-60": isLoading,
                                        },
                                    )}
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
};

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
            <Button disabled={true} size="xl" className="mt-8 text-sm font-semibold rounded-full">
                Lets Get Started
            </Button>
        </EmptyPlaceholder>
    )
}