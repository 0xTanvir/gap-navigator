import React, { useEffect } from 'react';
import { User } from "@/types/dto";
import { getEvaluationByIds } from "@/lib/firestore/evaluation";

interface clientEvaluationsProps {
    user: User
}

const ClientEvaluations = ({user}: clientEvaluationsProps) => {

    useEffect(() => {
        async function fetchEvaluations() {
            let evaluation = await getEvaluationByIds(user?.invitedAuditsList, user.email)
        }

        fetchEvaluations()
    }, [])

    return (
        <div>
            Hello from client evaluations
        </div>
    );
};

export default ClientEvaluations;