"use client"
import React from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

const HomeButtonSection = () => {
  const {user} = useAuth()
  return (
      <>
        <Link
            href={user ? '/dashboard' : '#'}
            className={cn(buttonVariants({size: "xl"}), "text-sm font-semibold rounded-full")}>
          Get Started
        </Link>
        <Link
            href={user ? '/audits' : '#'}
            className={cn(buttonVariants({variant: "outline", size: "xl"}), "text-sm font-semibold rounded-full")}
        >
          Audits
        </Link>

      </>
  );
};

export default HomeButtonSection;