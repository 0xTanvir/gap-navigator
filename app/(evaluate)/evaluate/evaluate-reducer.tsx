import {Evaluation, EvaluationAction, EvaluationActionType} from "@/types/dto";

export const evaluateReducer = (state: Evaluation, action: EvaluationAction): Evaluation => {
    switch (action.type) {
        case EvaluationActionType.ADD_EVALUATION: {
            return {
                ...state,
                ...action.payload
            }
        }
        case EvaluationActionType.ADD_EVALUATE: {
            return {
                ...state, // Keep the existing state
                evaluate: {
                    ...state.evaluate, // Keep the existing evaluate data
                    ...action.payload, // Merge with the new evaluate data
                },
            };
        }
        default: {
            return state
        }
    }
}