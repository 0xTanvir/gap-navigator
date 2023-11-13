import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation";

export function QuestionCreateButton() {
    const router = useRouter()
    const pathName = usePathname()

    function handleAddQuestion() {
        // TODO create question as `Untitled Question`
        // and push router to that question
        router.push(`${pathName}/someId`)
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <Icons.ellipsis className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex cursor-pointer items-center"
                    onClick={handleAddQuestion}
                >
                    <Icons.filePlus className="mr-2 h-4 w-4" />
                    Add Question
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}