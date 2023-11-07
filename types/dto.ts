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