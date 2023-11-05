"use client"

import * as React from "react"
import * as z from "zod"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { setUser } from "@/lib/firestore/user"
import { User } from "@/types/dto"
import { userAccountCompleteSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { AccountType } from "@/config/site";
import Link from "next/link";


interface UserAuthCompleteProps {
    callbackUrl: string
    firstName: string
    lastName: string
    email: string
    uid: string
}

type FormData = z.infer<typeof userAccountCompleteSchema>

export function UserAuthComplete({ uid, callbackUrl, firstName, lastName, email }: UserAuthCompleteProps) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userAccountCompleteSchema),
    })
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        // Add user to firestore
        const user: User = {
            uid: uid,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            image: "",
        }
        try {
            await setUser(uid, user)
        } catch (error: any) {
            setIsLoading(false)
            return toast({
                title: "Unable to complete profile",
                description: error.message,
            })
        }

        setIsLoading(false)
        router.push(callbackUrl)
    }

    return (
        <div className={cn("mt-6 sm:mx-auto sm:w-full sm:max-w-[480px] xl:max-w-[580px]")}>
            <div className=" px-6 py-12 shadow-xl mx-2 md:mx-0 sm:rounded-lg sm:px-12 border">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-3">
                    <div>
                        <Label className="block text-sm font-medium leading-6" htmlFor="firstName">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            variant="ny"
                            defaultValue={firstName}
                            placeholder="First Name"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="given-name"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...register("firstName")}
                        />
                        {errors?.firstName && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className="block text-sm font-medium leading-6" htmlFor="lastName">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            variant="ny"
                            defaultValue={lastName}
                            placeholder="Last Name"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="family-name"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...register("lastName")}
                        />
                        {errors?.lastName && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className="block text-sm font-medium leading-6" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            variant="ny"
                            defaultValue={email}
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            readOnly={true}
                            {...register("email")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="role" className="block text-sm font-medium leading-6">
                            Account Type
                        </Label>
                        <fieldset className="mt-2">
                            <legend className="sr-only">Notification method</legend>
                            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                {
                                    Object.keys(AccountType).map((userRole) => (
                                        <div key={userRole} className="flex items-center">
                                            <Input
                                                id={userRole.toLowerCase()}
                                                type="radio"
                                                value={userRole.toLowerCase()}
                                                defaultChecked={userRole.toLowerCase() === 'client'}
                                                className="h-4 w-4"
                                                autoComplete="role"
                                                disabled={isLoading}
                                                {...register("role")}
                                            />
                                            <Label htmlFor={userRole.toLowerCase()}
                                                className="ml-2 text-sm font-medium capitalize text-muted-foreground">
                                                {userRole}
                                            </Label>
                                        </div>
                                    ))
                                }
                            </div>
                        </fieldset>
                        {errors?.role && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <button
                            className={cn(buttonVariants(), "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm")}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Complete Profile
                        </button>
                    </div>

                </form>
            </div>
            <p className="my-5 px-4 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                    href="/terms"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    )
}
