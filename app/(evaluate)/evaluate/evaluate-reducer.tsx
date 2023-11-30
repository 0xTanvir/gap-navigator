import { Evaluation, EvaluationAction, EvaluationActionType } from "@/types/dto";

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
        case EvaluationActionType.ADD_QUESTION_ANSWER: {
            // Ensure default values for evaluate and choices
            const updatedEvaluate = state.evaluate || {choices: []};
            const updatedChoices = updatedEvaluate?.choices ?
                [
                    ...updatedEvaluate.choices.filter((choice) => choice.questionId !== action.payload.questionId),
                    {
                        ...action.payload
                    },
                ]
                : [
                    {
                       ...action.payload
                    },
                ];
            return {
                ...state,
                evaluate: {
                    ...state.evaluate,
                    choices: updatedChoices
                }
            }
        }
        default: {
            return state
        }
    }
}