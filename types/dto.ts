import { Timestamp } from 'firebase/firestore'
import { SidebarNavItem } from '.'

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
  invitedAuditsList: string[],
  status?: string
  createdAt: Timestamp
}

export enum UserRole {
  CLIENT = 'client',
  CONSULTANT = 'consultant'
}

export enum UserAccountStatus {
  DISABLE = 'disable',
  ENABLE = 'enable'
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
  condition: boolean
  welcome: string
  thank_you: string
  exclusiveList?: string[];
  status?: string,
  authorId: string
  createdAt: Timestamp
}

export enum AuditStatus {
  AUDIT_ARCHIVE = "archive"
}

// Define an array type of Audit
export type Audits = Audit[]

export enum AuditActionType {
  ADD_AUDIT = "ADD_AUDIT",
  ADD_MULTIPLE_AUDITS = "ADD_MULTIPLE_AUDITS",
  UPDATE_AUDIT = "UPDATE_AUDIT",
  UPDATE_AUDIT_ARCHIVE = "UPDATE_AUDIT_ARCHIVE",
  UPDATE_AUDIT_RESTORE = "UPDATE_AUDIT_RESTORE",
  DELETE_AUDIT = "DELETE_AUDIT",
}

export type AuditAction =
  | { type: AuditActionType.ADD_AUDIT; payload: Audit }
  | { type: AuditActionType.ADD_MULTIPLE_AUDITS; payload: Audit[] }
  | { type: AuditActionType.UPDATE_AUDIT; payload: Audit }
  | { type: AuditActionType.UPDATE_AUDIT_ARCHIVE; payload: Audit }
  | { type: AuditActionType.UPDATE_AUDIT_RESTORE; payload: Audit }
  | { type: AuditActionType.DELETE_AUDIT; payload: string }

export interface Question {
  id: number,
  uid: string
  name: string
  answers: Answer[]
  createdAt: Timestamp
}

export interface Answer {
  uid: string,
  name: string,
  questionId: string,
  recommendationDocument: string
  createdAt: Timestamp
}

export type Answers = Answer[]

export type Questions = Question[]

export enum QuestionActionType {
  ADD_QUESTION = "ADD_QUESTION",
  ADD_MULTIPLE_QUESTIONS = "ADD_MULTIPLE_QUESTIONS",
  UPDATE_QUESTION = "UPDATE_QUESTION",
  UPDATE_MULTIPLE_QUESTIONS = "UPDATE_MULTIPLE_QUESTIONS",
  DELETE_QUESTION = "DELETE_QUESTION",
}

export type QuestionAction =
  | { type: QuestionActionType.ADD_QUESTION; payload: Question }
  | { type: QuestionActionType.ADD_MULTIPLE_QUESTIONS; payload: Question[] }
  | { type: QuestionActionType.UPDATE_MULTIPLE_QUESTIONS; payload: Question[] }
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
  evaluate: Evaluate
  evaluateFormData: Evaluate
  evaluations: Evaluate[]
}

export enum EvaluationActionType {
  ADD_EVALUATION = "ADD_EVALUATION",
  ADD_EVALUATE = "ADD_EVALUATE",
  UPDATE_EVALUATE = "UPDATE_EVALUATE",
  ADD_QUESTION_ANSWER = "ADD_QUESTION_ANSWER",
  REMOVE_QUESTION_ANSWER = "REMOVE_QUESTION_ANSWER",
}

export interface Complex {
  nextQuestionId?: string
  choices: Choice
}

export type EvaluationAction =
  | { type: EvaluationActionType.ADD_EVALUATION; payload: Evaluation }
  | { type: EvaluationActionType.ADD_EVALUATE; payload: Evaluate }
  | { type: EvaluationActionType.UPDATE_EVALUATE; payload: Evaluate }
  | { type: EvaluationActionType.ADD_QUESTION_ANSWER; payload: Complex }
  | { type: EvaluationActionType.REMOVE_QUESTION_ANSWER; payload: string }

export interface Evaluate {
  uid: string;
  participantFirstName: string;
  participantLastName: string;
  participantEmail: string;
  participantPhone: string;
  createdAt: Timestamp
  choices?: Choice[];
  auditName?: string
  auditId?: string
  isCompleted: boolean
  count?: number;
  nextQuestionId?: string
}

export interface AuditEvaluations {
  auditUid: string
  name: string
  type: string
  condition: boolean
  welcome: string
  thank_you: string
  exclusiveList?: string[];
  status?: string,
  authorId: string
  auditCreatedAt: Timestamp

  questions?: Question[]

  uid: string;
  participantFirstName: string;
  participantLastName: string;
  participantEmail: string;
  participantPhone: string;
  createdAt?: Timestamp
  choices?: Choice[];
  auditName?: string
  auditId?: string
  isCompleted?: boolean | string
  count?: number;
}

export interface Choice {
  questionId: string
  answerId: string
  additionalNote?: string
  recommendedNote?: string
  internalNote?: string
}


export interface GroupedAudits {
  name: string;
  total: number;
}

export interface GroupedEvaluation {
  name: string;
  total: number;
}

export interface Notification {
  uid: string;
  title: string;
  action_type: string;
  action_value: string;
  message: string;
  status: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}