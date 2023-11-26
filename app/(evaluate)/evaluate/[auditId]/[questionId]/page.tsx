"use client";
import { DocsPageHeader } from "@/app/(evaluate)/preview/page-header";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { evaluationQuestionListSchema } from "@/lib/validations/question";
import * as z from "zod";
import { EvaluatePager, getPagerForQuestions, } from "@/app/(evaluate)/evaluate/[auditId]/[questionId]/pager";
import { useAuth } from "@/components/auth/auth-provider";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { Choice, EvaluationActionType } from "@/types/dto";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { setEvaluation } from "@/lib/firestore/evaluation";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editorjs/editor"),
    {
        ssr: false
    }
)
type FormData = z.infer<typeof evaluationQuestionListSchema>;

export default function EvaluateQuestionPage({
                                                 params,
                                             }: {
    params: { auditId: string; questionId: string };
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {evaluation, dispatch} = useEvaluation();
    const {user} = useAuth();
    const router = useRouter();
    const {questionId, auditId} = params;
    const question = evaluation?.questions?.find(
        (question) => question.uid === questionId
    );

    const pager = getPagerForQuestions(questionId, evaluation);

    let formDefaultValues = {
        answerId: evaluation?.evaluate?.choices?.find(choice => choice.questionId === questionId)?.answerId || undefined,
        additionalNote: evaluation?.evaluate?.choices?.find(choice => choice.questionId === questionId)?.additionalNote || "",
        recommendedNote: evaluation?.evaluate?.choices?.find(choice => choice.questionId === questionId)?.recommendedNote || "",
        internalNote: evaluation?.evaluate?.choices?.find(choice => choice.questionId === questionId)?.internalNote || "",
    }
    const handleEditorRecommendedNote = (data: any) => {
        if (data.length > 0) {
            form.setValue('recommendedNote', JSON.stringify(data));
        }
    };

    const form = useForm<FormData>({
        resolver: zodResolver(evaluationQuestionListSchema),
        defaultValues: formDefaultValues
    });

    async function onSubmit(data: FormData) {
        let newEvaluate: Choice;
        if (user) {
            newEvaluate = {
                questionId: questionId,
                answerId: data.answerId,
                additionalNote: data.additionalNote || "",
                recommendedNote: data.recommendedNote || "",
                internalNote: data.internalNote || "",
            };
        } else {
            newEvaluate = {
                questionId: questionId,
                answerId: data.answerId,
                additionalNote: data.additionalNote || "",
            };
        }

        // setIsLoading(true);
        // Move to the next page if an answer is selected

        const hasAnswerSelected = data.answerId !== undefined; // Check if an answer is selected
        if (hasAnswerSelected) {
            console.log(hasAnswerSelected)
            dispatch({type: EvaluationActionType.ADD_QUESTION_ANSWER, payload: newEvaluate})
            if (pager.next && !pager.next.disabled) {
                await router.push(pager.next.href);
            } else {
                setIsLoading(true)
                await setEvaluation(auditId, evaluation.evaluate)
                await router.push(`/evaluate/${auditId}/completed`)
                toast({
                    title: "Evaluation Completed!",
                    variant: "success",
                });
            }
            setIsLoading(false)
        }
    }

    const handleNextClick = () => {
        // Trigger form submission logic
        form.handleSubmit(onSubmit)();
    };

    if (Object.entries(evaluation.evaluate).length === 0) {
        router.push(`/evaluate/${auditId}`)
    }

    return (
        <div className="py-6 lg:py-10">
            <DocsPageHeader
                heading={question?.name ?? "Question not found"}
                text="Please choose from the following answers:"
            />
            {question?.answers?.length ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="answerId"
                            render={({field}) => (
                                <FormItem className="space-y-1">
                                    {/* TODO: when evaluate happens, then this should be populated
                                        a defaultValue={already - answered - value} if answer already seated */}
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                                        >
                                            {question.answers.map((answer, index) => (
                                                <FormItem
                                                    key={answer.uid}
                                                    className={`cursor-pointer rounded-lg border p-3 shadow-sm focus:outline-none grid grid-cols-12 space-x-3 space-y-0 w-full ${
                                                        form.getValues("answerId") === answer.uid
                                                            ? "border-indigo-600 ring-2 ring-indigo-600"
                                                            : "border-gray-300"
                                                    }`}
                                                >
                                                    <FormControl style={{display: "none"}}>
                                                        <RadioGroupItem value={answer.uid}/>
                                                    </FormControl>
                                                    <FormLabel
                                                        className="font-normal block text-sm cursor-pointer col-span-11">
                                                        {index + 1 + ". "}
                                                        {answer.name}
                                                    </FormLabel>

                                                    {/* Custom check icon */}
                                                    {form.getValues("answerId") === answer.uid && (
                                                        <div className="text-green-500 col-span-1 flex justify-end">
                                                            {/* Replace the content below with your custom check icon */}
                                                            <Icons.checkCircle2 size={20}/>
                                                        </div>
                                                    )}
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>

                                    {form.formState.errors.answerId && (
                                        <p className="text-red-500">
                                            {form.formState.errors.answerId.message}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="additionalNote"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Additional Note</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            variant="ny"
                                            placeholder="Share your thoughts and additional details..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {user?.role === "consultant" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="recommendedNote"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Recommended Note</FormLabel>
                                            <FormControl>
                                                <Editor
                                                    onSave={handleEditorRecommendedNote}
                                                    initialData={
                                                        formDefaultValues.recommendedNote !== "" ?
                                                            JSON.parse(formDefaultValues.recommendedNote) : ''
                                                    }
                                                    id="recommendedNote"
                                                    placeHolder="Provide your recommended insights and suggestions..."
                                                />
                                                {/*<Textarea*/}
                                                {/*    variant="ny"*/}
                                                {/*    placeholder="Provide your recommended insights and suggestions..."*/}
                                                {/*    className="resize-none"*/}
                                                {/*    {...field}*/}
                                                {/*/>*/}
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="internalNote"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Internal Note</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    variant="ny"
                                                    placeholder="Add internal notes or confidential information..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <EvaluatePager
                            handleNextClick={handleNextClick}
                            isLoading={isLoading}
                            currentQuestion={questionId}
                        />
                    </form>
                </Form>
            ) : (
                <p>Answers not found.</p>
            )}
        </div>
    );
}
