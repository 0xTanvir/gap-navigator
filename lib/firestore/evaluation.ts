import { Audit, AuditEvaluations, Choice, Evaluate, Question } from "@/types/dto";
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

export async function updateEvaluation(auditId: string, evaluation: any) {
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
  newChoices: Choice[],
  nextQuestionId?: string
) {
  const evaluationRef = Collections.evaluation(auditId, evaluationId);
  try {
    await updateDoc(evaluationRef, {
      nextQuestionId: nextQuestionId,
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
          nextQuestionId: data.nextQuestionId
        } as Evaluate
      });
    } else {
      return [];
    }
  } catch (error) {
    throw new Error('Error getting evaluations:');
  }
}

export async function getAllCompletedEvaluations(auditId: string) {
  const evaluationsRef = Collections.evaluations(auditId);
  const q = query(evaluationsRef, where("isCompleted", "==", true));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const evaluations = querySnapshot.docs.map((doc) => {
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
          nextQuestionId: data.nextQuestionId
        };
      });

      // Assuming all evaluations have the same auditName, so we take the first one's auditName
      const auditName = evaluations[0]?.auditName;

      return {auditName, evaluations};
    } else {
      return {auditName: undefined, evaluations: []};
    }
  } catch (error) {
    console.error('Error getting evaluations:', error);
    throw new Error('Error getting evaluations');
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
        nextQuestionId: data.nextQuestionId
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
          nextQuestionId: data.nextQuestionId
        } as Evaluate
      });
    } else {
      return [];
    }
  } catch (error) {
    throw new Error('Error getting evaluations:');
  }
}

export async function getEvaluationWithUseInfoAndEvaluations(auditIds: string[], evaluationID: string) {
  const evaluations: Evaluate[] = [];
  let userInfo: any = {};

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
        nextQuestionId: data.nextQuestionId
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


export async function getAuditsEvaluationByIds(auditIds: string[], evaluationID: string): Promise<AuditEvaluations[]> {
  const auditEvaluations: AuditEvaluations[] = [];

  for (const auditId of auditIds) {
    const auditResult = Collections.audit(auditId);
    const auditSnap = await getDoc(auditResult);

    if (auditSnap.exists()) {
      const auditData = auditSnap.data() as Audit;

      const evaluationsRef = Collections.evaluation(auditData.uid, evaluationID);
      const questionsRef = Collections.questions(auditId);
      const snap = await getDocs(questionsRef)
      const evalDocSnapshot = await getDoc(evaluationsRef);
      if (evalDocSnapshot.exists()) {
        const evalData = evalDocSnapshot.data();
        const questionData = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: data.id,
            uid: doc.id,
            name: data.name,
            answers: data.answers.sort((a: any, b: any) => a.createdAt.seconds - b.createdAt.seconds),
            createdAt: data.createdAt,
          } as Question;
        });

        const auditEvaluation: AuditEvaluations = {

          auditUid: auditData.uid,
          name: auditData.name,
          type: auditData.type,
          condition: auditData.condition,
          welcome: auditData.welcome,
          thank_you: auditData.thank_you,
          exclusiveList: auditData.exclusiveList,
          status: auditData.status,
          authorId: auditData.authorId,
          auditCreatedAt: auditData.createdAt,
          questions: questionData,
          uid: evalData.uid,
          participantFirstName: evalData.participantFirstName,
          participantLastName: evalData.participantLastName,
          participantEmail: evalData.participantEmail,
          participantPhone: evalData.participantPhone,
          auditId: evalData.auditId,
          auditName: evalData.auditName,
          isCompleted: evalData.isCompleted,
          choices: evalData.choices,
          createdAt: evalData.createdAt,
        };

        auditEvaluations.push(auditEvaluation);
      } else {
        const evalData = evalDocSnapshot.data();
        if (evalData === undefined) {

          const auditEvaluation: AuditEvaluations = {
            auditUid: auditData.uid,
            name: auditData.name,
            type: auditData.type,
            condition: auditData.condition,
            welcome: auditData.welcome,
            thank_you: auditData.thank_you,
            exclusiveList: auditData.exclusiveList,
            status: auditData.status,
            authorId: auditData.authorId,
            auditCreatedAt: auditData.createdAt,

            uid: "",
            participantFirstName: "",
            participantLastName: "",
            participantEmail: "",
            participantPhone: "",
            auditId: "",
            auditName: "",
            choices: [],
            isCompleted: "invited"
          };
          auditEvaluations.push(auditEvaluation);
        }
      }
    }
  }

  return auditEvaluations;
}

export async function getAuditsEvaluationById(auditId: string, evaluationID: string) {
  const auditResult = Collections.audit(auditId);
  const auditSnap = await getDoc(auditResult);
  if (!auditSnap.exists()) {
    return null; // Audit does not exist
  }
  const auditData = auditSnap.data() as Audit;
  const evaluationsRef = Collections.evaluations(auditData.uid);
  const evalQuery = query(evaluationsRef, where("uid", "==", evaluationID));
  const evalDocSnapshot = await getDocs(evalQuery);

  if (evalDocSnapshot.empty) {
    return null; // Evaluation does not exist
  }

  // Assuming there's only one evaluation based on ID, directly access the first document
  const evalData = evalDocSnapshot.docs[0].data();

  const questionsRef = Collections.questions(auditId);
  const snap = await getDocs(questionsRef);
  const questionData = snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: data.id,
      uid: doc.id,
      name: data.name,
      answers: data.answers?.sort((a: any, b: any) => a.createdAt.seconds - b.createdAt.seconds),
      createdAt: data.createdAt,
    } as Question;
  });

  // Assuming there can be multiple evaluations, but based on your function it seems you're expecting only one
  // If you're expecting only one, consider adjusting the logic to directly access the first document
  const evaluationsData = {
    auditUid: auditData.uid,
    name: auditData.name,
    type: auditData.type,
    condition: auditData.condition,
    welcome: auditData.welcome,
    thank_you: auditData.thank_you,
    exclusiveList: auditData.exclusiveList,
    status: auditData.status,
    authorId: auditData.authorId,
    auditCreatedAt: auditData.createdAt,
    questions: questionData,
    uid: evalData.uid,
    participantFirstName: evalData.participantFirstName,
    participantLastName: evalData.participantLastName,
    participantEmail: evalData.participantEmail,
    participantPhone: evalData.participantPhone,
    auditId: evalData.auditId,
    auditName: evalData.auditName,
    isCompleted: evalData.isCompleted,
    choices: evalData.choices,
    createdAt: evalData.createdAt,
  };
  return evaluationsData;
}
