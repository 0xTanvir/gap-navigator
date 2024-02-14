"use client";

import * as z from "zod";
import * as React from "react";

import { Timestamp } from "firebase/firestore";
import { setAudit } from "@/lib/firestore/audit";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Audit, AuditActionType } from "@/types/dto";
import { auditSchemaStep1, auditSchemaStep2, auditSchemaStep3 } from "@/lib/validations/audit";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useAudits from "./AuditsContext";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editorjs/editor"), {
  ssr: false,
});
const EditorData = dynamic(() => import("@/components/editorjs/editor"), {
  ssr: false,
});

type FormDataStep1 = z.infer<typeof auditSchemaStep1>;
type FormDataStep2 = z.infer<typeof auditSchemaStep2>;
type FormDataStep3 = z.infer<typeof auditSchemaStep3>;

interface AuditCreateButtonProps extends ButtonProps {
  userId: string;
}

interface AuditData {
  auditName: string;
  auditType: string;
  condition: boolean;
  welcome: string;
  thank_you: string;
}

export function AuditCreateButton({
                                    userId,
                                    className,
                                    variant,
                                    ...props
                                  }: AuditCreateButtonProps) {
  const {dispatch} = useAudits();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = React.useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [auditFormData, setAuditFormData] = useState<AuditData | null>(null)

  const {user, updateUser} = useAuth();
  const router = useRouter();

  const formStep1 = useForm<FormDataStep1>({
    resolver: zodResolver(auditSchemaStep1),
    defaultValues: {
      auditName: auditFormData?.auditName || "",
      auditType: auditFormData?.auditType || "",
      condition: auditFormData?.condition || false,
    },
  });
  const formStep2 = useForm<FormDataStep2>({
    resolver: zodResolver(auditSchemaStep2),
    defaultValues: {
      welcome: auditFormData?.welcome || "",
    },
  });
  const formStep3 = useForm<FormDataStep3>({
    resolver: zodResolver(auditSchemaStep3),
    defaultValues: {
      thank_you: auditFormData?.thank_you || "",
    },
  });

  const handleEditorSave = (data: any) => {
    setIsTyping(true);
    setTimeout(() => {
      if (!isTyping) {
        formStep2.trigger("welcome");
      }
    }, 1);

    if (data.length > 0) {
      formStep2.setValue("welcome", JSON.stringify(data));
    } else {
      formStep2.setValue("welcome", JSON.stringify(undefined));
    }
  };
  const handleEditorThank_YouData = (data: any) => {
    setIsTyping(true);
    setTimeout(() => {
      if (!isTyping) {
        formStep3.trigger("thank_you");
      }
    }, 1);

    if (data.length > 0) {
      formStep3.setValue("thank_you", JSON.stringify(data));
    } else {
      formStep3.setValue("thank_you", JSON.stringify(undefined));
    }
  };

  const next = () => {
    setCurrent(prevState => prevState + 1);
  }

  const prev = () => {
    setCurrent(prevState => prevState - 1);
  };

  const onFinishStep1 = (data: FormDataStep1) => {
    setAuditFormData((prev) => ({...prev as AuditData, ...data}));
    next()
  };
  const onFinishStep2 = (data: FormDataStep2) => {
    setAuditFormData((prev) => ({...prev as AuditData, ...data}));
    next()
  };

  async function onSubmit(data: FormDataStep3) {
    setIsLoading(true);
    try {
      const audit: Audit = {
        name: auditFormData?.auditName as string,
        type: auditFormData?.auditType as string,
        condition: auditFormData?.condition as boolean,
        welcome: auditFormData?.welcome === undefined ? "" : auditFormData?.welcome as string,
        thank_you: data?.thank_you === undefined ? "" : data?.thank_you as string,
        uid: uuidv4(),
        authorId: userId,
        createdAt: Timestamp.now(),
      };

      await setAudit(userId, audit);
      dispatch({type: AuditActionType.ADD_AUDIT, payload: audit});
      user?.audits.push(audit.uid);
      updateUser(user);
      router.push(`/audit/${audit.uid}`);

      return toast.success("Audit created.", {
        description: `Your audit was created with id ${audit.uid}.`,
      });
    } catch (error) {
      // Handle the error, which could come from the setAudit
      return toast.error("Something went wrong.", {
        description: "Your audit was not created. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setShowAddDialog(false);
      formStep1.reset();
      formStep2.reset();
      formStep3.reset();
      setAuditFormData(null)
      setCurrent(0)
    }
  }

  return (
    <>
      <Button variant={variant} onClick={() => setShowAddDialog(true)}>
        <Icons.filePlus className="mr-2 h-4 w-4"/>
        New audit
      </Button>

      <Sheet open={showAddDialog} onOpenChange={setShowAddDialog}>
        <SheetContent className="sm:max-w-[80vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add audit</SheetTitle>
            <SheetDescription>
              Type audit name, choose an audit type and type audit description.
            </SheetDescription>
          </SheetHeader>

          {
            current === 0 ? (
                <Form {...formStep1}>
                  <form onSubmit={formStep1.handleSubmit(onFinishStep1)}>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={formStep1.control}
                        name="auditName"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                variant="ny"
                                placeholder="Audit Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formStep1.control}
                        name="auditType"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an audit type"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="exclusive">Exclusive</SelectItem>
                                <SelectItem value="public">Public</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Only public type can be sharable with client. Private
                              type is only for consultant.
                            </FormDescription>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formStep1.control}
                        name="condition"
                        render={({field}) => (
                          <FormItem>
                            <div className="relative flex items-start">
                              <div className="flex h-6 items-center">
                                <input
                                  id="condition"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                  {...formStep1.register("condition")}
                                />
                              </div>
                              <div className="ml-3 text-sm leading-6">
                                <label htmlFor="condition" className="font-medium">
                                  Mark it as a conditional audit.
                                </label>
                              </div>
                            </div>
                            <FormDescription>
                              Conditional audit can have different sequence of question based on answer choice,
                              where non conditional audit is linear sequence.
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                    </div>

                    <SheetFooter>
                      <button
                        type="submit"
                        className={cn(
                          buttonVariants({variant: "default"}),
                          className
                        )}
                        disabled={isLoading}
                        {...props}
                      >
                        Next
                      </button>
                    </SheetFooter>
                  </form>
                </Form>
              ) :
              current === 1 ? (
                  <Form {...formStep2}>
                    <form onSubmit={formStep2.handleSubmit(onFinishStep2)}>
                      <div className="grid gap-4 py-4">
                        <FormField
                          control={formStep2.control}
                          name="welcome"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Welcome</FormLabel>
                              <FormControl>
                                <Editor
                                  id="welcome"
                                  initialData={
                                    auditFormData?.welcome === "" ? auditFormData.welcome :
                                      auditFormData?.welcome !== undefined
                                        ? JSON.parse(auditFormData?.welcome as string)
                                        : ""
                                  }
                                  onSave={handleEditorSave}
                                  placeHolder="Let`s write welcome page details!"
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                      </div>

                      <SheetFooter style={{justifyContent: "space-between"}}>
                        <Button
                          onClick={prev}
                        >
                          Prev
                        </Button>

                        <button
                          type="submit"
                          className={cn(
                            buttonVariants({variant: "default"}),
                            className
                          )}
                          {...props}
                        >
                          Next
                        </button>
                      </SheetFooter>
                    </form>
                  </Form>
                ) :
                current === 2 ? (
                  <Form {...formStep3}>
                    <form onSubmit={formStep3.handleSubmit(onSubmit)}>
                      <div className="grid gap-4 py-4">
                        <FormField
                          control={formStep3.control}
                          name="thank_you"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Thank You</FormLabel>
                              <FormControl>
                                <EditorData
                                  id="thank_you"
                                  initialData={
                                    auditFormData?.thank_you === "" ? auditFormData.thank_you :
                                      auditFormData?.thank_you !== undefined
                                        ? JSON.parse(auditFormData?.thank_you as string)
                                        : ""
                                  }
                                  onSave={handleEditorThank_YouData}
                                  placeHolder="Let`s write thank you page details!"
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div style={{justifyContent: "space-between", display: 'flex'}}>
                        <Button
                          onClick={prev}
                        >
                          Prev
                        </Button>

                        <button
                          type="submit"
                          className={cn(
                            buttonVariants({variant: "default"}),
                            {
                              "cursor-not-allowed opacity-60": isLoading,
                            },
                            className
                          )}
                          disabled={isLoading}
                          {...props}
                        >
                          {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                          ) : (
                            <Icons.filePlus className="mr-2 h-4 w-4"/>
                          )}
                          Submit
                        </button>
                      </div>
                    </form>
                  </Form>
                ) : null
          }

        </SheetContent>
      </Sheet>
    </>
  );
}
