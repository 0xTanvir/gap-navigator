import { Collections } from "@/lib/firestore/client";
import { arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import { Answer } from "@/types/dto";

export async function setQuestionAnswer(auditId: string, questionId: string, newAnswer: Answer) {
    const answerRef = Collections.question(auditId, questionId);
    try {
        await updateDoc(answerRef, {
            answers: arrayUnion(newAnswer),
        });
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error("Error adding answer");
    }
}


export async function updateQuestionAnswerById(
    auditId: string,
    questionId: string,
    answerId: string,
    updatedAnswerData: Answer
) {
    const questionAnswerRef = Collections.question(auditId, questionId);

    try {
        // Fetch the current question document
        const questionDoc = await getDoc(questionAnswerRef);

        if (questionDoc.exists()) {
            const currentAnswers = questionDoc.data().answers || [];

            // Find the index of the answer to update
            const answerIndex = currentAnswers.findIndex(
                (answer: Answer) => answer.uid === answerId
            );

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
                return true
            } else {
                return false
            }
        }
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error("Answer document not found.");
    }
}


export async function deleteAnswerById(auditId: string, questionId: string, answerId: string) {
    const questionRef = Collections.question(auditId, questionId);
    try {
        // Fetch the current question document
        const questionDoc = await getDoc(questionRef);

        if (questionDoc.exists()) {
            // Get the current answers array
            const currentAnswers = questionDoc.data()?.answers || [];

            // Filter out the answer with the specified ID
            const updatedAnswers = currentAnswers.filter(
                (answer: Answer) => answer.uid !== answerId
            );

            // Update the document with the modified answers array
            await updateDoc(questionRef, {
                answers: updatedAnswers,
            });
        }
    } catch (error) {
        // If error is an instance of Error, rethrow it
        if (error instanceof Error) {
            throw error;
        }
        // If it's not an Error instance, throw a new Error object
        throw new Error("Error deleting answer");
    }
}
