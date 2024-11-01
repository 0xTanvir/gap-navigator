import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { buttonVariants } from "@/components/ui/button";
import {
  deleteAnswerById,
  updateQuestionAnswerById,
} from "@/lib/firestore/answer";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { answerSchema } from "@/lib/validations/question";
import * as z from "zod";
import { Answer, Audit } from "@/types/dto";
import dynamic from "next/dynamic";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Editor = dynamic(() => import("@/components/editorjs/editor"), {
  ssr: false,
});

type FormData = z.infer<typeof answerSchema>;

interface AnswerOperationProps {
  auditId: string;
  questionId: string;
  answerId: string;
  answer: Answer;
  singleQuestionFetch: Function;
  audit: Audit | null
}

async function deleteAuditFromDB(
  auditId: string,
  questionId: string,
  answerId: string
) {
  try {
    await deleteAnswerById(auditId, questionId, answerId);
    return toast.success("Answer deleted", {
      description: "Answer has been deleted.",
    });
  } catch (error) {
    toast.error("Something went wrong.", {
      description: "Answer has not been deleted. Please try again.",
    });
  }
}

const AnswerOperations = ({
                            auditId,
                            questionId,
                            answerId,
                            singleQuestionFetch,
                            answer,
                            audit
                          }: AnswerOperationProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
  const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] =
    React.useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const {questions} = useQuestions();

  let questionIndex = questions.findIndex(
    (question) => question.uid === questionId
  );

  let allQuestions: any[] = [];

  if (questionIndex !== -1) {
    allQuestions = [...questions]; // Create a copy of the original array
    // Remove elements from index 0 to the found index
    let removedQuestions = allQuestions.splice(0, questionIndex + 1);
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
    }, 100);

    if (data.length > 0) {
      form.setValue("recommendationDocument", JSON.stringify(data));
    } else {
      form.setValue("recommendationDocument", JSON.stringify(undefined));
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      name: answer.name,
      questionId: answer?.questionId ? answer?.questionId : "",
      recommendationDocument: answer.recommendationDocument,
    },
  });

  async function onUpdateSubmit(data: FormData) {
    setIsUpdateLoading(true);
    const updateAnswer = {
      uid: answer.uid,
      name: data.name,
      questionId: data.questionId ? data.questionId : "",
      recommendationDocument: data.recommendationDocument,
      createdAt: answer.createdAt,
    };
    try {
      const response = await updateQuestionAnswerById(
        auditId,
        questionId,
        answerId,
        updateAnswer
      );
      if (response) {
        toast.success("Answer updated!", {
          description: `Your answer has been updated ${answerId}`,
        });
      } else {
        toast.info("Answer not found.");
      }
      setIsUpdateLoading(false);
      setShowUpdateDialog(false);
      singleQuestionFetch();
    } catch (error) {
      setIsUpdateLoading(false);
      toast.error("Answer not found.");
    }

    return true;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4"/>
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onSelect={() => setShowUpdateDialog(true)}
          >
            <Icons.fileEdit className="mr-2 h-4 w-4"/>
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            <Icons.trash className="mr-2 h-4 w-4"/>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this answer?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();
                setIsDeleteLoading(true);

                const deleted = await deleteAuditFromDB(
                  auditId,
                  questionId,
                  answerId
                );
                singleQuestionFetch();

                if (deleted) {
                  setIsDeleteLoading(false);
                  setShowDeleteAlert(false);
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
              ) : (
                <Icons.trash className="mr-2 h-4 w-4"/>
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <SheetContent className="sm:max-w-[80vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Update Answer</SheetTitle>
            <SheetDescription>
              Make changes to your question answer here. Click save when you're
              done.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onUpdateSubmit)}>
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
                {
                  audit?.condition &&
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
                }

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
                          initialData={JSON.parse(
                            answer.recommendationDocument
                          )}
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
                  className={cn(buttonVariants({variant: "default"}), {
                    "cursor-not-allowed opacity-60": isUpdateLoading,
                  })}
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                  ) : (
                    <Icons.add className="mr-2 h-4 w-4"/>
                  )}
                  Update Answer
                </button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AnswerOperations;
