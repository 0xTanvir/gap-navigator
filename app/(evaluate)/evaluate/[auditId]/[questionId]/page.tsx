"use client";
import { DocsPageHeader } from "@/app/(evaluate)/preview/page-header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { evaluationQuestionListSchema } from "@/lib/validations/question";
import * as z from "zod";
import {
  EvaluatePager,
  getPagerForQuestions,
} from "@/app/(evaluate)/evaluate/[auditId]/[questionId]/pager";
import { useAuth } from "@/components/auth/auth-provider";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { Choice, Complex, Evaluate, EvaluationActionType } from "@/types/dto";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getEvaluationById,
  updateEvaluation,
  updateEvaluationById
} from "@/lib/firestore/evaluation";
import dynamic from "next/dynamic";
import { EvaluateControlPager } from "@/app/(evaluate)/evaluate/[auditId]/[questionId]/evaluate-control-pager";
import _ from 'lodash';

const Editor = dynamic(() => import("@/components/editorjs/editor"), {
  ssr: false,
});
type FormData = z.infer<typeof evaluationQuestionListSchema>;

export default function EvaluateQuestionPage({
                                               params,
                                             }: {
  params: { auditId: string; questionId: string };
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageLoader, setPageLoader] = useState<boolean>(true);
  const [singleEvaluation, setSingleEvaluation] = useState<Evaluate | null>(null)
  const {evaluation, dispatch} = useEvaluation();
  const {user} = useAuth();
  const router = useRouter();
  const {questionId, auditId} = params;
  const question = evaluation?.questions?.find(
    (question) => question.uid === questionId
  );

  // console.log(evaluation)

  const pager = getPagerForQuestions(questionId, evaluation);

  let formDefaultValues = {
    answerId:
      evaluation?.evaluate?.choices?.find(
        (choice) => choice.questionId === questionId
      )?.answerId || undefined,
    additionalNote:
      evaluation?.evaluate?.choices?.find(
        (choice) => choice.questionId === questionId
      )?.additionalNote || "",
    recommendedNote:
      evaluation?.evaluate?.choices?.find(
        (choice) => choice.questionId === questionId
      )?.recommendedNote || "",
    internalNote:
      evaluation?.evaluate?.choices?.find(
        (choice) => choice.questionId === questionId
      )?.internalNote || "",
  };
  const handleEditorRecommendedNote = (data: any) => {
    if (data.length > 0) {
      form.setValue("recommendedNote", JSON.stringify(data));
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(evaluationQuestionListSchema),
    defaultValues: formDefaultValues,
  });

  async function onSubmit(data: FormData) {
    let newEvaluate: Choice;
    if (user) {
      newEvaluate = {
        questionId: questionId,
        answerId: data.answerId,
        additionalNote: data.additionalNote || "",
        recommendedNote: data.recommendedNote || "",
        internalNote: data.internalNote || "",
      };
    } else {
      newEvaluate = {
        questionId: questionId,
        answerId: data.answerId,
        additionalNote: data.additionalNote || "",
      };
    }

    // Move to the next page if an answer is selected
    const hasAnswerSelected = data.answerId !== undefined; // Check if an answer is selected

    if (evaluation.condition) {
      if (hasAnswerSelected) {
        let questionId = question?.answers.find(answer => answer.uid === data.answerId)?.questionId
        let newData: Complex = {
          nextQuestionId: questionId,
          choices: newEvaluate
        }
        dispatch({
          type: EvaluationActionType.ADD_QUESTION_ANSWER,
          payload: newData,
        });

        if (!questionId) {
          let isExist = _.find(evaluation.evaluate?.choices, function (o: Choice) {
            return o.questionId === newEvaluate.questionId;
          });
          if (isExist === undefined) {
            let choices = evaluation.evaluate.choices || [];
            let index = _.findIndex(choices, {questionId: newEvaluate.questionId})
            if (index !== -1) {
              choices[index] = newEvaluate
            } else {
              choices.push(newEvaluate)
            }
            let evaluateData = {
              ...evaluation.evaluateFormData,
              choices: choices,
              isCompleted: true
            }
            dispatch({
              type: EvaluationActionType.UPDATE_EVALUATE,
              payload: evaluateData,
            });
            setIsLoading(true)
            await updateEvaluation(auditId, evaluateData)
            await updateEvaluationById(auditId, evaluation.evaluate.uid, choices as Choice[], questionId);
            router.push(`/evaluate/${auditId}/completed`)
          } else {
            let isEqual = _.isEqual(isExist, newEvaluate);
            if (isEqual) {
              router.push(`/evaluate/${auditId}/completed`)
            } else {
              let choices = evaluation.evaluate.choices || []
              let index = _.findIndex(choices, {answerId: newEvaluate.answerId});
              choices[index] = newEvaluate;
              setIsLoading(true)
              let evaluateData = {
                ...evaluation.evaluate,
                choices: choices,
                isCompleted: true
              }
              dispatch({
                type: EvaluationActionType.UPDATE_EVALUATE,
                payload: evaluateData,
              });
              await updateEvaluation(auditId, evaluateData)
              await updateEvaluationById(auditId, evaluation.evaluate.uid, choices as Choice[], questionId);
              router.push(`/evaluate/${auditId}/completed`)
            }
          }

        } else if (pager.next && !pager.next.disabled) {
          if (evaluation.evaluate.choices?.length === 0) {
            setIsLoading(true)
            await updateEvaluationById(auditId, evaluation.evaluate.uid, [newEvaluate], questionId);
            router.push(`/evaluate/${auditId}/${questionId}`)
          } else {
            let isExists = _.some(evaluation.evaluate?.choices, function (o: Choice) {
              return o.answerId === newEvaluate.answerId &&
                o.internalNote === newEvaluate.internalNote &&
                o.recommendedNote === newEvaluate.recommendedNote &&
                o.additionalNote === newEvaluate.additionalNote &&
                o.questionId === newEvaluate.questionId;
            });
            if (isExists) {
              router.push(`/evaluate/${auditId}/${questionId}`)
            } else {
              let choices = evaluation.evaluate.choices || [];
              let index = _.findIndex(choices, {answerId: newEvaluate.answerId});
              if (index !== -1) {
                // Object with the same answerId exists, check if all properties match
                let isSame = _.isEqual(choices[index], newEvaluate);
                if (!isSame) {
                  // Properties do not match, update the object at this index
                  choices[index] = newEvaluate;
                }
              } else {
                // No object with the same answerId exists, add newEvaluate to the array
                let index = _.findIndex(choices, {questionId: newEvaluate.questionId})
                if (index !== -1) {
                  choices[index] = newEvaluate
                  let urlParts = pager.next.href.split("/")
                  let urlId = urlParts[urlParts.length - 1]
                  const exists = _.some(choices, {questionId: urlId});
                  if (exists) {
                    if (urlId !== questionId) {
                      _.remove(choices, (item) => item.questionId === urlId);
                    }
                  }
                } else {
                  choices.push(newEvaluate)
                }
              }
              setIsLoading(true)
              await updateEvaluationById(auditId, evaluation.evaluate.uid, choices as Choice[], questionId);
              router.push(`/evaluate/${auditId}/${questionId}`)
            }
          }
        } else if (pager.next.disabled) {
          let isExists = _.some(singleEvaluation?.choices, function (o: Choice) {
            return o.answerId === newEvaluate.answerId &&
              o.internalNote === newEvaluate.internalNote &&
              o.recommendedNote === newEvaluate.recommendedNote &&
              o.additionalNote === newEvaluate.additionalNote &&
              o.questionId === newEvaluate.questionId;
          });
          if (isExists) {
            router.push(`/evaluate/${auditId}/${questionId}`)
          } else {
            let choices = singleEvaluation?.choices || [];
            let index = _.findIndex(choices, {questionId: newEvaluate.questionId});
            if (index !== -1) {
              // Object with the same answerId exists, check if all properties match
              let isSame = _.isEqual(choices[index], newEvaluate);
              if (!isSame) {
                // Properties do not match, update the object at this index
                choices[index] = newEvaluate;
                setIsLoading(true)
                await updateEvaluationById(auditId, evaluation.evaluate.uid, choices as Choice[], questionId);
                router.push(`/evaluate/${auditId}/${questionId}`)
              }
            } else {
              choices.push(newEvaluate)
              setIsLoading(true)
              await updateEvaluationById(auditId, evaluation.evaluate.uid, choices as Choice[], questionId);
              router.push(`/evaluate/${auditId}/${questionId}`)
            }
          }
        }
        setIsLoading(false);
      }
    } else {
      if (hasAnswerSelected) {
        let url = pager.next.href.split("/")
        let questionId = url[url.length - 1] === 'undefined' ? "" : url[url.length - 1]
        let newData: Complex = {
          nextQuestionId: questionId,
          choices: newEvaluate
        }
        dispatch({
          type: EvaluationActionType.ADD_QUESTION_ANSWER,
          payload: newData,
        });
        if (pager.next && !pager.next.disabled) {
          let isExist = _.some(singleEvaluation?.choices, function (o: Choice) {
            return o.answerId === newEvaluate.answerId &&
              o.internalNote === newEvaluate.internalNote &&
              o.recommendedNote === newEvaluate.recommendedNote &&
              o.additionalNote === newEvaluate.additionalNote &&
              o.questionId === newEvaluate.questionId;
          });
          if (!isExist) {
            let choices = singleEvaluation?.choices || [];
            let index = _.findIndex(choices, {answerId: newEvaluate.answerId});
            if (index !== -1) {
              // Object with the same answerId exists, check if all properties match
              let isSame = _.isEqual(choices[index], newEvaluate);
              if (!isSame) {
                // Properties do not match, update the object at this index
                choices[index] = newEvaluate;
              }
            } else {
              // No object with the same answerId exists, add newEvaluate to the array
              let index = _.findIndex(choices, {questionId: newEvaluate.questionId})
              if (index !== -1) {
                choices[index] = newEvaluate
              } else {
                choices.push(newEvaluate)
              }
            }
            setIsLoading(true);
            await updateEvaluationById(auditId, evaluation.evaluate.uid, choices as Choice[], newData.nextQuestionId);
          }
          router.push(pager.next.href);
        } else if (pager.next.disabled) {
          let isExist = _.some(singleEvaluation?.choices, function (o: Choice) {
            return o.answerId === newEvaluate.answerId &&
              o.internalNote === newEvaluate.internalNote &&
              o.recommendedNote === newEvaluate.recommendedNote &&
              o.additionalNote === newEvaluate.additionalNote &&
              o.questionId === newEvaluate.questionId;
          });
          if (isExist) {
            router.push(`/evaluate/${auditId}/completed`)
          } else {
            setIsLoading(true)
            let choices = singleEvaluation?.choices || [];
            let index = _.findIndex(choices, {questionId: newEvaluate.questionId});
            if (index !== -1) {
              // Object with the same answerId exists, check if all properties match
              let isSame = _.isEqual(choices[index], newEvaluate);
              if (!isSame) {
                // Properties do not match, update the object at this index
                choices[index] = newEvaluate;
                setIsLoading(true)
                let evaluateData = {
                  ...evaluation.evaluateFormData,
                  choices: choices,
                  isCompleted: true
                }
                dispatch({
                  type: EvaluationActionType.UPDATE_EVALUATE,
                  payload: evaluateData,
                });
                await updateEvaluation(auditId, evaluateData)
                await updateEvaluationById(auditId, evaluation.evaluate.uid, choices as Choice[], questionId);
                router.push(`/evaluate/${auditId}/completed`)
              }
            } else {
              choices.push(newEvaluate)
              let evaluateData = {
                ...evaluation.evaluateFormData,
                choices: choices,
                isCompleted: true
              }
              dispatch({
                type: EvaluationActionType.UPDATE_EVALUATE,
                payload: evaluateData,
              });
              await updateEvaluation(auditId, evaluateData)
              await updateEvaluationById(auditId, evaluation.evaluate.uid, choices as Choice[], questionId);
              router.push(`/evaluate/${auditId}/completed`)
            }
          }
        }
        setIsLoading(false)
      }
    }
  }

  const handleNextClick = () => {
    // Trigger form submission logic
    form.handleSubmit(onSubmit)();
  };

  async function fetchEvaluation() {
    try {
      const dbEvaluation = await getEvaluationById(evaluation.evaluate.auditId as string, evaluation.evaluate.uid)
      setSingleEvaluation(dbEvaluation)
    } catch (e) {
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    } finally {
      setPageLoader(false)
    }
  }

  useEffect(() => {
    if (Object.entries(evaluation.evaluate).length === 0) {
      router.push(`/evaluate/${auditId}`);
    }
  }, [evaluation, auditId, router]);

  useEffect(() => {
    fetchEvaluation()
  }, []);

  if (pageLoader) {
    return (
      <div className="py-6 lg:py-10">
        <DocsPageHeader
          heading={question?.name ?? "Question not found"}
          id={String(question?.id)}
          text="Please choose from the following answers:"
        />
        {question?.answers?.length ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="answerId"
                render={({field}) => (
                  <FormItem className="space-y-1">
                    {/* TODO: when evaluate happens, then this should be populated
                                        a defaultValue={already - answered - value} if answer already seated */}
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="mt-4 grid grid-cols-1 gap-y-6 sm:gap-x-4"
                      disabled={true}
                    >
                      {question.answers.map((answer, index) => (
                        <FormItem
                          key={answer.uid}
                          className={`rounded-lg border shadow-sm focus:outline-none grid grid-cols-12 space-x-0 space-y-0 w-full ${
                            form.getValues("answerId") === answer.uid
                              ? "border-indigo-600 ring-2 ring-indigo-600"
                              : "border-gray-300"
                          }`}
                        >
                          <FormControl style={{display: "none"}}>
                            <RadioGroupItem value={answer.uid}/>
                          </FormControl>
                          <FormLabel
                            className="font-normal block text-sm cursor-pointer col-span-11 py-2.5 px-1.5">
                            {index + 1 + ". "}
                            {answer.name}
                          </FormLabel>

                          {/* Custom check icon */}
                          {form.getValues("answerId") === answer.uid && (
                            <div
                              className="text-green-500 col-span-1 grid place-content-center mr-0.5">
                              {/* Replace the content below with your custom check icon */}
                              <Icons.checkCircle2 size={20}/>
                            </div>
                          )}
                        </FormItem>
                      ))}
                    </RadioGroup>

                    {form.formState.errors.answerId && (
                      <p className="text-red-500">
                        {form.formState.errors.answerId.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalNote"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Additional Note</FormLabel>
                    <FormControl>
                      <Textarea
                        variant="ny"
                        placeholder="Share your thoughts and additional details..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              {user?.role === "consultant" && (
                <>
                  <FormField
                    control={form.control}
                    name="recommendedNote"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Recommended Note</FormLabel>
                        <FormControl>
                          <Editor
                            onSave={handleEditorRecommendedNote}
                            initialData={
                              formDefaultValues.recommendedNote !== ""
                                ? JSON.parse(formDefaultValues.recommendedNote)
                                : ""
                            }
                            id="recommendedNote"
                            placeHolder="Provide your recommended insights and suggestions..."
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="internalNote"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Internal Note</FormLabel>
                        <FormControl>
                          <Textarea
                            variant="ny"
                            placeholder="Add internal notes or confidential information..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <EvaluatePager
                handleNextClick={handleNextClick}
                isLoading={isLoading}
                currentQuestion={questionId}
              />
            </form>
          </Form>
        ) : (
          <p>Answers not found.</p>
        )}
      </div>
    )
  }


  return (
    <div className="py-6 lg:py-10">
      <DocsPageHeader
        heading={question?.name ?? "Question not found"}
        id={String(question?.id)}
        text="Please choose from the following answers:"
      />
      {question?.answers?.length ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="answerId"
              render={({field}) => (
                <FormItem className="space-y-1">
                  {/* TODO: when evaluate happens, then this should be populated
                                        a defaultValue={already - answered - value} if answer already seated */}
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="mt-4 grid grid-cols-1 gap-y-6 sm:gap-x-4"
                  >
                    {question.answers.map((answer, index) => (
                      <FormItem
                        key={answer.uid}
                        className={`rounded-lg border shadow-sm focus:outline-none grid grid-cols-12 space-x-0 space-y-0 w-full ${
                          form.getValues("answerId") === answer.uid
                            ? "border-indigo-600 ring-2 ring-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        <FormControl style={{display: "none"}}>
                          <RadioGroupItem value={answer.uid}/>
                        </FormControl>
                        <FormLabel
                          className="font-normal block text-sm cursor-pointer col-span-11 py-2.5 px-1.5">
                          {index + 1 + ". "}
                          {answer.name}
                        </FormLabel>

                        {/* Custom check icon */}
                        {form.getValues("answerId") === answer.uid && (
                          <div
                            className="text-green-500 col-span-1 grid place-content-center mr-0.5">
                            {/* Replace the content below with your custom check icon */}
                            <Icons.checkCircle2 size={20}/>
                          </div>
                        )}
                      </FormItem>
                    ))}
                  </RadioGroup>

                  {form.formState.errors.answerId && (
                    <p className="text-red-500">
                      {form.formState.errors.answerId.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalNote"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Additional Note</FormLabel>
                  <FormControl>
                    <Textarea
                      variant="ny"
                      placeholder="Share your thoughts and additional details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            {user?.role === "consultant" && (
              <>
                <FormField
                  control={form.control}
                  name="recommendedNote"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Recommended Note</FormLabel>
                      <FormControl>
                        <Editor
                          onSave={handleEditorRecommendedNote}
                          initialData={
                            formDefaultValues.recommendedNote !== ""
                              ? JSON.parse(formDefaultValues.recommendedNote)
                              : ""
                          }
                          id="recommendedNote"
                          placeHolder="Provide your recommended insights and suggestions..."
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="internalNote"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Internal Note</FormLabel>
                      <FormControl>
                        <Textarea
                          variant="ny"
                          placeholder="Add internal notes or confidential information..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </>
            )}

            {
              evaluation.condition ?
                <EvaluatePager
                  handleNextClick={handleNextClick}
                  isLoading={isLoading}
                  currentQuestion={questionId}
                /> :
                <EvaluateControlPager
                  handleNextClick={handleNextClick}
                  isLoading={isLoading}
                  currentQuestion={questionId}
                />
            }
          </form>
        </Form>
      ) : (
        <p>Answers not found.</p>
      )}
    </div>
  );
}
