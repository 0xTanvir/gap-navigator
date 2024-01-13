import {Answer, Question} from "@/types/dto";
import {Collections} from "@/lib/firestore/client";
import {deleteDoc, getDocs, query, setDoc, updateDoc, where, orderBy, Timestamp} from "firebase/firestore";

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
        const snap = await getDocs(query(questionsRef, orderBy("createdAt", 'asc')));
        const questions: Question[] = snap.docs.map((doc) => {
            const data = doc.data();
            return {
                id: data.id,
                uid: doc.id,
                name: data.name,
                answers: data.answers.sort((a: any, b: any) => a.createdAt.seconds - b.createdAt.seconds),
                createdAt: data.createdAt,
            } as Question;
        });
        return questions.sort((a, b) => a.id - b.id);
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
    const question: Question = {
        id: data.id,
        uid: doc.id,
        name: data.name,
        answers: data.answers.sort((a: any, b: any) => a.createdAt.seconds - b.createdAt.seconds),
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

export async function updateQuestionsData(auditId: string, newData: Question[]) {
    const questionsRef = Collections.questions(auditId);
    try {
        // Get all documents in the "questions" collection
        const querySnapshot = await getDocs(questionsRef);

        // Update each document with the new data
        querySnapshot.docs.map(async (doc) => {
            const questionId = doc.data().id;
            const updatedData = newData.find(question => question.id === questionId);

            if (updatedData) {
                await updateDoc(doc.ref, {
                    id: updatedData.id,
                    uid: updatedData.uid,
                    name: updatedData.name,
                    answers: updatedData.answers,
                    createdAt: updatedData.createdAt,
                });
            }
        });
        return true
    } catch (error) {
        throw new Error('Error updating documents: ' + error);
    }
}

