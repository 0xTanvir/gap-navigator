"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { profileFormSchema } from "@/lib/validations/profile";
import { useAuth } from "@/components/auth/auth-provider";
import { updateUserProfile } from "@/lib/firestore/user";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { storage } from "@/firebase";
import { Timestamp } from "firebase/firestore";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileName, setFileName] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const { user, loading, setUser } = useAuth();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      image: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setLoader(true);
    try {
      const url: any | string = await userImageUpload(fileName, file as File, user?.uid)
        .then((url) => {
          return url;
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
      let dbUser = await updateUserProfile(user?.uid as string, {
        firstName: data.firstName,
        lastName: data.lastName,
        image: url,
      });
      setUser(dbUser);
      toast.success("Profile Updated.");
      setLoader(false);
      setPreview("");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("failed to update profile, please try again.");
      setLoader(false);
    }
  }

  useEffect(() => {
    if (!loading && user) {
      form.reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        image: user?.image || "",
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input variant="ny" placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          disabled={loader || loading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input variant="ny" placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={true}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input variant="ny" placeholder="Please enter email" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...rest } }) => (
            <div className="relative w-40 h-40">
              <div className="space-y-2">
                <Avatar className="w-40 h-40">
                  <AvatarImage src={preview ? preview : user?.image} />
                  <AvatarFallback>
                    {user &&
                      user?.firstName[0].toUpperCase() +
                        user?.lastName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              {!loading && (
                <>
                  {preview ? (
                    <div
                      className="absolute z-10 bottom-5 right-0 bg-white border border-transparent rounded-2xl transition-all duration-75 ease-in-out"
                      style={{
                        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <div className="cursor-pointer rounded-2xl grid place-items-center">
                        <Icons.cancel
                          onClick={() => setPreview("")}
                          className="h-6 w-6"
                        />
                      </div>
                    </div>
                  ) : (
                    <FormItem
                      className="absolute z-10 bottom-5 right-0 w-8 h-8 bg-white border border-transparent rounded-2xl transition-all duration-75 ease-in-out"
                      style={{
                        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <FormLabel
                        htmlFor="thumbnail"
                        className="cursor-pointer w-8 h-8 rounded-2xl grid place-items-center"
                      >
                        <Icons.fileEdit className="h-5 w-5" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="hidden"
                          type="file"
                          id="thumbnail"
                          accept=".png, .jpg, .jpeg"
                          {...rest}
                          onChange={async (event) => {
                            const { files, displayUrl } = getImageData(event);
                            setFile(files);
                            setFileName(files.name);
                            setPreview(displayUrl);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                </>
              )}
            </div>
          )}
        />

        <Button
          className={cn(buttonVariants({ variant: "default" }))}
          disabled={loader || loading}
          type="submit"
        >
          {loader && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Update Profile
        </Button>
      </form>
    </Form>
  );
}

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();
  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files[0];
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}

export async function userImageUpload(imageName: string, imageFile: File, userId: string | undefined) {
  return new Promise((resolve, reject) => {
    // Create a reference to the storage location with the image name
    const imageRef = ref(storage, `gn/users/${userId}/${Timestamp.now()}_${imageName}`);

    const imageTask = uploadBytesResumable(imageRef, imageFile);

    imageTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // console.log(percent)
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(imageTask.snapshot.ref)
          .then((url) => {
            resolve(url); // Resolve the promise with the download URL
          })
          .catch((err) => {
            console.error(err);
            reject(err); // Reject the promise if there's an error
          });
      }
    );
  });
}
