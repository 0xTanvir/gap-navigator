import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {v4 as uuidv4} from 'uuid'
import {usePathname, useRouter} from "next/navigation";
import {Timestamp} from "firebase/firestore";
import {AuditActionType, Question, QuestionActionType} from "@/types/dto";
import {allQuestions, getAuditsByIds, setQuestion} from "@/lib/firestore/audit";
import {toast} from "@/components/ui/use-toast";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import {useEffect, useState} from "react";

interface QuestionCreateButtonProps {
    auditId: string
}

export function QuestionCreateButton({auditId}: QuestionCreateButtonProps) {
    // const [isLoading, setIsLoading] = useState<boolean>(true)
    const {questions, dispatch} = useQuestions()
    const router = useRouter()
    const pathName = usePathname()

    async function handleAddQuestion() {
        // TODO create question as `Untitled Question`

        try {
            // Step 1: Generate UID
            const newUid = uuidv4();

            const newQuestion: Question = {
                uid: newUid,
                name: 'Untitled Question',
                answers: [],
                createdAt: Timestamp.now(),
            }

            await setQuestion(auditId, newQuestion)
            dispatch({type: QuestionActionType.ADD_QUESTION, payload: newQuestion})

            toast({
                title: "Question created successfully.",
                description: `Your question was created with id ${newUid}.`,
            })
            // and push router to that question
            router.push(`${pathName}/${newUid}`)

        } catch (error) {
            console.log(error)
            return toast({
                title: "Something went wrong.",
                description: "Your question was not created. Please try again.",
                variant: "destructive",
            })
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <Icons.ellipsis className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex cursor-pointer items-center"
                                  onClick={handleAddQuestion}
                >
                    <Icons.filePlus className="mr-2 h-4 w-4"/>
                    Add Question
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}