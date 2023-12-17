"use client"
import React from 'react';
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { sendPasswordResetEmail } from "@firebase/auth";
import * as z from "zod";
import { userAuthRestPasswordSchema } from "@/lib/validations/auth";
import { getAuth } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

interface UserAuthResetPasswordProps extends React.HTMLAttributes<HTMLDivElement> {
}

type FormData = z.infer<typeof userAuthRestPasswordSchema>
const UserAuthResetPassword = ({className, ...props}: UserAuthResetPasswordProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const auth = getAuth()
    const router = useRouter()
    const {user} = useAuth()
    const form = useForm<FormData>({
        resolver: zodResolver(userAuthRestPasswordSchema)
    })

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        await sendPasswordResetEmail(auth, data.email)
            .then((result) => {
                setIsLoading(false)
                toast({
                    title: "Email send successfully",
                    variant: "success"
                })
                router.push("/login")
            }).catch((error) => {
                setIsLoading(false)
                return toast({
                    title: "Something went wrong.",
                    variant: "error",
                    description: error.message,
                })
            })
    }

    if (user) {
        router.push("/")
    }

    return (
        <div className={cn("mt-6 sm:mx-auto sm:w-full sm:max-w-[480px] xl:max-w-[580px]", className)} {...props}>
            <div className="px-6 py-12 shadow-xl mx-2 md:mx-0 sm:rounded-lg sm:px-12 border">

                <div className="mb-3 space-y-3">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Forgot your password?
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Please enter your email
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name={"email"}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input variant="ny" placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div>
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
                            >
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                )}
                                Reset Password
                            </button>
                        </div>
                    </form>
                </Form>
            </div>

        </div>
    );
};

export default UserAuthResetPassword;