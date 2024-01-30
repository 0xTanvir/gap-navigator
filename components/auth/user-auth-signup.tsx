"use client";

import * as React from "react";
import * as z from "zod";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { setUser } from "@/lib/firestore/user";
import { User } from "@/types/dto";
import { userAuthSignupSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { AccountType } from "@/config/site";
import { useAuth } from "@/components/auth/auth-provider";
import { useEffect } from "react";

interface UserAuthSignupProps extends React.HTMLAttributes<HTMLDivElement> {
}

type FormData = z.infer<typeof userAuthSignupSchema>;

export function UserAuthSignup({className, ...props}: UserAuthSignupProps) {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const router = useRouter();
  const {user, loading} = useAuth();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSignupSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);

  const handleSignInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        setIsGoogleLoading(false);
        setIsLoading(false);

        // TODO: force the caller to send callback url
        // get the callback url and redirect to the callback url
        router.push("/dashboard");
      })
      .catch((error) => {
        setIsGoogleLoading(false);
        setIsLoading(false);
        return toast.error("Failed to Sign In", {
          description: error.message,
        });
      });
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setIsGoogleLoading(true);
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (result) => {
        // Add user to firestore
        const user: User = {
          uid: result.user.uid,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          image: result.user.photoURL!,
          audits: [],
          invitedAuditsList: [],
        };
        try {
          await setUser(result.user.uid, user);
        } catch (error: any) {
          setIsLoading(false);
          setIsGoogleLoading(false);
          return toast.error("Failed to Sign Up", {
            description: error.message,
          });
        }

        setIsLoading(false);
        setIsGoogleLoading(false);
        // TODO: force the caller to send callback url
        // get the callback url and redirect to the callback url
        router.push("/dashboard");
      })
      .catch((error) => {
        setIsLoading(false);
        setIsGoogleLoading(false);
        return toast.error("Failed to Sign Up", {
          description: error.message,
        });
      });

    setIsLoading(false);
    setIsGoogleLoading(false);
  }

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [loading]);
  return (
    <div
      className={cn(
        "mt-6 sm:mx-auto sm:w-full sm:max-w-[480px] xl:max-w-[580px]",
        className
      )}
      {...props}
    >
      <div className=" px-6 py-12 shadow-xl mx-2 md:mx-0 sm:rounded-lg sm:px-12 border">
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <Label
                htmlFor="first_name"
                className="block text-sm font-medium leading-6"
              >
                First Name
              </Label>
              <div className="mt-2">
                <Input
                  id="first_name"
                  variant="ny"
                  placeholder="First Name"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="given-name"
                  autoCorrect="off"
                  disabled={isLoading || isGoogleLoading || loading}
                  {...register("firstName")}
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
                className="block text-sm font-medium leading-6"
              >
                Last Name
              </Label>
              <div className="mt-2">
                <Input
                  id="last_name"
                  variant="ny"
                  placeholder="Last Name"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="family-name"
                  autoCorrect="off"
                  disabled={isLoading || isGoogleLoading || loading}
                  {...register("lastName")}
                />
                {errors?.lastName && (
                  <p className="px-1 mt-1.5 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label
              htmlFor="email"
              className=" block text-sm font-medium leading-6"
            >
              Email
            </Label>
            <div className="mt-2">
              <Input
                id="email"
                variant="ny"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isGoogleLoading || loading}
                {...register("email")}
              />
              {errors?.email && (
                <p className="px-1 mt-1.5 text-xs">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium leading-6"
            >
              Password
            </Label>
            <div className="mt-2">
              <Input
                id="password"
                variant="ny"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading || isGoogleLoading || loading}
                {...register("password")}
              />
              {errors?.password && (
                <p className="px-1 mt-1.5 text-xs">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="role"
              className="block text-sm font-medium leading-6"
            >
              Account Type
            </Label>
            <fieldset className="mt-2">
              <legend className="sr-only">Notification method</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                {Object.keys(AccountType).map((userRole) => (
                  <div key={userRole} className="flex items-center">
                    <Input
                      id={userRole.toLowerCase()}
                      type="radio"
                      value={userRole.toLowerCase()}
                      defaultChecked={userRole.toLowerCase() === "client"}
                      className="h-4 w-4 "
                      autoComplete="role"
                      disabled={isLoading || isGoogleLoading || loading}
                      {...register("role")}
                    />
                    <Label
                      htmlFor={userRole.toLowerCase()}
                      className="ml-2 text-sm font-medium capitalize text-muted-foreground"
                    >
                      {userRole}
                    </Label>
                  </div>
                ))}
              </div>
            </fieldset>

            {errors?.role && (
              <p className="px-1 mt-1.5 text-xs">{errors.role.message}</p>
            )}
          </div>

          <div>
            <button
              className={cn(
                buttonVariants(),
                "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
              )}
              disabled={isLoading || loading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
              )}
              Sign Up
            </button>
          </div>
        </form>

        <div>
          <div className="relative mt-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t"/>
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-background px-6 py-2 rounded">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-0 gap-4">
            <button
              type="button"
              className={cn(buttonVariants({variant: "outline"}))}
              onClick={() => {
                setIsLoading(true);
                setIsGoogleLoading(true);
                handleSignInWithGoogle();
              }}
              disabled={isLoading || isGoogleLoading || loading}
            >
              {isGoogleLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
              ) : (
                <Icons.google2 className="mr-2 h-4 w-4"/>
              )}{" "}
              Google
            </button>
          </div>
        </div>
      </div>
      <p className="my-5 px-8 text-center text-sm text-muted-foreground">
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
  );
}
