"use client"
import React from 'react';
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";

interface SettingsShellProps {
  children?: React.ReactNode
}

const SettingsShell = ({children}: SettingsShellProps) => {
  const {user, isAuthenticated, loading} = useAuth()
  const router = useRouter()
  if (loading || (isAuthenticated && !user)) {
    return (
      <>
        {children}
      </>
    )
  } else if (isAuthenticated && user) {
    return (
      <>
        {children}
      </>
    )
  } else if (!isAuthenticated || !user) {
    router.push("/")
  }
};

export default SettingsShell;