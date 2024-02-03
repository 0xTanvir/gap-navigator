import React, { useState } from "react";
import { Icons } from "@/components/icons";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { answerSchema } from "@/lib/validations/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { setQuestionAnswer } from "@/lib/firestore/answer";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import { Audit } from "@/types/dto";

const Editor = dynamic(() => import("@/components/editorjs/editor"), {
  ssr: false,
});

interface AnswerCreateButtonProps extends ButtonProps {
  auditId: string;
  questionId: string;
  loading?: boolean;
  singleQuestionFetch: Function;
  audit: Audit | null
}

type FormData = z.infer<typeof answerSchema>;

const AnswerCreateButton = ({
                              auditId,
                              questionId,
                              singleQuestionFetch,
                              loading, audit,
                              className,
                              variant,
                              ...props
                            }: AnswerCreateButtonProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = React.useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const {questions} = useQuestions();

  let questionIndex = questions.findIndex(
    (question) => question.uid === questionId
  );

  let allQuestions: any[] = [];

  if (questionIndex !== -1) {
    allQuestions = [...questions]; // Create a copy of the original array
    // Remove elements from index 0 to the found index
    allQuestions.splice(0, questionIndex + 1);
  }

  let questionsData = allQuestions
    ?.filter((question) => question.uid !== questionId)
    .map((item) => ({
      name: item.name,
      uid: item.uid,
    }));

  const handleEditorSave = (data: any) => {
    setIsTyping(true);
    setTimeout(() => {
      if (!isTyping) {
        form.trigger("recommendationDocument");
      }
    }, 1);

    if (data.length > 0) {
      form.setValue("recommendationDocument", JSON.stringify(data));
    } else {
      form.setValue("recommendationDocument", JSON.stringify(undefined));
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      name: "",
      questionId: "",
      recommendationDocument: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const newAnswer = {
      uid: uuidv4(),
      name: data.name,
      questionId: data.questionId ? data.questionId : "",
      recommendationDocument: data.recommendationDocument,
      createdAt: Timestamp.now(),
    };
    try {
      await setQuestionAnswer(auditId, questionId, newAnswer);
      form.reset();
      setIsLoading(false);
      setShowAddDialog(false);
      singleQuestionFetch();
      return toast.success("Answer created.", {
        description: `Your answer was created with id ${newAnswer.uid}.`,
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("Answer has not been created.");
      console.error("Answer has not been created.", error);
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
                        <Input
                          variant="ny"
                          placeholder="Answer Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>

              {
                audit?.condition &&
                  <div className="grid gap-4 py-4">
                      <FormField
                          control={form.control}
                          name="questionId"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Question Name</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an question Name"/>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select a question Name</SelectLabel>
                                    {questionsData.map((question) => (
                                      <SelectItem
                                        key={question.uid}
                                        value={question.uid}
                                      >
                                        {question.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage/>
                            </FormItem>
                          )}
                      />
                  </div>
              }

              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="recommendationDocument"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Recommendation Document</FormLabel>
                      <FormControl>
                        <Editor
                          id="recommendationDocument"
                          onSave={handleEditorSave}
                          placeHolder="Let`s write recommendation document!"
                        />
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
                  Submit
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
