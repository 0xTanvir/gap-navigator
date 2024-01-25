"use client";
import React, { useEffect, useState } from "react";
import { DocsPageHeader } from "@/app/(evaluate)/preview/page-header";
import { EmptyPlaceholder } from "@/components/dashboard/empty-placeholder";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import useEvaluation from "@/app/(evaluate)/evaluate/evaluate-context";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { evaluateParticipant } from "@/lib/validations/question";
import * as z from "zod";

import { Audit, EvaluationActionType } from "@/types/dto";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import Output from "editorjs-react-renderer";
import { CodeBlockRenderer, ImageBlock, style } from "@/components/editorjs/editorjs-utils";
import "@/components/editorjs/editorjs.css"
import { setEvaluation } from "@/lib/firestore/evaluation";
import { getAudit } from "@/lib/firestore/audit";

type FormData = z.infer<typeof evaluateParticipant>;

export default function EvaluatePage({
                                       params,
                                     }: {
  params: { auditId: string };
}) {
  const [audit, setAudit] = useState<Audit | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const {evaluation, dispatch} = useEvaluation();
  const router = useRouter();
  const {auditId} = params;
  let data = {
    time: Date.now(),
    blocks: evaluation.welcome ? JSON.parse(evaluation.welcome) : [],
    version: "2.0.0"
  };

  const renderers = {
    code: CodeBlockRenderer,
    image: ImageBlock
  };

  const form = useForm<FormData>({
    resolver: zodResolver(evaluateParticipant),
    defaultValues: {
      participantFirstName: "",
      participantLastName: "",
      participantEmail: "",
      participantPhone: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    let evaluate = {
      uid: data.participantEmail,
      participantFirstName: data.participantFirstName,
      participantLastName: data.participantLastName,
      participantEmail: data.participantEmail,
      participantPhone: data.participantPhone ? data.participantPhone : "",
      auditId: auditId,
      auditName: audit?.name,
      createdAt: Timestamp.now(),
    };

    const emailExists = evaluation.evaluations.find(
      (item) => item.uid === data.participantEmail
    );

    if (emailExists) {
      setIsLoading(false)
      dispatch({
        type: EvaluationActionType.ADD_EVALUATE,
        payload: emailExists,
      });
      form.reset();
      setShowDialog(false);
      if (evaluation.questions.length > 0) {
        router.push(`/evaluate/${auditId}/${evaluation.questions[0]?.uid}`);
      }
      toast.info("This email evaluation already created.");
    } else {
      dispatch({
        type: EvaluationActionType.ADD_EVALUATE,
        payload: evaluate,
      });
      form.reset();
      await setEvaluation(auditId, evaluate);
      setIsLoading(false)
      setShowDialog(false);
      toast.info("Evaluation start.");
      if (evaluation.questions.length > 0) {
        router.push(
          `/evaluate/${params.auditId}/${evaluation.questions[0]?.uid}`
        );
      }
    }
  }

  async function fetchAuditData() {
    try {
      let dbAudit = await getAudit(auditId)
      setAudit(dbAudit)
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.", {
        description: "Failed to fetch audits. Please try again.",
      });
    }
  }

  useEffect(() => {
    fetchAuditData()
  }, []);

  return (
    <div className="py-6 lg:py-10">
      <DocsPageHeader
        heading={evaluation.name}
        text={"Complete this audit to generate your report."}
      />
      {
        evaluation.welcome !== "" &&
          <div className="w-full text-end mb-2">
              <Button
                  size="lg"
                  className="text-sm font-semibold rounded-full"
                  onClick={() => setShowDialog(true)}
              >
                  Lets Get Started
              </Button>
          </div>
      }
      {
        evaluation.welcome ?
          <div className="editorjs">
            <Output data={data} style={style} renderers={renderers}/>
          </div>
          :
          <EmptyPlaceholder>
            <Image
              src="/images/audit-start.svg"
              alt="audit start image"
              width={480}
              height={270}
              className="rounded-md transition-colors"
            />
            <EmptyPlaceholder.Title>
              Total {evaluation.questions.length}
              {evaluation.questions.length >= 2 ? " Questions" : " Question"}
            </EmptyPlaceholder.Title>

            <Button
              size="xl"
              className="mt-8 text-sm font-semibold rounded-full"
              onClick={() => setShowDialog(true)}
            >
              Lets Get Started
            </Button>
          </EmptyPlaceholder>
      }

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[625px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add Information</DialogTitle>
                <DialogDescription>
                  Type Participant First Name, Last Name Email and Phone Number.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="participantFirstName"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            variant="ny"
                            placeholder="Participant First Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="participantLastName"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            variant="ny"
                            placeholder="Participant Last Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="participantEmail"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          variant="ny"
                          placeholder="Participant Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="participantPhone"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          variant="ny"
                          placeholder="Participant Phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <button
                  type="submit"
                  className={cn(buttonVariants({variant: "default"}), {
                    "cursor-not-allowed opacity-60": isLoading,
                  })}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                  ) : (
                    <Icons.filePlus className="mr-2 h-4 w-4"/>
                  )}
                  Save
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

EvaluatePage.Skeleton = function EvaluatePageSkeleton() {
  return (
    <EmptyPlaceholder className="mt-4">
      <Image
        src="/images/audit-start.svg"
        alt="audit start image"
        width={480}
        height={270}
        className="rounded-md transition-colors"
      />
      <div className="mt-6 text-xl font-semibold flex">
        Total <Skeleton className="w-28 ml-2"/>
      </div>
      <Button
        disabled={true}
        size="xl"
        className="mt-8 text-sm font-semibold rounded-full"
      >
        Lets Get Started
      </Button>
    </EmptyPlaceholder>
  );
};
