import React, {useEffect, useState} from "react";
import {useAuth} from "@/components/auth/auth-provider";
import {getAuditsByIds} from "@/lib/firestore/audit";
import {Audits} from "@/types/dto";
import {DashboardHeader} from "@/components/dashboard/dashboard-header";
import ClientAuditItem from "@/components/dashboard/client-audit-item";
import {Skeleton} from "@/components/ui/skeleton";
import {EmptyPlaceholder} from "@/components/dashboard/empty-placeholder";
import {toast} from "sonner";
import * as z from "zod";
import {auditFilterSchema} from "@/lib/validations/audit";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import CustomPagination from "@/components/custom-pagination/custom-pagination";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type FormData = z.infer<typeof auditFilterSchema>
const ClientAudits = () => {
    const [audits, setAudits] = useState<Audits | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize] = useState<number>(10)
    const [totalData, setTotalData] = useState<number>(0)
    const [auditName, setAuditName] = useState<string>("")
    const [currentAudits, setCurrentAudits] = useState<Audits | []>([]);
    const [currentSliceAudits, setCurrentSliceAudits] = useState<Audits | []>([]);
    const [filterData, setFilterData] = useState(false)

    const {user} = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(auditFilterSchema),
        defaultValues: {
            auditName: ""
        },
    })

    function onSubmit(data: FormData) {
        setFilterData(true)
        if (data.auditName) {
            let filterData = audits.filter(audit => audit.name === data.auditName);
            setCurrentAudits(filterData)
            setCurrentPage(1)
        }
    }

    const indexOfLastAudit = currentPage * pageSize
    const indexOfFirstAudit = indexOfLastAudit - pageSize
    useEffect(() => {
        if (filterData) {
            setTotalData(currentAudits.length)
            setCurrentSliceAudits(currentAudits.slice(indexOfFirstAudit, indexOfLastAudit))
        } else {
            setTotalData(audits.length)
            setCurrentSliceAudits(audits.slice(indexOfFirstAudit, indexOfLastAudit))
        }
    }, [totalData, audits, filterData, currentAudits, indexOfLastAudit, indexOfFirstAudit]);

    useEffect(() => {
        async function fetchAuditsEvaluation() {
            try {
                if (user?.invitedAuditsList) {
                    let dbAudits = await getAuditsByIds(user?.invitedAuditsList);
                    setAudits(dbAudits);
                }
            } catch (err) {
                toast.error("Something went wrong.", {
                    description: "Failed to fetch audits. Please try again.",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchAuditsEvaluation();
    }, [user?.invitedAuditsList]);

    if (isLoading) {
        return (
            <>
                <DashboardHeader heading="Audits" text="Manage audits."/>
                <div className="divide-border-200 divide-y rounded-md border">
                    <ClientAudits.Skeleton/>
                    <ClientAudits.Skeleton/>
                    <ClientAudits.Skeleton/>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex-1 space-y-4">
                <DashboardHeader heading="Audits" text="Manage audits."/>
                <div className="px-1.5">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col sm:flex-row  sm:items-end justify-end gap-3">
                            <FormField
                                control={form.control}
                                name="auditName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Audit Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">
                                Submit
                            </Button>
                            {form.getValues("auditName") &&
                                <Button
                                    variant="destructive"
                                    type="reset"
                                    onClick={() => {
                                        form.reset({
                                            auditName: ""
                                        })
                                        form.setValue("auditType", "")
                                        setAuditName("");
                                        setCurrentAudits(audits)
                                        setFilterData(false)
                                    }}
                                >
                                    Reset
                                </Button>
                            }

                        </form>

                    </Form>
                </div>
                {audits.length ? (
                    <>
                        {
                            currentSliceAudits.length ? (
                                    <>
                                        <div className="divide-y divide-border rounded-md border">
                                            {audits.map((audit) => (
                                                <ClientAuditItem key={audit.uid} audit={audit}/>
                                            ))}
                                        </div>

                                        <CustomPagination
                                            totalPages={Math.ceil(totalData / pageSize)}
                                            setCurrentPage={setCurrentPage}
                                        />
                                    </>
                                ) :
                                <div className="divide-y divide-border rounded-md border">
                                    <div className="text-center font-semibold py-10">No Data Found</div>
                                </div>
                        }
                    </>
                ) : (
                    <EmptyPlaceholder className="mt-3">
                        <EmptyPlaceholder.Icon name="audit"/>
                        <EmptyPlaceholder.Title>No audit found</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any audits yet.
                        </EmptyPlaceholder.Description>
                    </EmptyPlaceholder>
                )}
            </div>
        </>
    );
};

ClientAudits.Skeleton = function ClientAuditsSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-full"/>
            </div>
        </div>
    );
};

export default ClientAudits;
