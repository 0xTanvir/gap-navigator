import { DocsPageHeader } from "@/app/(evaluate)/preview/page-header";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { PreviewPager } from "@/app/(evaluate)/preview/[auditId]/[questionId]/pager";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { previewQuestionListSchema } from "@/lib/validations/question";
import usePreview from '@/app/(evaluate)/preview-context';
import { Icons } from "@/components/icons";
import { useAuth } from "@/components/auth/auth-provider";
import Editor from "@/components/editorjs/editor";

interface QuestionAnswerListProps {
  questionId: string
}

type FormData = z.infer<typeof previewQuestionListSchema>

const QuestionAnswerList = ({questionId}: QuestionAnswerListProps) => {
  const {preview} = usePreview()
  const {user} = useAuth();
  const question = preview?.questions?.find((question) => question.uid === questionId)

  const form = useForm<FormData>({
    resolver: zodResolver(previewQuestionListSchema),
    // TODO: pass default values here from the saved answer
  })
  const handleEditorRecommendedNote = (data: any) => {
  }

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
      <>
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
                                     className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                                 >
                                   {question.answers.map((answer, index) => (
                                       <FormItem
                                           key={answer.uid}
                                           className={`rounded-lg border shadow-sm focus:outline-none grid grid-cols-12 space-x-0 space-y-0 w-full ${
                                               form.getValues("answer") === answer.uid
                                                   ? "border-indigo-600 ring-2 ring-indigo-600"
                                                   : "border-gray-300"
                                           }`}
                                       >
                                         <FormControl style={{display: 'none'}}>
                                           <RadioGroupItem value={answer.uid}/>
                                         </FormControl>
                                         <FormLabel
                                             className="font-normal block text-sm cursor-pointer col-span-11 py-2.5 px-1.5">
                                           {index + 1 + ". "}{answer.name}
                                         </FormLabel>

                                         {/* Custom check icon */}
                                         {form.getValues('answer') === answer.uid && (
                                             <div
                                                 className="text-green-500 col-span-1 grid place-content-center mr-0.5">
                                               {/* Replace the content below with your custom check icon */}
                                               <Icons.checkCircle2 size={20}/>
                                             </div>
                                         )}

                                       </FormItem>
                                   ))}
                                 </RadioGroup>
                               </FormItem>
                           )}
                />
                <FormField
                    disabled={true}
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
                {(user?.role === "consultant" || user?.role === "admin") && (
                    <>
                      <FormField
                          disabled={true}
                          control={form.control}
                          name="recommendedNote"
                          render={({field}) => (
                              <FormItem>
                                <FormLabel>Recommended Note</FormLabel>
                                <FormControl>
                                  <Editor
                                      onSave={handleEditorRecommendedNote}
                                      id="recommendedNote"
                                      placeHolder="Provide your recommended insights and suggestions..."
                                      disable={true}
                                  />
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                          )}
                      />
                      <FormField
                          disabled={true}
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
              </form>
            </Form>
        ) : (
            <p>Answers not found.</p>
        )}
        <PreviewPager currentQuestion={questionId}/>
      </>
  );
};

export default QuestionAnswerList;