"use client"
import {DocsPageHeader} from "@/app/(evaluate)/preview/page-header";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Textarea} from "@/components/ui/textarea";
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {previewQuestionListSchema} from "@/lib/validations/question";
import {toast} from "@/components/ui/use-toast";
import * as z from "zod";
import {EvaluatePager} from "@/app/(evaluate)/evaluate/[auditId]/[questionId]/pager";

type FormData = z.infer<typeof previewQuestionListSchema>

export default function EvaluateQuestionPage({params}: { params: { auditId: string, questionId: string } }) {
    const {evaluation} = useEvaluation()
    const {questionId,auditId} = params
    const question = evaluation?.questions?.find((question) => question.uid === questionId)

    const form = useForm<FormData>({
        resolver: zodResolver(previewQuestionListSchema),
        // TODO: pass default values here from the saved answer
    })

    function onSubmit(data: FormData) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
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
                        <FormField control={form.control}
                                   name="answer"
                                   render={({field}) => (
                                       <FormItem className="space-y-1">
                                           {/* TODO: when evaluate happens, then this should be populated
                                        a defaultValue={already - answered - value} if answer already seated */}
                                           <RadioGroup
                                               onValueChange={field.onChange}
                                               defaultValue={field.value}
                                               className="grid gap-4 md:grid-cols-2 md:gap-6">
                                               {question.answers.map((answer) => (
                                                   <FormItem>
                                                       <FormLabel
                                                           className="[&:has([data-state=checked])>div]:border-primary">
                                                           <FormControl>
                                                               <RadioGroupItem value={answer.uid} className="sr-only"/>
                                                           </FormControl>
                                                           <div
                                                               className="items-center text-center rounded-md border-4 border-muted hover:border-accent cursor-pointer">
                                                               <div
                                                                   className="flex flex-col p-6 justify-between space-y-4 hover:bg-primary hover:text-primary-foreground">
                                                                   <div className="space-y-2">
                                                                       <h2 className="text-xl font-medium tracking-tight">
                                                                           {answer.name}
                                                                       </h2>
                                                                   </div>
                                                               </div>
                                                           </div>
                                                       </FormLabel>
                                                   </FormItem>
                                               ))}
                                           </RadioGroup>
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
                        <FormField
                            control={form.control}
                            name="recommendedNote"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Recommended Note</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            variant="ny"
                                            placeholder="Provide your recommended insights and suggestions..."
                                            className="resize-none"
                                            {...field}
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
                    </form>
                </Form>
            ) : (
                <p>Answers not found.</p>
            )}
            <EvaluatePager currentQuestion={questionId} />
        </div>
    )
}