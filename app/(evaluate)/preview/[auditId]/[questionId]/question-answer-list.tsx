import React, {useEffect} from 'react';
import {DocsPageHeader} from "@/app/(evaluate)/preview/page-header";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Textarea} from "@/components/ui/textarea";
import {DocsPager} from "@/app/(evaluate)/preview/[auditId]/[questionId]/pager";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {useSingleAudit} from "@/app/(evaluate)/auditContext";
import {useAllQuestion} from "@/app/(evaluate)/questionsContext";
import {SidebarNavItem} from "@/types";
import {previewQuestionListSchema} from "@/lib/validations/question";

interface QuestionAnswerListProps {
    auditId: string
    questionId: string
}

type FormData = z.infer<typeof previewQuestionListSchema>

const QuestionAnswerList = ({auditId, questionId}: QuestionAnswerListProps) => {
    const {singleAudit, fetchSingleAudit} = useSingleAudit()
    const {allQuestion, fetchAllQuestion} = useAllQuestion()


    const transformedAudits = {
        title: singleAudit?.name,
        description: "Complete this audit to generate your report.",
        questions: allQuestion?.map(question => ({
            id: question.uid,
            title: question.name,
            answers: question.answers.map(answer => ({
                id: answer.uid,
                text: answer.name,
            })),
        })),
        sidebarNav: [
            {
                title: "Getting Started",
                items: [
                    {
                        title: singleAudit?.name,
                        href: `/preview/${singleAudit?.uid}`,
                    },
                ],
            },
            {
                title: "Questions",
                items: allQuestion?.map(question => ({
                    title: question.name,
                    href: `/preview/${singleAudit?.uid}/${question?.uid}`,
                })),
            },
        ] as SidebarNavItem[]
    };

    const question = transformedAudits?.questions?.find((question) => question.id === questionId)

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

    useEffect(() => {
        fetchSingleAudit(auditId)
        fetchAllQuestion(auditId)
    }, [auditId])

    return (
        <>
            <DocsPageHeader
                heading={question?.title ?? "Question not found"}
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
                                                               <RadioGroupItem value={answer.id} className="sr-only"/>
                                                           </FormControl>
                                                           <div
                                                               className="items-center text-center rounded-md border-4 border-muted hover:border-accent cursor-pointer">
                                                               <div
                                                                   className="flex flex-col p-6 justify-between space-y-4 hover:bg-primary hover:text-primary-foreground">
                                                                   <div className="space-y-2">
                                                                       <h2 className="text-xl font-medium tracking-tight">
                                                                           {answer.text}
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
                                            placeholder="Tell us a little bit about yourself"
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
                                            placeholder="Tell us a little bit about yourself"
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
                                            placeholder="Tell us a little bit about yourself"
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
            <DocsPager/>

        </>
    );
};

export default QuestionAnswerList;