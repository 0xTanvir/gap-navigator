"use client"

import React, {useEffect, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {profileFormSchema} from "@/lib/validations/profile";
import {useAuth} from "@/components/auth/auth-provider";
import {updateDoc} from "firebase/firestore"
import {Collections} from "@/lib/firestore/client";

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
            const userDocRef = Collections.user(user?.uid as string);
            await updateDoc(userDocRef, {
                firstName: data.firstName,
                lastName: data.lastName,
            })
            toast({
                title: "Profile Updated successfully",
            })
            setLoader(false)
        } catch (error) {
            console.error("Error updating user profile:", error);
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
                <Button disabled={loader || loading} type="submit">Update Profile</Button>
            </form>
        </Form>
    )
}