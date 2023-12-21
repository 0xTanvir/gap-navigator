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
import { auditSchema } from "@/lib/validations/audit";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type FormData = z.infer<typeof auditSchema>;

interface AuditCreateButtonProps extends ButtonProps {
  userId: string;
}

export function AuditCreateButton({
  userId,
  className,
  variant,
  ...props
}: AuditCreateButtonProps) {
  const { dispatch } = useAudits();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = React.useState<boolean>(false);
  const { user, updateUser } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      auditName: "",
      auditType: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const audit: Audit = {
        name: data.auditName,
        type: data.auditType,
        uid: uuidv4(),
        authorId: userId,
        createdAt: Timestamp.now(),
      };

      const auditId = await setAudit(userId, audit);
      dispatch({ type: AuditActionType.ADD_AUDIT, payload: audit });
      user?.audits.push(audit.uid);
      updateUser(user);
      form.reset();

      return toast({
        title: "Audit created successfully.",
        description: `Your audit was created with id ${auditId}.`,
        variant: "success"
      });
    } catch (error) {
      // Handle the error, which could come from the setAudit
      return toast({
        title: "Something went wrong.",
        description: "Your audit was not created. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowAddDialog(false);
    }
  }

  return (
    <>
      <Button variant={variant} onClick={() => setShowAddDialog(true)}>
        <Icons.filePlus className="mr-2 h-4 w-4" />
        New audit
      </Button>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add audit</DialogTitle>
                <DialogDescription>
                  Type audit name and choose an audit type.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="auditName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input variant="ny" placeholder="Audit Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="auditType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an audit type" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <button
                  type="submit"
                  // onClick={onClick}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    {
                      "cursor-not-allowed opacity-60": isLoading,
                    },
                    className
                  )}
                  disabled={isLoading}
                  {...props}
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.filePlus className="mr-2 h-4 w-4" />
                  )}
                  Add audit
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
