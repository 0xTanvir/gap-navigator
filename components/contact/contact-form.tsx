"use client"
import React from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {contactSchema} from "@/lib/validations/contact";
import * as z from "zod";
import {toast} from "@/components/ui/use-toast";

type FormData = z.infer<typeof contactSchema>
const ContactForm = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(contactSchema)
    })

    async function onSubmit(data: FormData) {
        setIsLoading(true)

        setTimeout(() => {
            reset()
            setIsLoading(false)
            toast({variant: 'success', title: "Form submitted successfully", description: ''})
        }, 5000)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
                <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div>
                            <Label
                                htmlFor="first_name"
                                className="block text-sm font-semibold leading-6">
                                First name
                            </Label>
                            <div className="mt-2.5">
                                <Input
                                    id="first_name"
                                    variant="ny"
                                    placeholder="First Name"
                                    type="text"
                                    autoComplete="given-name"
                                    disabled={isLoading}
                                    {...register('firstName')}
                                />
                                {errors?.firstName && (
                                    <p className="px-1 mt-1.5 text-xs">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label
                                htmlFor="last_name"
                                className="block text-sm font-semibold leading-6">
                                Last name
                            </Label>
                            <div className="mt-2.5">
                                <Input
                                    variant="ny"
                                    type="text"
                                    id="last_name"
                                    placeholder="Last Name"
                                    autoComplete="family-name"
                                    disabled={isLoading}
                                    {...register('lastName')}
                                />
                                {errors?.lastName && (
                                    <p className="px-1 mt-1.5 text-xs">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <Label htmlFor="email"
                                   className="block text-sm font-semibold leading-6">
                                Email
                            </Label>
                            <div className="mt-2.5">
                                <Input
                                    id="email"
                                    variant="ny"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoComplete="email"
                                    disabled={isLoading}
                                    {...register("email")}
                                />
                                {errors?.email && (
                                    <p className="px-1 mt-1.5 text-xs">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <Label htmlFor="phone"
                                   className="block text-sm font-semibold leading-6">
                                Phone number
                            </Label>
                            <div className="mt-2.5">
                                <Input
                                    variant="ny"
                                    type="tel"
                                    placeholder="Phone number"
                                    id="phone"
                                    autoComplete="tel"
                                    disabled={isLoading}
                                    {...register('phone')}
                                />
                                {errors?.phone && (
                                    <p className="px-1 mt-1.5 text-xs">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <Label htmlFor="message"
                                   className="block text-sm font-semibold leading-6">
                                Message
                            </Label>
                            <div className="mt-2.5">
                                <Textarea
                                    id="message"
                                    variant="ny"
                                    placeholder="Message ..."
                                    autoCapitalize="none"
                                    autoComplete="message"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    {...register('message')}
                                />
                                {errors?.message && (
                                    <p className="px-1 mt-1.5 text-xs">
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <Button
                            type="submit"
                            className="rounded-md"
                            disabled={isLoading}
                        >
                            Send message
                        </Button>
                    </div>
                </div>
            </form>

        </>
    );
};

export default ContactForm;