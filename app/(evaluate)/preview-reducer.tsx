import { Preview, PreviewAction, PreviewActionType } from '@/types/dto'

export const previewReducer = (state: Preview, action: PreviewAction): Preview => {
    switch (action.type) {
        case PreviewActionType.ADD_PREVIEW: {
            return {
                ...state,
                ...action.payload
            }
        }
        default:
            return state
    }
}