import { Choice, Evaluate } from "@/types/dto";
import { Collections } from "@/lib/firestore/client";
import { arrayUnion, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { getAudit } from "@/lib/firestore/audit";

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
    throw new Error("Failed to add the evaluation.");
  }
}

export async function updateEvaluation(auditId: string, evaluation:any) {
  const evaluationsRef = Collections.evaluation(auditId, evaluation.uid);
  try {
    await updateDoc(evaluationsRef, evaluation);
  } catch (error) {
    // If error is an instance of Error, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    // If it's not an Error instance, throw a new Error object
    throw new Error("Failed to update the evaluation.");
  }
}

export async function updateEvaluationById(
  auditId: string,
  evaluationId: string,
  newChoices: Choice[]
) {
  const evaluationRef = Collections.evaluation(auditId, evaluationId);
  try {
    await updateDoc(evaluationRef, {
      choices: newChoices
    });
  } catch (error: any) {
    console.error('Error updating evaluation:', error);
    throw new Error(`Failed to update the evaluation with new answers. Details: ${error.message}`);
  }
}


// export async function updateEvaluationById(
//     auditId: string,
//     evaluationId: string,
//     newChoice: Choice
// ) {
//     const evaluationRef = Collections.evaluation(auditId, evaluationId);
//     try {
//         // Get the existing evaluation document
//         const evaluationDoc = await getDoc(evaluationRef);
//
//         if (evaluationDoc.exists()) {
//             const existingEvaluation = evaluationDoc.data() as Evaluate;
//
//             const updatedChoices = [...(existingEvaluation?.choices ?? [])];
//             const indexToUpdate = updatedChoices.findIndex(choice => choice.questionId === newChoice.questionId);
//
//             if (indexToUpdate !== -1) {
//                 updatedChoices[indexToUpdate].answerId = newChoice.answerId;
//             } else {
//                 updatedChoices.push(newChoice);
//             }
//
//             await updateDoc(evaluationRef, {
//                 choices: updatedChoices
//             });
//         } else {
//             throw new Error('Evaluation document not found');
//         }
//     } catch (error) {
//         console.error('Error updating evaluation:', error);
//         throw new Error('Failed to update the evaluation with a new answer.');
//     }
// }


export async function getEvaluationById(
  auditId: string,
  evaluationID: string
): Promise<Evaluate | null> {
  const evaluationsRef = Collections.evaluations(auditId);
  try {
    const q = query(evaluationsRef, where("uid", "==", evaluationID));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    // Assuming there is only one user with a given evaluationID
    const evaluationDoc = querySnapshot.docs[0];
    const evaluationData = evaluationDoc.data();
    return evaluationData as Evaluate;
  } catch (error) {
    throw new Error('Error getting user');
  }
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
          participantPhone: data.participantPhone,
          auditId: data.auditId,
          auditName: data.auditName,
          isCompleted: data.isCompleted,
          createdAt: data.createdAt,
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
        participantPhone: data.participantPhone,
        auditId: data.auditId,
        auditName: data.auditName,
        isCompleted: data.isCompleted,
        createdAt: data.createdAt,
        choices: data.choices,
      };
      evaluations.push(evaluation);
    }
  }
  return evaluations;
}

export async function getAllEvaluationWithAuditName(auditId: string) {
  const dbAudit = await getAudit(auditId)
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
          participantPhone: data.participantPhone,
          auditId: data.auditId,
          auditName: data.auditName,
          isCompleted: data.isCompleted,
          createdAt: data.createdAt,
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

export async function getEvaluationWithUseInfoAndEvaluations(auditIds: string[], evaluationID: string){
  const evaluations: Evaluate[] = [];
  let userInfo:any = {};

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
        participantPhone: data.participantPhone,
        auditId: data.auditId,
        auditName: data.auditName,
        isCompleted: data.isCompleted,
        createdAt: data.createdAt,
        choices: data.choices,
      };
      userInfo = {
        participantFirstName: data.participantFirstName,
        participantLastName: data.participantLastName,
        participantEmail: data.participantEmail,
        participantPhone: data.participantPhone,
      }
      evaluations.push(evaluation);
    }
  }
  return {userInfo, evaluations};
}
