"use client"
import React from 'react';
import NotificationNav, { NotificationNavSkeleton } from "@/components/nav/notification-nav";
import { useAuth } from "@/components/auth/auth-provider";

const NotificationComponent = () => {
  const {user, loading} = useAuth()
  if (loading) {
    return <NotificationNavSkeleton/>
  }
  return (
    <>
      {
        user &&
          <NotificationNav/>
      }
    </>
  );
};

export default NotificationComponent;