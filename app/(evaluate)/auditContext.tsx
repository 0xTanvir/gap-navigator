"use client"
import React, {createContext, useContext, useState} from "react";
import {Audit} from "@/types/dto";
import {getAudit} from "@/lib/firestore/audit";

interface SingleAuditContextProps {
    singleAudit: Audit | null
    fetchSingleAudit: (auditId: string) => void
    auditLoader:boolean
}

interface AuditProviderProps {
    children: React.ReactNode,
}

const SingleAuditContext = createContext<SingleAuditContextProps | undefined>(undefined)

export const SingleAuditProvider: React.FC<AuditProviderProps> = ({children}) => {
    const [singleAudit, setSingleAudit] = useState<Audit | null>(null);
    const [auditLoader, setAuditLoader] = useState<boolean>(true)

    const fetchSingleAudit = async (auditId: string) => {
        try {
            const dbAudit = await getAudit(auditId)
            setSingleAudit(dbAudit);
            setAuditLoader(false)
        } catch (error) {
            console.error('Error fetching single audit:', error);
            setAuditLoader(false)
        }
    };
    return (
        <SingleAuditContext.Provider value={{singleAudit,auditLoader, fetchSingleAudit}}>
            {children}
        </SingleAuditContext.Provider>
    )
}

export const useSingleAudit = () => {
    const context = useContext(SingleAuditContext)
    if (context === undefined) {
        throw new Error("useSingleAudit must be used within SingleAuditProvider")
    }
    return context;
}