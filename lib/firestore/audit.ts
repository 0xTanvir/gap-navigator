import {
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    where,
    query, getDoc
} from "firebase/firestore"
import {Collections} from './client'
import {Answer, Audit, Audits, Evaluate, Question} from "@/types/dto"
import {toast} from "@/components/ui/use-toast";

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
                authorId: data.authorId,
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

export async function getAudit(auditId: string) {
    const result = Collections.audit(auditId)
    const snap = await getDoc(result)
    return snap.data() as Audit;
}

export async function setQuestion(auditId: string, question: Question) {
    const questionsRef = Collections.question(auditId, question.uid)
    try {
        await setDoc(questionsRef, question)
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error('Failed to add the question.')
    }
}

export async function allQuestions(auditId: string) {
    try {
        const questionsRef = Collections.questions(auditId)
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
        console.error('Error fetching questions:', error);
        throw error;
    }
}

export async function singleQuestion(auditId: string, questionId: string) {
    const singleQuestionRef = Collections.questions(auditId)
    const q = query(
        singleQuestionRef,
        where('uid', '==', questionId)
    );
    const querySnapshot = await getDocs(q);

    // If no audits are found, return an empty array instead of rejecting.
    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0]; // Assuming there is only one matching document
    const data = doc.data();
    // console.log(data)
    const question: object = {
        uid: doc.id,
        name: data.name,
        answers: data.answers,
        createdAt: data.createdAt,
    };

    return question;
}

export async function updateSingleQuestionInFirebase(auditId: string, questionId: string, formData: Question) {
    const questionRef = Collections.question(auditId, questionId);

    try {
        await updateDoc(questionRef, formData as any);
        return true; // Success
    } catch (error) {
        console.error('Error updating document:', error);
        return false; // Failure
    }
}

export async function deleteSingleQuestionInFirebase(auditId: string, questionId: string) {
    const questionRef = Collections.question(auditId, questionId)
    try {
        await deleteDoc(questionRef)
    } catch (error) {
        console.error('Error deleting answer:', error);
    }
}

export async function deleteQuestionAnswer(auditId: string, questionId: string, answerId: string) {
    const questionRef = Collections.question(auditId, questionId);
    try {
        // Fetch the current question document
        const questionDoc = await getDoc(questionRef);

        if (questionDoc.exists()) {
            // Get the current answers array
            const currentAnswers = questionDoc.data()?.answers || [];

            // Filter out the answer with the specified ID
            const updatedAnswers = currentAnswers.filter((answer: Answer) => answer.uid !== answerId);

            // Update the document with the modified answers array
            await updateDoc(questionRef, {
                answers: updatedAnswers,
            });
        }
    } catch (error) {
        console.error('Error deleting answer:', error);
    }
}

export async function createQuestionAnswer(auditId: string, questionId: string, newAnswer: Answer) {
    const answerRef = Collections.question(auditId, questionId);
    try {
        await updateDoc(answerRef, {
            answers: arrayUnion(newAnswer),
        });
    } catch (error) {
        console.error('Error adding answer:', error);
    }
}

export async function updateQuestionAnswer(auditId: string, questionId: string, answerId: string, updatedAnswerData: Answer) {
    const questionAnswerRef = Collections.question(auditId, questionId);
    // Fetch the current question document
    const questionDoc = await getDoc(questionAnswerRef);

    if (questionDoc.exists()) {
        const currentAnswers = questionDoc.data().answers || [];

        // Find the index of the answer to update
        const answerIndex = currentAnswers.findIndex((answer: Answer) => answer.uid === answerId);

        if (answerIndex !== -1) {
            // Update the specific answer in the array
            currentAnswers[answerIndex] = {
                ...currentAnswers[answerIndex],
                ...updatedAnswerData,
            };

            // Update the document with the modified answers array
            await updateDoc(questionAnswerRef, {
                answers: currentAnswers,
            });

            toast({
                title: 'Answer updated successfully!',
                description: `Your answer was updated ${answerId}`,
                variant: 'default'
            })
        } else {
            toast({
                title: 'Answer not found in the DB.',
                description: `Your answer was updated ${answerId}`,
                variant: 'destructive'
            })
        }
    } else {
        toast({
            title: 'Answer document not found.',
            description: `Your answer was updated ${answerId}`,
            variant: 'destructive'
        })
    }
}

export async function setEvaluation(auditId: string, evaluation: Evaluate) {
    const evaluationsRef = Collections.evaluation(auditId, evaluation.uid)
    try {
        const evaluationRef = await setDoc(evaluationsRef, evaluation)
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error('Failed to add the question.')
    }
}

export async function unAuthenticatedUserData(auditId: string, evaluation: Evaluate) {
    const evaluationsRef = Collections.evaluations(auditId)
    const q = query(
        evaluationsRef,
        where('uid', '==', evaluation.uid)
    )
    // @ts-ignore
    const querySnapshot = await getDocs(q);
    let uid;
    if (!querySnapshot.empty) {
        // Assuming there's only one document with the specified UID
        const doc = querySnapshot.docs[0];
        uid = doc.id;
        return uid;
    } else {
        console.log('Document with the specified UID does not exist.');
        return null;
    }
}