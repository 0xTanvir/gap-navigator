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


interface UserAuthCompleteProps {
    callbackUrl: string
    fullName: string
    email: string
    uid: string
}

type FormData = z.infer<typeof userAccountCompleteSchema>

export function UserAuthComplete({ uid, callbackUrl, fullName, email }: UserAuthCompleteProps) {
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
            email: data.email,
            fullName: data.fullName,
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
        <div className={cn("grid gap-6")} >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="name">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue={fullName}
                            placeholder="Full Name"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="name"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...register("fullName")}
                        />
                        {errors?.fullName && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.fullName.message}
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
                        <Label className="sr-only" htmlFor="role">
                            Account Type
                        </Label>
                        <Input
                            id="role"
                            placeholder="Account Type"
                            type="text"
                            autoCapitalize="none"
                            disabled={isLoading}
                            {...register("role")}
                        />
                        {errors?.role && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.role.message}
                            </p>
                        )}
                    </div>
                    <button className={cn(buttonVariants())} disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Complete Profile
                    </button>
                </div>
            </form>
        </div>
    )
}
