import {Timestamp} from 'firebase/firestore'
import {SidebarNavItem} from '.'

export interface EmailMsg {
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string,
}

export interface User {
    uid: string
    firstName: string
    lastName: string
    email: string
    role: string
    image: string,
    audits: string[],
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
    authorId: string
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

export interface Question {
    uid: string
    name: string
    answers: Answer[]
    createdAt: Timestamp
}

export interface Answer {
    uid: string,
    name: string,
    recommendationDocument: string
    createdAt: Timestamp
}

export type Answers = Answer[]

export type Questions = Question[]

export enum QuestionActionType {
    ADD_QUESTION = "ADD_QUESTION",
    ADD_MULTIPLE_QUESTIONS = "ADD_MULTIPLE_QUESTIONS",
    UPDATE_QUESTION = "UPDATE_QUESTION",
    DELETE_QUESTION = "DELETE_QUESTION",
}

export type QuestionAction =
    | { type: QuestionActionType.ADD_QUESTION; payload: Question }
    | { type: QuestionActionType.ADD_MULTIPLE_QUESTIONS; payload: Question[] }
    | { type: QuestionActionType.UPDATE_QUESTION; payload: Question }
    | { type: QuestionActionType.DELETE_QUESTION; payload: string }

export interface Preview extends Audit {
    questions: Question[]
    sideBarNav: SidebarNavItem[]
}

export enum PreviewActionType {
    ADD_PREVIEW = "ADD_PREVIEW",
}

export type PreviewAction =
    | { type: PreviewActionType.ADD_PREVIEW; payload: Preview }

export interface Evaluation extends Audit {
    questions: Question[]
    sideBarNav: SidebarNavItem[]
    // evaluate: Evaluate
}

export enum EvaluationActionType {
    ADD_EVALUATION = "ADD_EVALUATION"
}

export type EvaluationAction =
    | { type: EvaluationActionType.ADD_EVALUATION; payload: Evaluation }

export interface Evaluate {
    participantFirstName: string
    participantLastName: string
    participantEmail: string
    choices: Choice []
    exclusiveList: string []
}

export interface Choice {
    questionId: string
    answerId: string
    additionalNote?: string
    recommendedNote?: string
    internalNote?: string
}