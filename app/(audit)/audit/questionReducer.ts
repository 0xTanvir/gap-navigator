import {Question, QuestionAction, QuestionActionType} from "@/types/dto";

export const questionsReducer = (state: Question[], action: QuestionAction): Question[] => {
    switch (action.type) {
        case QuestionActionType.ADD_QUESTION: {
            const index = state.findIndex(question => question.uid === action.payload.uid)
            if (index !== -1) {
                return state.map((question, i) => (i === index ? action.payload : question));
            } else {
                return [...state, action.payload]
            }
        }
        case QuestionActionType.ADD_MULTIPLE_QUESTIONS: {
            // Create a copy of the state to manipulate
            let newState = [...state]

            action.payload.forEach(newQuestion => {
                const index = newState.findIndex(question => question.uid === newQuestion.uid)
                if (index !== -1) {
                    // Replace existing
                    newState[index] = newQuestion
                } else {
                    // Add new
                    newState = [...newState, newQuestion]
                }
            })

            return newState
        }
        case QuestionActionType.UPDATE_QUESTION:
            return state.map(question =>
                question.uid === action.payload.uid ? {...question, ...action.payload} : question
            )
        case QuestionActionType.DELETE_QUESTION:
            return state.filter(question => question.uid !== action.payload)
        default:
            return state;
    }
}