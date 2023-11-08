import { Timestamp } from 'firebase/firestore'

export interface User {
    uid: string
    firstName: string
    lastName: string
    email: string
    role: string
    image: string
}

export interface TeamCardProps {
    imageSrc: string,
    name: string,
    profession: string,
    facebookLink: string,
    twitterLink: string,
    instagramLink: string,
}

export interface Audit {
    uid: string
    name: string
    type: string
    createdAt: Timestamp
}

// Define an array type of Audit
export type Audits = Audit[]

export enum AuditActionType {
    ADD_AUDIT = "ADD_AUDIT",
    ADD_MULTIPLE_AUDITS = "ADD_MULTIPLE_AUDITS",
    UPDATE_AUDIT = "UPDATE_AUDIT",
    DELETE_AUDIT = "DELETE_AUDIT",
}

export type AuditAction =
    | { type: AuditActionType.ADD_AUDIT; payload: Audit }
    | { type: AuditActionType.ADD_MULTIPLE_AUDITS; payload: Audit[] }
    | { type: AuditActionType.UPDATE_AUDIT; payload: Audit }
    | { type: AuditActionType.DELETE_AUDIT; payload: string }