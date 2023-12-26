"use client"
import React from 'react';
import UserAudits from "@/app/(audit)/user/[userId]/user-audits";
import { AuditsProvider } from "@/components/dashboard/AuditsContext";

export default function AuditSinglePage({params}: { params: { userId: string } }) {
  const {userId} = params

  return (
      <AuditsProvider>
        <UserAudits userId={userId}/>
      </AuditsProvider>
  )
}