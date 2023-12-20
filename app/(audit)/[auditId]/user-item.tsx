import React from 'react';
import { User } from "@/types/dto";

interface UserItemProps {
    auditId: string
    user: User
}

const UserItem = ({user, auditId}: UserItemProps) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <div className="flex gap-2">
                    <div
                        className="font-semibold"
                    >
                        {user.firstName + " " + user.lastName}
                    </div>
                </div>
                <div>
                    <p className="flex text-sm text-muted-foreground">
                        {user.email}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserItem;