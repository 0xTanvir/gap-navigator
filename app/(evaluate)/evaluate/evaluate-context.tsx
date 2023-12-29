import React, { createContext, Dispatch, useContext, useReducer } from "react";
import { Evaluate, Evaluation, EvaluationAction } from "@/types/dto";
import { evaluateReducer } from "./evaluate-reducer";
import { Timestamp } from "firebase/firestore";

interface EvaluateContextType {
  evaluation: Evaluation
  dispatch: Dispatch<EvaluationAction>
}

const EvaluateContext = createContext<EvaluateContextType | undefined>(undefined)

interface EvaluationProviderProps {
  children: React.ReactNode
  initialEvaluation?: Evaluation
}

export const EvaluationProvider: React.FC<EvaluationProviderProps> = ({children, initialEvaluation}) => {
  // Define the initial state
  const initialState: Evaluation = initialEvaluation || {
    // provide default values for your Evaluation structure
    uid: '',
    name: '',
    type: '',
    description: '',
    authorId: '',
    createdAt: Timestamp.now(),
    questions: [],
    sideBarNav: [],
    evaluate: {
      uid: '',
      participantFirstName: '',
      participantLastName: '',
      participantEmail: '',
      choices: []
    },
    evaluations: [],
  };

  const [evaluation, dispatch] = useReducer(evaluateReducer, initialState)

  return (
      <EvaluateContext.Provider value={{evaluation, dispatch}}>
        {children}
      </EvaluateContext.Provider>
  )
}

const useEvaluation = () => {
  const context = useContext(EvaluateContext)
  if (context === undefined) {
    throw new Error("useEvaluation must be used within EvaluationContext")
  }
  return context
}

export default useEvaluation;