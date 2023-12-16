import React from 'react';
import { Audit } from "@/types/dto";
import Link from "next/link";

interface ClientAuditItemProps {
    audit: Audit
}

const ClientAuditItem = ({audit}: ClientAuditItemProps) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <div className="flex gap-2">
                    <Link
                        href={`/evaluate/${audit.uid}`}
                        className="font-semibold hover:underline"
                    >
                        {audit.name}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClientAuditItem;