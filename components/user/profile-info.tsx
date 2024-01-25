import React, { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFormSchema } from "@/lib/validations/profile";
import * as z from "zod";

interface ClientInfoProps {
  userId: string
  userInfo: UserInfo | null
}

interface UserInfo {
  participantFirstName: string;
  participantLastName: string;
  participantEmail: string;
  participantPhone: string;
}

type clientFormValues = z.infer<typeof clientFormSchema>;
const ProfileInfo = ({userId, userInfo}: ClientInfoProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<clientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      participantFirstName: userInfo?.participantFirstName || "",
      participantLastName: userInfo?.participantLastName || "",
      participantEmail: userInfo?.participantEmail || "",
      participantPhone: userInfo?.participantPhone || "",
    },
  });

  async function onSubmit(data: clientFormValues) {
    console.log(data)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="participantFirstName"
            disabled={isLoading}
            render={({field}) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input variant="ny" placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="participantLastName"
            disabled={isLoading}
            render={({field}) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} variant="ny" placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="participantEmail"
            disabled={isLoading}
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input variant="ny" placeholder="Please enter email" {...field} />
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="participantPhone"
            disabled={isLoading}
            render={({field}) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <Input type="tel" autoComplete="tel" variant="ny" placeholder="Please enter email" {...field} />
                <FormMessage/>
              </FormItem>
            )}
          />

          <Button
            className={cn(buttonVariants({variant: "default"}))}
            disabled={isLoading}
            type="submit"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
            Update
          </Button>
        </form>
      </Form>

    </>
  );
};

export default ProfileInfo;