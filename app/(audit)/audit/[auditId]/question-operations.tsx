import React, { useEffect, useState } from "react";
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
import { Timestamp } from "firebase/firestore";
import { Question, QuestionActionType } from "@/types/dto";
import { toast } from "sonner";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema } from "@/lib/validations/question";
import {
  deleteQuestionById,
  updateQuestionById,
} from "@/lib/firestore/question";

interface QuestionOperationsProps {
  auditId: string;
  questionId: string;
  question: Question;
}

type FormData = z.infer<typeof questionSchema>;

const QuestionOperations = ({
  auditId,
  questionId,
  question,
}: QuestionOperationsProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
  const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] =
    React.useState<boolean>(false);

  const { dispatch } = useQuestions();

  const form = useForm<FormData>({
    resolver: zodResolver(questionSchema),
  });

  async function onUpdateSubmit(data: FormData) {
    setIsUpdateLoading(true);
    let formData: Question = {
      uid: question?.uid || "",
      name: data.question_name,
      answers: question?.answers || [],
      createdAt: question?.createdAt || Timestamp.now(),
    };
    try {
      const isSuccess: boolean = await updateQuestionById(
        auditId,
        questionId,
        formData
      );
      if (isSuccess) {
        // Update your state or dispatch action
        dispatch({
          type: QuestionActionType.UPDATE_QUESTION,
          payload: formData as Question,
        });
        toast.info("Question updated!");
        form.reset();
      } else {
        // Handle failure
        console.error("Failed to update question in Firebase");
      }
    } catch (error) {
      console.error("Error updating document:", error);
      setIsUpdateLoading(false);
    } finally {
      setShowUpdateDialog(false);
      setIsUpdateLoading(false);
    }
  }

  async function deleteSingleQuestion(event: React.MouseEvent) {
    event.preventDefault();
    setIsDeleteLoading(true);
    try {
      await deleteQuestionById(auditId, questionId);
      dispatch({
        type: QuestionActionType.DELETE_QUESTION,
        payload: questionId,
      });
      toast.info("Question deleted.");
      setIsDeleteLoading(false);
      setShowDeleteAlert(false);
    } catch (error) {
      setIsDeleteLoading(false);
      toast.error("Something went wrong.", {
        description: "Failed to delete question. Please try again.",
      });
    }
  }

  useEffect(() => {
    if (question) {
      form.reset({
        question_name: question.name,
      });
    }
  }, [question]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onSelect={() => setShowUpdateDialog(true)}
          >
            <Icons.fileEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            <Icons.trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this question?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => deleteSingleQuestion(event)}
              className="bg-red-600 focus:ring-red-600"
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onUpdateSubmit)}>
              <DialogHeader>
                <DialogTitle>Update Question</DialogTitle>
                <DialogDescription>
                  Make changes to your question here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="question_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          variant="ny"
                          placeholder="Answer Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "default" }), {
                    "cursor-not-allowed opacity-60": isUpdateLoading,
                  })}
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.add className="mr-2 h-4 w-4" />
                  )}
                  Save changes
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionOperations;
