"use client";

import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { AuditEditorShell } from "../audit-editor-shell";
import { AuditEditorHeader } from "../audit-editor-header";
import AnswerList from "./answer-list";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import { useEffect } from "react";
import { getQuestionsById } from "@/lib/firestore/question";
import { QuestionActionType } from "@/types/dto";
import { toast } from "sonner";

export default function QuestionPage({
                                       params,
                                     }: {
  params: { auditId: string; questionId: string };
}) {
  const {user, isAuthenticated, loading} = useAuth();
  const {dispatch} = useQuestions();
  const router = useRouter()
  useEffect(() => {
    async function allQuestion() {
      try {
        let dbQuestions = await getQuestionsById(params.auditId);
        dispatch({
          type: QuestionActionType.ADD_MULTIPLE_QUESTIONS,
          payload: dbQuestions,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch audits. Please try again.");
      }
    }

    allQuestion();
  }, []);
  if (loading) {
    return (
      <AuditEditorShell>
        <AuditEditorHeader.Skeleton/>
      </AuditEditorShell>
    );
  } else if (
    (isAuthenticated && user && user.role === "consultant") ||
    (isAuthenticated && user && user.role === "admin")
  ) {
    return (
      <>
        <AnswerList
          userId={user.uid}
          questionId={params.questionId}
          auditId={params.auditId}
        />
      </>
    );
  } else if (!isAuthenticated || !user) {
    router.push("/")
  } else {
    return notFound();
  }
}
