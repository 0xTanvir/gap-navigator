"use client"
import React, {ReactNode} from 'react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface Question {
    id: number
    question_name: string
}

interface QuestionActionsDropdownProps {
    children: ReactNode
    question: Question
}

const QuestionActionsDropdown = ({children, question}: QuestionActionsDropdownProps) => {
    const pathname = usePathname()
    console.log(pathname)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="cursor-pointer">
                    <Link href={`${pathname}/edit/${question.id}`}>
                        Edit
                    </Link>
                </DropdownMenuLabel>
                <DropdownMenuLabel className="cursor-pointer">
                    Delete
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default QuestionActionsDropdown;