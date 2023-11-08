import { collection, CollectionReference, DocumentReference, doc } from "firebase/firestore"
import { db } from '@/firebase'

// Define an enum for your collection names
enum CollectionName {
    Users = "users",
    Audits = "audits",
}

// Utility functions using the enum for collection names
export const Collections = {
    users(): CollectionReference {
        return collection(db, CollectionName.Users);
    },
    user(userId: string): DocumentReference {
        return doc(db, CollectionName.Users, userId);
    },
    audits(userId: string): CollectionReference {
        return collection(db, CollectionName.Users, userId, CollectionName.Audits);
    },
    audit(userId: string, auditId: string): DocumentReference {
        return doc(db, CollectionName.Users, userId, CollectionName.Audits, auditId);
    },
}
