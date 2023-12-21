import React from 'react';
import UserList from "@/app/(audit)/[auditId]/user-list";

export default function AuditSinglePage({params}: { params: { auditId: string } }) {
    const {auditId} = params

    return (
        <UserList auditId={auditId} />
    );
};
