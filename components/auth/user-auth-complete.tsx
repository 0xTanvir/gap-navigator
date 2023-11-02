"use client"

import * as React from "react"
import * as z from "zod"

import {useRouter} from "next/navigation"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {cn} from "@/lib/utils"
import {setUser} from "@/lib/firestore/user"
import {User} from "@/types/dto"
import {userAccountCompleteSchema} from "@/lib/validations/auth"
import {buttonVariants} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {toast} from "@/components/ui/use-toast"
import {Icons} from "@/components/icons"
import {userRole} from "@/config/site";


interface UserAuthCompleteProps {
    callbackUrl: string
    firstName: string
    lastName: string
    email: string
    uid: string
}

type FormData = z.infer<typeof userAccountCompleteSchema>

export function UserAuthComplete({uid, callbackUrl, firstName, lastName, email}: UserAuthCompleteProps) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: {errors},
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
        <div className={cn("grid gap-6")}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="firstName">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            defaultValue={firstName}
                            placeholder="First Name"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="name"
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

                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="lastName">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            defaultValue={lastName}
                            placeholder="Last Name"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="name"
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

                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            defaultValue={email}
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            // disabled
                            {...register("email")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="role">
                            Account Type
                        </Label>
                        <fieldset className="mt-1">
                            <legend className="sr-only">Notification method</legend>
                            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                {userRole.map((userRole) => (
                                    <div key={userRole} className="flex items-center">
                                        <input
                                            id={userRole}
                                            type="radio"
                                            value={userRole}
                                            defaultChecked={userRole === 'client'}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            disabled={isLoading}
                                            {...register("role")}
                                        />
                                        <label htmlFor={userRole}
                                               className="ml-3 block text-sm font-medium leading-6 text-gray-900 capitalize">
                                            {userRole}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                        {errors?.role && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.role.message}
                            </p>
                        )}
                    </div>
                    <button className={cn(buttonVariants())} disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        Complete Profile
                    </button>
                </div>
            </form>
        </div>
    )
}
