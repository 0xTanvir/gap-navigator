import React from 'react';
import {Icons} from "@/components/icons";
import {Button, ButtonProps, buttonVariants} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {v4 as uuidv4} from 'uuid'
import {answerSchema} from "@/lib/validations/question";
import {zodResolver} from "@hookform/resolvers/zod";
import {Timestamp} from "firebase/firestore";
import {toast} from "@/components/ui/use-toast";
import {Textarea} from "@/components/ui/textarea";
import { setQuestionAnswer } from "@/lib/firestore/answer";

interface AnswerCreateButtonProps extends ButtonProps {
    auditId: string
    questionId: string
    loading?: boolean
    singleQuestionFetch: Function
}

type FormData = z.infer<typeof answerSchema>

const AnswerCreateButton = ({
                                auditId,
                                questionId,
                                singleQuestionFetch,
                                loading,
                                className,
                                variant,
                                ...props
                            }: AnswerCreateButtonProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [showAddDialog, setShowAddDialog] = React.useState<boolean>(false)

    const form = useForm<FormData>({
        resolver: zodResolver(answerSchema),
        defaultValues: {
            name: '',
            recommendationDocument: ''
        },
    })

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        const newAnswer = {
            uid: uuidv4(),
            name: data.name,
            recommendationDocument: data.recommendationDocument,
            createdAt: Timestamp.now()
        }
        try {
            await setQuestionAnswer(auditId, questionId, newAnswer)
            form.reset()
            setIsLoading(false)
            setShowAddDialog(false)
            singleQuestionFetch()
            return toast({
                title: "Answer created successfully.",
                description: `Your answer was created with id ${newAnswer.uid}.`,
                variant: "success"
            })
        } catch (error) {
            setIsLoading(false)
            toast({
                title: "Error created answer.",
                variant: "destructive"
            })
            console.error('Error adding answer:', error);
        }
    }

    return (
        <>
            <Button
                disabled={loading}
                variant={variant}
                onClick={() => setShowAddDialog(true)}
            >
                <Icons.filePlus className="mr-2 h-4 w-4"/>
                New Answer
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Add Answer</DialogTitle>
                                <DialogDescription>
                                    Type answer name and recommendation document.
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
                                                <Input variant="ny" placeholder="Answer Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="recommendationDocument"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Recommendation Document</FormLabel>
                                            <FormControl>
                                                <Textarea variant="ny"
                                                          placeholder="Recommendation Document" {...field} />
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
                                        className
                                    )}
                                    disabled={isLoading}
                                    {...props}
                                >
                                    {isLoading ? (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        <Icons.add className="mr-2 h-4 w-4"/>
                                    )}
                                    Add Answer
                                </button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

        </>
    );
};

export default AnswerCreateButton;