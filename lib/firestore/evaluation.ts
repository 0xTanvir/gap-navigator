import { Choice, Evaluate } from "@/types/dto";
import { Collections } from "@/lib/firestore/client";
import { arrayUnion, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
            await updateDoc(evaluationRef, {
                choices: arrayUnion(newChoice),
            });
        } else {
            throw new Error("Evaluation document not found");
        }
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error("Failed to update the evaluation with a new choice.");
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