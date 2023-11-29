"use client"

import React, { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { profileFormSchema } from "@/lib/validations/profile";
import { useAuth } from "@/components/auth/auth-provider";
import { updateDoc } from "firebase/firestore"
import { Collections } from "@/lib/firestore/client";
import { updateUserProfile } from "@/lib/firestore/user";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
    const [loader, setLoader] = useState<boolean>(false)
    const {user, loading} = useAuth()
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        mode: "onChange",
    })

    async function onSubmit(data: ProfileFormValues) {
        setLoader(true)
        try {
            await updateUserProfile(user?.uid as string, {
                firstName: data.firstName,
                lastName: data.lastName,
            })
            toast({
                title: "Profile Updated successfully",
                variant: "success"
            })
            setLoader(false)
        } catch (error) {
            console.error("Error updating user profile:", error);
            toast({
                title: "Error updating user profile",
                variant: "error"
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        if (!loading && user) {
            form.reset({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
            });
        }
    }, [loading, user, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="firstName"
                    disabled={loader || loading}
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
                    name="lastName"
                    disabled={loader || loading}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input variant="ny" placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    disabled={true}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Input variant="ny" placeholder="Please enter email" {...field} />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button
                    className={cn(buttonVariants({variant: "default"}))}
                    disabled={loader || loading}
                    type="submit">
                    {loader && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                    Update Profile
                </Button>
            </form>
        </Form>
    )
}