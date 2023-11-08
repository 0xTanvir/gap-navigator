import { getDocs, setDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { Collections } from './client'
import { Audit, Audits } from "@/types/dto"

/// Audit ///
export async function getAuditsByUserId(userId: string): Promise<Audits> {
    if (!userId) {
        throw new Error(`Invalid user id: ${userId}`)
    }

    const userAuditsCollectionRef = Collections.audits(userId)
    const auditsSnap = await getDocs(userAuditsCollectionRef)

    // If no audits are found, return an empty array instead of rejecting.
    if (auditsSnap.empty) {
        return []
    }

    const audits: Audit[] = auditsSnap.docs.map(doc => {
        const data = doc.data();
        // Ensure the audit object has the right structure, including type assertion if necessary.
        return {
            uid: doc.id,
            name: data.name,
            type: data.type,
            createdAt: data.createdAt,
        } as Audit // Cast as we are sure about the structure to handle the validation properly.
    })

    return audits
}

export async function setAudit(userId: string, audit: Audit): Promise<string> {
    const newAuditRef = Collections.audit(userId, audit.uid)
    try {
        await setDoc(newAuditRef, audit)
        return newAuditRef.id
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
    const auditRef = Collections.audit(userId, auditId)
    try {
        await deleteDoc(auditRef)
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