import {
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    where,
    query
} from "firebase/firestore"
import {Collections} from './client'
import {Audit, Audits} from "@/types/dto"

/// Audit ///
export async function getAuditsByIds(userAuditsId: string[]): Promise<Audits> {
    if (userAuditsId.length > 0) {
        const userAuditsCollectionRef = Collections.audits();
        const q = query(
            userAuditsCollectionRef,
            where('uid', 'in', userAuditsId)
        );

        const querySnapshot = await getDocs(q);

        // If no audits are found, return an empty array instead of rejecting.
        if (querySnapshot.empty) {
            return [];
        }
        const audits: Audit[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                uid: doc.id,
                name: data.name,
                type: data.type,
                createdAt: data.createdAt,
            } as Audit;
        });
        return audits
    } else {
        return []
    }
}

export async function setAudit(userId: string, audit: Audit): Promise<void> {
    const newAuditRef = Collections.audit(audit.uid)
    const createAuditsUser = Collections.userAudits(userId)
    try {
        await setDoc(newAuditRef, audit)
        await updateDoc(createAuditsUser, {
            audits: arrayUnion(newAuditRef.id),
        });
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error('Failed to add the audit.')
    }
}

export async function deleteAudit(userId: string, auditId: string) {
    const auditRef = Collections.audit(auditId)
    const userRef = Collections.userAudits(userId)
    try {
        await deleteDoc(auditRef)
        await updateDoc(userRef, {
            audits: arrayRemove(auditId),
        });
    } catch (error) {
        // Check if the error is an instance of Error and throw it directly if so
        if (error instanceof Error) {
            throw error
        }

        // Otherwise, throw a new Error with a default or generic message
        // or convert the unknown error to string if possible
        throw new Error("An error occurred while deleting the audit.")
    }
}
