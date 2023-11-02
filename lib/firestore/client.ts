import { collection } from "firebase/firestore"
import { db } from '@/firebase'

export const Collections = {
    users: collection(db, "users"),
    audits: collection(db, "audits"),
}