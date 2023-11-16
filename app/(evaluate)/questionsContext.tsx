"use client"
import React, {createContext, useContext, useState} from "react";
import {Questions} from "@/types/dto";
import {allQuestions} from "@/lib/firestore/audit";

interface allQuestionContextProps {
    allQuestion: Questions | null
    fetchAllQuestion: (questionId: string) => void
}

interface QuestionProviderProps {
    children: React.ReactNode,
}

const allQuestionContext = createContext<allQuestionContextProps | undefined>(undefined)

export const AllQuestionProvider: React.FC<QuestionProviderProps> = ({children}) => {
    const [allQuestion, setAllQuestion] = useState<Questions | null>(null);

    const fetchAllQuestion = async (auditId: string) => {
        try {
            const dbQuestion = await allQuestions(auditId)
            setAllQuestion(dbQuestion)
        } catch (error) {
            console.error('Error fetching all Question:', error);
        }
    };
    return (
        <allQuestionContext.Provider value={{allQuestion, fetchAllQuestion}}>
            {children}
        </allQuestionContext.Provider>
    )
}

export const useAllQuestion = () => {
    const context = useContext(allQuestionContext)
    if (context === undefined) {
        throw new Error("useAllQuestion must be used within SingleAllQuestion")
    }
    return context;
}