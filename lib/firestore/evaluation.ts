import { Choice, Evaluate } from "@/types/dto";
import { Collections } from "@/lib/firestore/client";
import { arrayUnion, getDoc, getDocs, query, setDoc, updateDoc } from "firebase/firestore";

export async function setEvaluation(auditId: string, evaluation: Evaluate) {
    const evaluationsRef = Collections.evaluation(auditId, evaluation.uid);
    try {
        await setDoc(evaluationsRef, evaluation);
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error("Failed to add the question.");
    }
}

export async function updateEvaluationById(
    auditId: string,
    evaluationId: string,
    newChoice: Choice
) {
    const evaluationRef = Collections.evaluation(auditId, evaluationId);
    try {
        // Get the existing evaluation document
        const evaluationDoc = await getDoc(evaluationRef);

        if (evaluationDoc.exists()) {
            const existingEvaluation = evaluationDoc.data() as Evaluate;

            const updatedChoices = [...(existingEvaluation?.choices ?? [])];
            const indexToUpdate = updatedChoices.findIndex(choice => choice.questionId === newChoice.questionId);

            if (indexToUpdate !== -1) {
                updatedChoices[indexToUpdate].answerId = newChoice.answerId;
            } else {
                updatedChoices.push(newChoice);
            }

            await updateDoc(evaluationRef, {
                choices: updatedChoices
            });
        } else {
            throw new Error('Evaluation document not found');
        }
    } catch (error) {
        console.error('Error updating evaluation:', error);
        throw new Error('Failed to update the evaluation with a new answer.');
    }
}


export async function getEvaluationById(
    auditId: string,
    evaluationID: string
): Promise<Evaluate> {
    const evaluationsRef = Collections.evaluation(auditId, evaluationID);
    const querySnapshot = await getDoc(evaluationsRef);

    return querySnapshot.data() as Evaluate;
}

export async function getAllEvaluations(auditId: string) {
    const evaluationsRef = Collections.evaluations(auditId);
    const q = query(evaluationsRef);

    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    uid: doc.id,
                    participantFirstName: data.participantFirstName,
                    participantLastName: data.participantLastName,
                    participantEmail: data.participantEmail,
                    choices: data.choices,
                } as Evaluate
            });
        } else {
            return [];
        }
    } catch (error) {
        throw new Error('Error getting evaluations:');
    }
}

export async function getEvaluationByIds(auditIds: string[], evaluationID: string): Promise<Evaluate[]> {
    const evaluations: Evaluate[] = [];

    // Iterate through each auditId
    for (const auditId of auditIds) {
        const evaluationsRef = Collections.evaluation(auditId, evaluationID);
        const docSnapshot = await getDoc(evaluationsRef);

        // If the document exists, add it to the evaluations array
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const evaluation: Evaluate = {
                uid: data.uid,
                participantFirstName: data.participantFirstName,
                participantLastName: data.participantLastName,
                participantEmail: data.participantEmail,
                choices: data.choices,
            };
            evaluations.push(evaluation);
        }
    }
    return evaluations;
}