import React, { useState } from 'react';
import { Icons } from "@/components/icons";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid'
import { answerSchema } from "@/lib/validations/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { setQuestionAnswer } from "@/lib/firestore/answer";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editorjs/editor"),
    {
        ssr: false
    }
)

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

    const [isTyping, setIsTyping] = useState<boolean>(false);
    const handleEditorSave = (data: any) => {
        setIsTyping(true);
        setTimeout(() => {
            if (!isTyping) {
                form.trigger('recommendationDocument');
            }
        }, 1);

        if (data.length > 0) {
            form.setValue('recommendationDocument', JSON.stringify(data));
        } else {
            form.setValue('recommendationDocument', JSON.stringify(undefined));
        }
    };

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

            <Sheet open={showAddDialog} onOpenChange={setShowAddDialog}>
                <SheetContent className="sm:max-w-[50vw] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Add Answer</SheetTitle>
                        <SheetDescription>
                            Type answer name and recommendation document.
                        </SheetDescription>
                    </SheetHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                                <Editor onSave={handleEditorSave}
                                                        placeHolder="Let`s write recommendation document!"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <SheetFooter>
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
                                        <Icons.filePlus className="mr-2 h-4 w-4"/>
                                    )}
                                    Add Answer
                                </button>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>

        </>
    );
};

export default AnswerCreateButton;