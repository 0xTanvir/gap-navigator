import { createContext, useContext, useReducer, Dispatch } from 'react'
import { Audit, AuditAction } from '@/types/dto'
import { auditsReducer } from './auditsReducer'

interface AuditsContextType {
    audits: Audit[]
    dispatch: Dispatch<AuditAction>
}

const AuditsContext = createContext<AuditsContextType | undefined>(undefined)

interface AuditsProviderProps {
    children: React.ReactNode
    initialAudits?: Audit[]
}

export const AuditsProvider: React.FC<AuditsProviderProps> = ({ children, initialAudits = [] }) => {
    const [audits, dispatch] = useReducer(auditsReducer, initialAudits)

    return (
        <AuditsContext.Provider value={{ audits, dispatch }}>
            {children}
        </AuditsContext.Provider>
    )
}

const useAudits = () => {
    const context = useContext(AuditsContext)

    if (context === undefined) {
        throw new Error("useAudits must be used within AuditsContext")
    }

    return context
};

export default useAudits