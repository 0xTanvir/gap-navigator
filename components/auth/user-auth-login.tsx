"use client"

import * as React from "react"
import * as z from "zod"

import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { userAuthLoginSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"


interface UserAuthLoginProps extends React.HTMLAttributes<HTMLDivElement> { }

type FormData = z.infer<typeof userAuthLoginSchema>

export function UserAuthLogin({ className, ...props }: UserAuthLoginProps) {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
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
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
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
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
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
                            <p className="px-1 text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <button className={cn(buttonVariants())} disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Email
                    </button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }))}
                onClick={() => {
                    setIsLoading(true)
                    setIsGoogleLoading(true)
                    handleSignInWithGoogle()
                }}
                disabled={isLoading || isGoogleLoading}
            >
                {isGoogleLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </button>
        </div>
    )
}
