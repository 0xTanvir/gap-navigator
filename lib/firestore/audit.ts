import {
    arrayRemove,
    arrayUnion,
    deleteDoc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { Collections } from "./client";
import { Audit, Audits } from "@/types/dto";

export async function getAuditsByIds(userAuditsId: string[], status: string = ""): Promise<Audits> {
    if (userAuditsId.length > 0) {
        const userAuditsCollectionRef = Collections.audits();
        const q = query(userAuditsCollectionRef, where("uid", "in", userAuditsId));

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
                exclusiveList: data.exclusiveList ? data.exclusiveList : [],
                status: data.status ? data.status : "",
                authorId: data.authorId,
                createdAt: data.createdAt,
            } as Audit;
        });
        // Dynamic status filtering
        const filteredAudits = audits.filter((audit) => audit.status === status)
        return filteredAudits.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    } else {
        return [];
    }
}

export async function setAudit(userId: string, audit: Audit): Promise<void> {
    const newAuditRef = Collections.audit(audit.uid);
    const createAuditsUser = Collections.userAudits(userId);
    try {
        await setDoc(newAuditRef, audit);
        await updateDoc(createAuditsUser, {
            audits: arrayUnion(newAuditRef.id),
        });
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error("Failed to add the audit.");
    }
}

export async function deleteAudit(userId: string, auditId: string) {
    const auditRef = Collections.audit(auditId);
    const userRef = Collections.userAudits(userId);
    try {
        await deleteDoc(auditRef);
        await updateDoc(userRef, {
            audits: arrayRemove(auditId),
        });
    } catch (error) {
        // Check if the error is an instance of Error and throw it directly if so
        if (error instanceof Error) {
            throw error;
        }

        // Otherwise, throw a new Error with a default or generic message
        // or convert the unknown error to string if possible
        throw new Error("An error occurred while deleting the audit.");
    }
}

export async function getAudit(auditId: string) {
    const result = Collections.audit(auditId);
    const snap = await getDoc(result);
    return snap.data() as Audit;
}

export async function getAudits(pageSize: number = 10): Promise<Audits> {
    const auditsCollectionRef = Collections.audits();
    let q = query(auditsCollectionRef, orderBy("createdAt", 'asc'), limit(pageSize))

    const querySnapshots = await getDocs(q);

    // If no audits are found, return an empty array instead of rejecting.
    if (querySnapshots.empty) {
        return [];
    }
    return querySnapshots.docs.map((doc) => {
        const data = doc.data();
        return {
            uid: doc.id,
            name: data.name,
            type: data.type,
            exclusiveList: data.exclusiveList ? data.exclusiveList : [],
            status: data.status ? data.status : "",
            authorId: data.authorId,
            createdAt: data.createdAt,
        } as Audit;
    });
}
