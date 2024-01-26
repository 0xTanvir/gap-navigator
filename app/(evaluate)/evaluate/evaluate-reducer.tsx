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
        evaluateFormData: {
          uid: action.payload.uid,
          participantFirstName: action.payload.participantFirstName,
          participantLastName: action.payload.participantLastName,
          participantEmail: action.payload.participantEmail,
          participantPhone: action.payload.participantPhone,
          auditId: action.payload.auditId,
          isCompleted: action.payload.isCompleted,
          createdAt: action.payload.createdAt,
        }
      };
    }
    case EvaluationActionType.UPDATE_EVALUATE: {
      return {
        ...state,
        evaluate: {
          ...state.evaluate,
          isCompleted: action.payload.isCompleted,
        },
        evaluateFormData: {
          ...state.evaluateFormData,
          isCompleted: action.payload.isCompleted,
        }
      };
    }
    // case EvaluationActionType.ADD_QUESTION_ANSWER: {
    //     // Ensure default values for evaluate and choices
    //     const updatedEvaluate = state.evaluate || {choices: []};
    //     const updatedChoices = updatedEvaluate?.choices ?
    //         [
    //             ...updatedEvaluate.choices.filter((choice) => choice.questionId !== action.payload.questionId),
    //             {
    //                 ...action.payload
    //             },
    //         ]
    //         : [
    //             {
    //                 ...action.payload
    //             },
    //         ];
    //     return {
    //         ...state,
    //         evaluate: {
    //             ...state.evaluate,
    //             choices: updatedChoices,
    //         },
    //         // evaluateFormData: {
    //         //     ...state.evaluateFormData,
    //         //     choices: updatedChoicesFormData
    //         // }
    //     };
    // }

    case EvaluationActionType.ADD_QUESTION_ANSWER: {
      // console.log(action.payload)
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
      // console.log(updatedChoices)
      const updatedEvaluateFormData = state.evaluateFormData || {choices: []};
      const updatedChoicesFormData = updatedEvaluateFormData?.choices ?
        [
          ...updatedEvaluateFormData.choices.filter((choice) => choice.questionId !== action.payload.questionId),
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
        },
        evaluateFormData: {
          ...state.evaluateFormData,
          choices: updatedChoicesFormData
        }
      }
    }
    case EvaluationActionType.REMOVE_QUESTION_ANSWER: {

      // Check if the choices array exists in evaluate
      if (state.evaluate && state.evaluate.choices) {
        const updatedChoices = state.evaluate.choices.filter(
          (choice) => choice.questionId !== action.payload
        );
        return {
          ...state,
          evaluate: {
            ...state.evaluate,
            choices: updatedChoices,
          }
        };
      }
      if (state.evaluateFormData && state.evaluateFormData.choices) {
        const updatedChoices = state.evaluateFormData.choices.filter(
          (choice) => choice.questionId !== action.payload
        );
        return {
          ...state,
          evaluateFormData: {
            ...state.evaluateFormData,
            choices: updatedChoices
          }
        };
      }
      return state;
    }
    default: {
      return state
    }
  }
}