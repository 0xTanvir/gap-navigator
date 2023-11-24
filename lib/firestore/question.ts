import { Question } from "@/types/dto";
import { Collections } from "@/lib/firestore/client";
import { deleteDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

export async function setQuestion(auditId: string, question: Question) {
    const questionsRef = Collections.question(auditId, question.uid);
    try {
        await setDoc(questionsRef, question);
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error("Failed to add the question.");
    }
}

export async function getQuestionsById(auditId: string) {
    try {
        const questionsRef = Collections.questions(auditId);
        const snap = await getDocs(questionsRef);
        const questions: Question[] = snap.docs.map((doc) => {
            const data = doc.data();
            return {
                uid: doc.id,
                name: data.name,
                answers: data.answers,
                createdAt: data.createdAt,
            } as Question;
        });
        return questions;
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Error fetching questions");
    }
}

export async function getQuestionById(auditId: string, questionId: string) {
    const singleQuestionRef = Collections.questions(auditId);
    const q = query(singleQuestionRef, where("uid", "==", questionId));
    const querySnapshot = await getDocs(q);

    // If no audits are found, return an empty array instead of rejecting.
    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0]; // Assuming there is only one matching document
    const data = doc.data();
    const question: object = {
        uid: doc.id,
        name: data.name,
        answers: data.answers,
        createdAt: data.createdAt,
    };

    return question;
}

export async function updateQuestionById(auditId: string, questionId: string, formData: Question) {
    const questionRef = Collections.question(auditId, questionId);

    try {
        await updateDoc(questionRef, formData as any);
        return true; // Success
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Error updating document");
    }
}

export async function deleteQuestionById(auditId: string, questionId: string) {
    const questionRef = Collections.question(auditId, questionId);
    try {
        await deleteDoc(questionRef);
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Error deleting question");
    }
}
