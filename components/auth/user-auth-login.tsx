"use client"

import * as React from "react"
import * as z from "zod"

import {useSearchParams, useRouter} from "next/navigation"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {cn} from "@/lib/utils"
import {userAuthLoginSchema} from "@/lib/validations/auth"
import {buttonVariants} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {toast} from "@/components/ui/use-toast"
import {Icons} from "@/components/icons"
import {getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword} from "firebase/auth"


interface UserAuthLoginProps extends React.HTMLAttributes<HTMLDivElement> {
}

type FormData = z.infer<typeof userAuthLoginSchema>

export function UserAuthLogin({className, ...props}: UserAuthLoginProps) {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(userAuthLoginSchema),
    })
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
    const searchParams = useSearchParams()

    const handleSignInWithGoogle = async () => {
        await signInWithPopup(auth, provider).then((result) => {
            setIsGoogleLoading(false)
            setIsLoading(false)

            // TODO: force the caller to send callback url
            // get the callback url and redirect to the callback url
            router.push("/")
        }).catch((error) => {
            setIsGoogleLoading(false)
            setIsLoading(false)
            return toast({
                title: "Unable to Sign In",
                description: error.message,
            })
        })
    }


    async function onSubmit(data: FormData) {
        setIsLoading(true)
        setIsGoogleLoading(true)
        await signInWithEmailAndPassword(auth, data.email, data.password).then((result) => {
            setIsLoading(false)
            setIsGoogleLoading(false)

            // TODO: force the caller to send callback url
            // get the callback url and redirect to the callback url
            router.push("/")
        }).catch((error) => {
            setIsLoading(false)
            setIsGoogleLoading(false)
            return toast({
                title: "Unable to Sign Up",
                description: error.message,
            })
        })

        setIsLoading(false)
        setIsGoogleLoading(false)
    }

    return (
        <div className={cn("mt-6 sm:mx-auto sm:w-full sm:max-w-[480px] ", className)} {...props}>
            <div className="px-6 py-12 shadow sm:rounded-lg sm:px-12 border">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                    <div>
                        <label htmlFor="email" className=" block text-sm font-medium leading-6">
                            Email
                        </label>
                        <div className="mt-2">
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading || isGoogleLoading}
                                {...register("email")}
                            />
                            {errors?.email && (
                                <p className="px-1 mt-1.5 text-xs">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6">
                            Password
                        </label>
                        <div className="mt-2">
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect="off"
                                disabled={isLoading || isGoogleLoading}
                                {...register("password")}
                            />
                            {errors?.password && (
                                <p className="px-1 mt-1.5 text-xs">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-sm leading-6">
                            <a href="#" className="font-semibold">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            className={cn(buttonVariants(), "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm")}
                            disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Sign In
                        </button>
                    </div>
                </form>

                <div>
                    <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-black py-2 rounded text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-0 gap-4">
                        <button
                            type="button"
                            className={cn(buttonVariants({variant: "outline"}))}
                            onClick={() => {
                                setIsLoading(true)
                                setIsGoogleLoading(true)
                                handleSignInWithGoogle()
                            }}
                            disabled={isLoading || isGoogleLoading}
                        >
                            {isGoogleLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            ) : (
                                <Icons.google className="mr-2 h-4 w-4"/>
                            )}{" "}
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
