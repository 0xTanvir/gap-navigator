"use client";
import { DocsPageHeader } from "@/app/(evaluate)/preview/page-header";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { evaluationQuestionListSchema } from "@/lib/validations/question";
import * as z from "zod";
import {
    EvaluatePager,
    getPagerForQuestions,
} from "@/app/(evaluate)/evaluate/[auditId]/[questionId]/pager";
import { useAuth } from "@/components/auth/auth-provider";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { Choice, Evaluate, EvaluationActionType } from "@/types/dto";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { setEvaluation, updateEvaluation, updateEvaluationById } from "@/lib/firestore/evaluation";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editorjs/editor"), {
    ssr: false,
});
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

    // console.log(evaluation)

    const pager = getPagerForQuestions(questionId, evaluation);

    let formDefaultValues = {
        answerId:
            evaluation?.evaluate?.choices?.find(
                (choice) => choice.questionId === questionId
            )?.answerId || undefined,
        additionalNote:
            evaluation?.evaluate?.choices?.find(
                (choice) => choice.questionId === questionId
            )?.additionalNote || "",
        recommendedNote:
            evaluation?.evaluate?.choices?.find(
                (choice) => choice.questionId === questionId
            )?.recommendedNote || "",
        internalNote:
            evaluation?.evaluate?.choices?.find(
                (choice) => choice.questionId === questionId
            )?.internalNote || "",
    };
    const handleEditorRecommendedNote = (data: any) => {
        if (data.length > 0) {
            form.setValue("recommendedNote", JSON.stringify(data));
        }
    };

    const form = useForm<FormData>({
        resolver: zodResolver(evaluationQuestionListSchema),
        defaultValues: formDefaultValues,
    });

    async function onSubmit(data: FormData) {
        setIsLoading(true);
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

        // Move to the next page if an answer is selected
        const hasAnswerSelected = data.answerId !== undefined; // Check if an answer is selected
        if (hasAnswerSelected) {
            dispatch({
                type: EvaluationActionType.ADD_QUESTION_ANSWER,
                payload: newEvaluate,
            });
            await updateEvaluation(auditId, evaluation.evaluate.uid, evaluation.evaluate.choices as Choice[]);
            if (pager.next && !pager.next.disabled) {
                let nextQuestion = question?.answers?.find(
                    (answer) => answer?.uid === data?.answerId
                );
                let index = evaluation.evaluate.choices?.findIndex(
                    (choice) => choice.answerId === nextQuestion?.uid
                );
                if (nextQuestion?.questionId) {
                    if (index !== -1) {
                        if (
                            pager.next.href !==
                            `/evaluate/${auditId}/${nextQuestion?.questionId}`
                        ) {
                            router.push(
                                `/evaluate/${auditId}/${nextQuestion?.questionId}`
                            );
                            let urlParts = pager.next.href.split("/");
                            dispatch({
                                type: EvaluationActionType.REMOVE_QUESTION_ANSWER,
                                payload: urlParts[urlParts.length - 1],
                            });
                        }
                    }
                    router.push(`/evaluate/${auditId}/${nextQuestion?.questionId}`);
                } else {
                    router.push(pager.next.href);
                }
            } else {
                const dbFoundObject = evaluation.evaluations.find(
                    (item) => item.uid === evaluation.evaluate.uid
                );
                let result = dbFoundObject
                    ? areObjectsEqual(dbFoundObject, evaluation.evaluate)
                    : false;
                if (result) {
                    await router.push(`/evaluate/${auditId}/completed`);
                } else {
                    // await setEvaluation(auditId, evaluation.evaluate);
                    await router.push(`/evaluate/${auditId}/completed`);
                }
                toast.success("Evaluation Completed!");
            }
            setIsLoading(false);
        }
    }

    const handleNextClick = () => {
        // Trigger form submission logic
        form.handleSubmit(onSubmit)();
    };

    useEffect(() => {
        if (Object.entries(evaluation.evaluate).length === 0) {
            router.push(`/evaluate/${auditId}`);
        }
    }, [evaluation, auditId, router]);

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
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        className="mt-4 grid grid-cols-1 gap-y-6 sm:gap-x-4"
                                    >
                                        {question.answers.map((answer, index) => (
                                            <FormItem
                                                key={answer.uid}
                                                className={`rounded-lg border shadow-sm focus:outline-none grid grid-cols-12 space-x-0 space-y-0 w-full ${
                                                    form.getValues("answerId") === answer.uid
                                                        ? "border-indigo-600 ring-2 ring-indigo-600"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                <FormControl style={{display: "none"}}>
                                                    <RadioGroupItem value={answer.uid}/>
                                                </FormControl>
                                                <FormLabel
                                                    className="font-normal block text-sm cursor-pointer col-span-11 py-2.5 px-1.5">
                                                    {index + 1 + ". "}
                                                    {answer.name}
                                                </FormLabel>

                                                {/* Custom check icon */}
                                                {form.getValues("answerId") === answer.uid && (
                                                    <div
                                                        className="text-green-500 col-span-1 grid place-content-center mr-0.5">
                                                        {/* Replace the content below with your custom check icon */}
                                                        <Icons.checkCircle2 size={20}/>
                                                    </div>
                                                )}
                                            </FormItem>
                                        ))}
                                    </RadioGroup>

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
                                                        formDefaultValues.recommendedNote !== ""
                                                            ? JSON.parse(formDefaultValues.recommendedNote)
                                                            : ""
                                                    }
                                                    id="recommendedNote"
                                                    placeHolder="Provide your recommended insights and suggestions..."
                                                />
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

function areObjectsEqual(dbFoundObject: Evaluate, evaluate: Evaluate) {
    let allMatching = true;

    const participantEqual =
        dbFoundObject.uid === evaluate.uid &&
        dbFoundObject.participantFirstName === evaluate.participantFirstName &&
        dbFoundObject.participantLastName === evaluate.participantLastName &&
        dbFoundObject.participantEmail === evaluate.participantEmail;

    if (!participantEqual) {
        return false;
    }

    dbFoundObject.choices?.forEach((choices, i) => {
        const evaluateIndexFound =
            evaluate?.choices?.findIndex(
                (choice2) => choice2.questionId === choices.questionId
            ) ?? -1;

        if (evaluateIndexFound !== -1) {
            let evaluateChoice: any;
            if (evaluate?.choices) {
                evaluateChoice = evaluate?.choices[evaluateIndexFound];
            }
            if (
                choices.answerId === evaluateChoice.answerId &&
                choices.additionalNote === evaluateChoice.additionalNote &&
                choices.internalNote === evaluateChoice.internalNote &&
                choices.recommendedNote === evaluateChoice.recommendedNote
            ) {
                // Keep allMatching as is, no need to change to true
            } else {
                allMatching = false;
            }
        } else {
            allMatching = false;
        }
    });

    return allMatching;
}
