import React, {useState} from 'react';
import Link from "next/link";
import {formatDate} from "@/lib/utils";
import {Question, QuestionActionType} from "@/types/dto";
import {Icons} from "@/components/icons";
import {Collections} from "@/lib/firestore/client";
import {deleteDoc} from "firebase/firestore";
import {toast} from "@/components/ui/use-toast";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface QuestionItemProps {
    auditId: string
    question: Question
}

const QuestionItem = ({auditId, question}: QuestionItemProps) => {
    const {dispatch} = useQuestions()
    const [loading, setLoading] = useState<boolean>(false)
    const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)

    async function deleteSingleQuestion(event: React.MouseEvent) {
        event.preventDefault()
        setLoading(true)
        try {
            const questionRef = Collections.question(auditId, question.uid)
            await deleteDoc(questionRef)
            dispatch({type: QuestionActionType.DELETE_QUESTION, payload: question.uid})
            toast({
                title: 'Question deleted successfully!',
                variant: 'default'
            })
            setLoading(false)
            setShowDeleteAlert(false)
        } catch (error) {
            setLoading(false)
            toast({
                title: "Something went wrong.",
                description: "Your question was not deleted. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <div className="flex gap-2">
                    <Link
                        href={`/audit/${auditId}/${question.uid}`}
                        className="font-semibold hover:underline"
                    >
                        {question.name}
                    </Link>
                </div>

                <div>
                    <p className="flex text-sm text-muted-foreground">
                        {formatDate(question.createdAt)}
                    </p>
                </div>
            </div>
            <button
                disabled={loading}
                onClick={() => setShowDeleteAlert(true)}
                className="border flex justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm"
            >
                <Icons.trash className="mr-2 h-4 w-4"/>
                Delete
            </button>

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
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(event) => deleteSingleQuestion(event)}
                            className="bg-red-600 focus:ring-red-600"
                            disabled={loading}
                        >
                            {loading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4"/>
                            )}
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}

export default QuestionItem;