import React, {useEffect, useState} from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {AuditEditorShell} from "./audit-editor-shell";
import {AuditEditorHeader} from "./audit-editor-header";
import {QuestionCreateButton} from "./question-create-button";
import {getAudit} from "@/lib/firestore/audit";
import {Audit, QuestionActionType, Questions} from "@/types/dto";
import {toast} from "sonner";
import useQuestions from "@/app/(audit)/audit/QuestionContext";
import QuestionItem from "@/app/(audit)/audit/[auditId]/question-item";
import {EmptyPlaceholder} from "@/components/dashboard/empty-placeholder";
import {getQuestionsById, updateQuestionsData} from "@/lib/firestore/question";
import {useAuth} from "@/components/auth/auth-provider";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";


interface AuditEditorProps {
    userId: string;
    auditId: string;
}

export default function QuestionList({userId, auditId}: AuditEditorProps) {
    const [audit, setAudit] = useState<Audit | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingSaveQuestions, setLoadingSaveQuestions] = useState<boolean>(false);
    const [same, setSame] = useState<boolean>(true);
    const {questions, dispatch} = useQuestions();
    const [unorderQuestions, setUnorderQuestions] = useState<Questions>([])
    const {user} = useAuth();

    const reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        // Update the id property based on the new order
        const updatedItems = result.map((item: any, index) => {
            return {...item, id: index + 1};
        });
        return updatedItems;
    };
    const handleDragAndDrop = (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedItems: any = reorder(
            questions,
            result.source.index,
            result.destination.index
        );

        dispatch({
            type: QuestionActionType.UPDATE_MULTIPLE_QUESTIONS,
            payload: reorderedItems,
        });

    };

    const handleSaveQuestions = async () => {
        setLoadingSaveQuestions(true)
        try {
            let data = await updateQuestionsData(auditId, questions);
            if (data) {
                setUnorderQuestions(questions);
                return toast.success('Questions updated successfully');
            }
        } catch (error) {
            console.error('Error updating questions:', error);

            toast.error("Something went wrong.", {
                description: "Error updating questions. Please try again later.",
            });
        } finally {
            setLoadingSaveQuestions(false)
        }
    };

    useEffect(() => {
        async function fetchAudit() {
            try {
                const dbAudit = await getAudit(auditId);
                setAudit(dbAudit);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAudit();
    }, [auditId]);

    useEffect(() => {
        async function allQuestion() {
            try {
                let dbQuestions = await getQuestionsById(auditId);
                setUnorderQuestions(dbQuestions)
                dispatch({
                    type: QuestionActionType.ADD_MULTIPLE_QUESTIONS,
                    payload: dbQuestions,
                });
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong.", {
                    description: "Failed to fetch audits. Please try again.",
                });
            } finally {
                setLoading(false);
            }
        }

        allQuestion();
    }, []);

    const areArraysOrderedSame = (orderQuestion: Questions, unOrderedQuestion: Questions) => {
        for (let i = 0; i < orderQuestion.length; i++) {
            if (orderQuestion[i].name !== unOrderedQuestion[i].name) {
                return false;
            }
        }
        return true
    };

    useEffect(() => {
        const isOrderedSame = areArraysOrderedSame(questions, unorderQuestions);
        setSame(isOrderedSame)
    }, [questions, unorderQuestions]);

    if (loading) {
        return (
            <AuditEditorShell>
                <AuditEditorHeader.Skeleton/>
                <div className="divide-border-200 mt-8 divide-y rounded-md border">
                    <QuestionItem.Skeleton/>
                    <QuestionItem.Skeleton/>
                    <QuestionItem.Skeleton/>
                    <QuestionItem.Skeleton/>
                    <QuestionItem.Skeleton/>
                </div>
            </AuditEditorShell>
        );
    }

    return (
        <AuditEditorShell>
            <Link
                href={
                    user?.role === "admin" ? `/user/audits/${audit?.authorId}` : "/audits"
                }
                className={cn(
                    buttonVariants({variant: "ghost"}),
                    "absolute left-[-150px] top-4 hidden xl:inline-flex"
                )}
            >
                <Icons.chevronLeft className="mr-2 h-4 w-4"/>
                See all audits
            </Link>

            <AuditEditorHeader
                heading={audit?.name as string}
                text={
                    user?.role === "consultant"
                        ? "Create and manage questions."
                        : "Manage questions."
                }
            >
                {user?.role === "consultant" && (
                    <>
                        {
                            !same ?
                                <div className="flex items-center">
                                    <Button
                                        variant="secondary"
                                        className="mr-4"
                                        onClick={handleSaveQuestions}
                                        disabled={loadingSaveQuestions}
                                    >
                                        {loadingSaveQuestions ? (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                        ) : (
                                            <Icons.filePlus className="mr-2 h-4 w-4"/>
                                        )}
                                        Save
                                    </Button>
                                    <QuestionCreateButton
                                        auditId={auditId as string}
                                        setUnorderQuestions={setUnorderQuestions}
                                        audit={audit}
                                    />
                                </div>
                                :
                                <QuestionCreateButton
                                    auditId={auditId as string}
                                    setUnorderQuestions={setUnorderQuestions}
                                    audit={audit}
                                />
                        }
                    </>
                )}
            </AuditEditorHeader>

            {questions.length ? (
                <DragDropContext onDragEnd={handleDragAndDrop}>
                    <div className="divide-y divide-border rounded-md border mt-8">
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}
                                >
                                    {questions.map((question, index) => (
                                        <Draggable
                                            draggableId={question.uid}
                                            index={index}
                                            key={question.uid}
                                        >
                                            {(provided) => (
                                                <div
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}
                                                    className="divide-y divide-border border !cursor-move"
                                                >
                                                    <QuestionItem
                                                        question={question}
                                                        auditId={auditId}
                                                        setUnorderQuestions={setUnorderQuestions}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                    </div>
                </DragDropContext>
            ) : (
                <EmptyPlaceholder className="mt-3">
                    <EmptyPlaceholder.Icon name="audit"/>
                    <EmptyPlaceholder.Title>No question created</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        You don&apos;t have any question yet. Start creating question.
                    </EmptyPlaceholder.Description>
                    <QuestionCreateButton
                        noQuestion={true}
                        auditId={auditId as string}
                        setUnorderQuestions={setUnorderQuestions}
                        audit={audit}
                    />
                </EmptyPlaceholder>
            )}

            <hr className="mt-12"/>
            <div className="flex justify-center py-6 lg:py-10">
                <Link
                    href={
                        user?.role === "admin"
                            ? `/user/audits/${audit?.authorId}`
                            : "/audits"
                    }
                    className={cn(buttonVariants({variant: "ghost"}))}
                >
                    <Icons.chevronLeft className="mr-2 h-4 w-4"/>
                    See all audits
                </Link>
            </div>
        </AuditEditorShell>
    );
}
