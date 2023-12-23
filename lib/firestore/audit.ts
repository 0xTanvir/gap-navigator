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
  where, startAfter, endBefore, limitToLast
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

export async function updateAuditUser(userId: string, auditId: string) {
  const auditRef = Collections.audit(auditId);
  const userRef = Collections.userAudits(userId);
  try {
    await updateDoc(auditRef, {
      exclusiveList: arrayRemove(userId),
    });
    await updateDoc(userRef, {
      invitedAuditsList: arrayRemove(auditId),
    });
    return true
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

export async function fetchAuditsWithCount(searchName?: string): Promise<{ audits: Audits; totalCount: number }> {
  const auditsCollectionRef = Collections.audits();
  let queryRef
  if (searchName) {
    queryRef = query(auditsCollectionRef, where("name", "==", searchName));
  } else {
    queryRef = query(auditsCollectionRef);
  }

  const querySnapshots = await getDocs(queryRef);

  // If no audits are found, return an empty array instead of rejecting.
  if (querySnapshots.empty) {
    return {audits: [], totalCount: 0};
  }

  const audits = querySnapshots.docs.map((doc) => {
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

  const totalCount = querySnapshots.size;

  return {audits, totalCount};
}


export async function fetchPaginatedData(entity_object: any) {
  const {
    collection, records_limit, pageAction, page, fields, orderByField, orderByOrder,
    last_index: afterThis, first_index: beforeThis, whereFields
  } = entity_object

  const collectionRef = Collections.audits()
  let queryRef = query(collectionRef)

  let searchValue: boolean = false
  if (whereFields && whereFields.length > 0) {
    whereFields.forEach((whereObj: any) => {
      if (whereObj.value) {
        queryRef = query(queryRef, where(whereObj.name, '==', whereObj.value))
        searchValue = true
      }
    })
  }

  if (page > 1) {
    if (pageAction === "NEXT") {
      queryRef = query(collectionRef, orderBy(orderByField, orderByOrder), startAfter(afterThis), limit(records_limit))
    }
    if (pageAction === "PREVIOUS") {
      queryRef = query(collectionRef, orderBy(orderByField, orderByOrder), endBefore(beforeThis), limitToLast(records_limit))
    }
  } else {
    if (!searchValue) {
      queryRef = query(collectionRef, orderBy(orderByField, orderByOrder), limit(records_limit))
      searchValue = false
    }
  }


  const querySnapshots = await getDocs(queryRef);

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
