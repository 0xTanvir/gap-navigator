import React, { useEffect, useState } from 'react';
import { Evaluate } from "@/types/dto";
import { toast } from "@/components/ui/use-toast";
import { getAllEvaluations } from "@/lib/firestore/evaluation";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/dashboard/table/columns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
        <>
            <DataTable columns={columns} data={clientsUniqueEvaluation}/>
        </>
    );
};

ConsultantClients.Skeleton = function TableSkeleton() {
    return (
        <div className="rounded-md border">
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
        </div>
    )
}

export default ConsultantClients;