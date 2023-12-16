import { Audit, AuditAction, AuditActionType } from '@/types/dto'

export const auditsReducer = (state: Audit[], action: AuditAction): Audit[] => {
    switch (action.type) {
        case AuditActionType.ADD_AUDIT: {
            const index = state.findIndex(audit => audit.uid === action.payload.uid)
            if (index !== -1) {
                // Replace the existing audit by creating a new array with the updated item
                return state.map((audit, i) => (i === index ? action.payload : audit))
            } else {
                // Audit with this uid does not exist, so add it
                return [...state, action.payload]
            }
        }
        case AuditActionType.ADD_MULTIPLE_AUDITS: {
            // Create a copy of the state to manipulate
            let newState = [...state]

            action.payload.forEach(newAudit => {
                const index = newState.findIndex(audit => audit.uid === newAudit.uid)
                if (index !== -1) {
                    // Replace existing
                    newState[index] = newAudit
                } else {
                    // Add new
                    newState = [...newState, newAudit]
                }
            })

            return newState
        }
        case AuditActionType.UPDATE_AUDIT:
            return state.map(audit =>
                audit.uid === action.payload.uid ? {...audit, ...action.payload} : audit
            )
        case AuditActionType.UPDATE_AUDIT_ARCHIVE:
            return state.map(audit =>
                audit.uid === action.payload.uid ? {...audit, ...action.payload} : audit
            ).filter((audit) => audit.status !== "archive")
        case AuditActionType.UPDATE_AUDIT_RESTORE:
            return state.map(audit =>
                audit.uid === action.payload.uid ? {...audit, ...action.payload} : audit
            ).filter((audit) => audit.status !== "")
        case AuditActionType.DELETE_AUDIT:
            return state.filter(audit => audit.uid !== action.payload)
        default:
            return state
    }
}