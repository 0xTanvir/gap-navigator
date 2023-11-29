import React, { useEffect, useState } from 'react';
import { Evaluate } from "@/types/dto";
import { toast } from "@/components/ui/use-toast";
import { getAllEvaluations } from "@/lib/firestore/evaluation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ConsultantClientsProps {
    userAuditsId: string[]
}

const ConsultantClients = ({userAuditsId}: ConsultantClientsProps) => {
    const [clientsUniqueEvaluation, setClientsUniqueEvaluation] = useState<Evaluate[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        async function fetchUniqueEvaluations() {
            try {
                // Use Map to store uid counts
                const uidCounts = new Map();

                // Fetch evaluations for each audit asynchronously
                const evaluationsArray = await Promise.all(
                    userAuditsId.map(async (auditId) => {
                        const evaluations = await getAllEvaluations(auditId);

                        // Update uid counts and keep only unique evaluations
                        const uniqueEvaluations = evaluations.filter((evaluation) => {
                            const uid = evaluation.uid;
                            const count = uidCounts.get(uid) || 0;
                            uidCounts.set(uid, count + 1);
                            return count === 0;
                        });

                        // Add count property to each object
                        uniqueEvaluations.forEach((evaluation) => {
                            evaluation.count = uidCounts.get(evaluation.uid);
                        });

                        return uniqueEvaluations;
                    })
                );

                // Flatten the array of arrays into a single array
                const flattenedEvaluations = evaluationsArray.flat();

                // Build a result object with uid counts
                const uidCountsObject = Object.fromEntries(uidCounts);

                // Update each object in flattenedEvaluations with count information
                const enrichedEvaluations = flattenedEvaluations.map((evaluation) => ({
                    ...evaluation,
                    count: uidCountsObject[evaluation.uid] || 0,
                }));

                // Update evaluations state
                setClientsUniqueEvaluation(enrichedEvaluations);

            } catch (error) {
                console.log(error);
                toast({
                    title: "Something went wrong.",
                    description: "Failed to fetch audits. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }


        fetchUniqueEvaluations()
    }, [userAuditsId]) // Run this effect when the userId changes

    if (isLoading) {
        return <ConsultantClients.Skeleton/>
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="h-10">Name</TableHead>
                        <TableHead className="h-10">Email</TableHead>
                        <TableHead className="text-center h-10">Evaluation Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        clientsUniqueEvaluation.length > 0 ?
                            clientsUniqueEvaluation.map((evaluation) => (
                                <TableRow key={evaluation.uid}>
                                    <TableCell className="font-medium p-3">
                                        {evaluation.participantFirstName + " " + evaluation.participantLastName}
                                    </TableCell>
                                    <TableCell className="p-3">{evaluation.participantEmail}</TableCell>
                                    <TableCell className="text-center p-3">{evaluation.count}</TableCell>
                                </TableRow>
                            ))
                            :
                            <TableRow>
                                <TableCell colSpan={3} className="p-5 font-bold text-center">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>

        </div>
    );
};
ConsultantClients.Skeleton = function TableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow className="">
                    <TableHead className="h-10">Name</TableHead>
                    <TableHead className="h-10">Email</TableHead>
                    <TableHead className="text-center h-10">Evaluation Count</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[1, 2, 3, 4].map((data) => (
                    <TableRow key={data}>
                        <TableCell className="p-3">
                            <Skeleton className="p-3 w-full"/>
                        </TableCell>
                        <TableCell className="p-3">
                            <Skeleton className="p-3 w-full"/>
                        </TableCell>
                        <TableCell className="p-3">
                            <Skeleton className="p-3 w-full"/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ConsultantClients;