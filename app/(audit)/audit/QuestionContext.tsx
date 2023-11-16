import React, {createContext, useContext, useReducer, Dispatch, useState} from 'react';
import {questionsReducer} from "@/app/(audit)/audit/questionReducer";
import {Question, QuestionAction} from "@/types/dto";

interface QuestionContextType {
    questions: Question[],
    dispatch: Dispatch<QuestionAction>
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined)
interface QuestionProviderProps {
    children: React.ReactNode,
    initialQuestion?: Question[]
}

export const QuestionProvider: React.FC<QuestionProviderProps> = ({children, initialQuestion = []}) => {
    const [questions, dispatch] = useReducer(questionsReducer, initialQuestion)
    return (
        <QuestionContext.Provider value={{questions, dispatch}}>
            {children}
        </QuestionContext.Provider>
    );
};

const useQuestions = () => {
    const context = useContext(QuestionContext)
    if (context === undefined) {
        throw new Error("useQuestions must be used within QuestionsContext")
    }
    return context
}

export default useQuestions;

