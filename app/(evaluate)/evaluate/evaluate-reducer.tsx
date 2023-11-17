import {Evaluation, EvaluationAction, EvaluationActionType} from "@/types/dto";

export const evaluateReducer = (state:Evaluation, action:EvaluationAction):Evaluation => {
    switch (action.type){
        case EvaluationActionType.ADD_EVALUATION:{
            return {
                ...state,
                ...action.payload
            }
        }
        default:{
            return state
        }
    }
}