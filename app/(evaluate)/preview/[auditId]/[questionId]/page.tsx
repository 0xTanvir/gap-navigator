'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DocsPageHeader } from "../../page-header"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { audit } from "@/app/(evaluate)/layout"
import { DocsPager } from "./pager"
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
    answer: z.string({
        required_error: "You need to select a answer.",
    }),
    note: z.string().max(160).min(4),
})

export default function PreviewQuestionPage({ params }: { params: { questionId: string } }) {
    // TODO: reconfigure this from the audit.questions
    const question = audit.questions.find((question) => question.id === params.questionId)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        // TODO: pass default values here from the saved answer
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
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
                heading={question?.title ?? "Question not found"}
                text="Please choose from the following answers:"
            />
            {question?.answers?.length ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    {/* TODO: when evaluate happens, then this should be populated
                                        a defaultValue={already - answered - value} if answer already seated */}
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid gap-4 md:grid-cols-2 md:gap-6">
                                        {question.answers.map((answer) => (
                                            <FormItem>
                                                <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                                    <FormControl>
                                                        <RadioGroupItem value={answer.id} className="sr-only" />
                                                    </FormControl>
                                                    <div className="items-center text-center rounded-md border-4 border-muted hover:border-accent cursor-pointer">
                                                        <div className="flex flex-col p-6 justify-between space-y-4 hover:bg-primary hover:text-primary-foreground">
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
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            ) : (
                <p>Answers not found.</p>
            )}
            <DocsPager />
        </div>
    )
}
