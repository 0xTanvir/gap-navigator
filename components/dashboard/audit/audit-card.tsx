import React from 'react';
import {Card} from "@/components/ui/card";
import {Icons} from "@/components/icons";
import QuestionActionsDropdown from "@/components/dashboard/audit/question-actions-dropdown";

const questions = [
    {
        id: 1,
        question_name: 'Lorem ipsum dolor sit amet 1',
    },
    {
        id: 2,
        question_name: 'Lorem ipsum dolor sit amet 2',
    },
    {
        id: 3,
        question_name: 'Lorem ipsum dolor sit amet 3',
    },
]

const AuditCard = () => {
    return (
        <>
            {
                questions.map((question) => (
                    <Card className="mb-3 last:mb-0" key={question.id}>
                        <div className="flex justify-between items-start p-6">
                            <div>
                                <div className="text-2xl font-semibold leading-none tracking-tight">
                                    {question.question_name}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad dicta eos nesciunt
                                    omnis
                                    porro soluta velit voluptates. Cupiditate, laudantium, voluptatem.
                                </p>
                            </div>
                            <QuestionActionsDropdown question={question}>
                                <Icons.moreVertical
                                    className="text-muted-foreground cursor-pointer"
                                />
                            </QuestionActionsDropdown>
                        </div>
                    </Card>
                ))
            }
        </>

    );
};

export default AuditCard;