import {Icons} from "@/components/icons";
import {Button, ButtonProps, buttonVariants} from "@/components/ui/button";
import {v4 as uuidv4} from 'uuid'
import {Timestamp} from "firebase/firestore";
import {Question, QuestionActionType} from "@/types/dto";
import {toast} from "@/components/ui/use-toast";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import {cn} from "@/lib/utils";
import React from "react";
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
import {questionSchema} from "@/lib/validations/question";
import {Input} from "@/components/ui/input";
import * as z from "zod";
import { setQuestion } from "@/lib/firestore/question";

interface QuestionCreateButtonProps extends ButtonProps {
    auditId: string
    noQuestion?: boolean
}

type FormData = z.infer<typeof questionSchema>

interface QuestionCreateButtonProps extends ButtonProps {

}

export function QuestionCreateButton({auditId, noQuestion, variant, className, ...props}: QuestionCreateButtonProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [showAddDialog, setShowAddDialog] = React.useState<boolean>(false)
    const {dispatch} = useQuestions()

    const form = useForm<FormData>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            question_name: ''
        },
    })

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        const newQuestion: Question = {
            uid: uuidv4(),
            name: data.question_name,
            answers: [],
            createdAt: Timestamp.now(),
        }
        try {
            await setQuestion(auditId, newQuestion)
            dispatch({type: QuestionActionType.ADD_QUESTION, payload: newQuestion})
            toast({
                title: "Question created successfully.",
                description: `Your question was created with id ${newQuestion.uid}.`,
                variant: "success"
            })
            form.reset()
            setIsLoading(false)
            setShowAddDialog(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            return toast({
                title: "Something went wrong.",
                description: "Your question was not created. Please try again.",
                variant: "destructive",
            })
        }

    }

    return (
        <>
            <Button
                variant={variant}
                onClick={() => setShowAddDialog(true)}
            >
                <Icons.filePlus className="mr-2 h-4 w-4"/>
                Add Question
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Add Question</DialogTitle>
                                <DialogDescription>
                                    Type Question name.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="question_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input variant="ny" placeholder="Question Name" {...field} />
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
                                        <Icons.filePlus className="mr-2 h-4 w-4"/>
                                    )}
                                    Add Question
                                </button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}