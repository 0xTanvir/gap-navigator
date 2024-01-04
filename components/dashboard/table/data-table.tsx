"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    getFilteredRowModel
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button, buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import * as React from "react";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {evaluateParticipantUpdate} from "@/lib/validations/question";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Evaluate} from "@/types/dto";
import {setEvaluation} from "@/lib/firestore/evaluation";
import {toast} from "sonner";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    setEvaluations: React.Dispatch<React.SetStateAction<[] | Evaluate[]>>
}

type FormData = z.infer<typeof evaluateParticipantUpdate>

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             setEvaluations,
                                         }: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState('')

    const [isUpdateLoading, setIsUpdateLoading] = React.useState<boolean>(false);
    const [showUpdateDialog, setShowUpdateDialog] =
        React.useState<boolean>(false);
    const [evaluationData, setEvaluationData] = useState<Evaluate | null>(null)


    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter: globalFilter
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
    })

    const form = useForm<FormData>({
        resolver: zodResolver(evaluateParticipantUpdate),
        defaultValues: {
            participantPhone: ""
        }
    })
    const handleEdit = (row: any) => {
        setEvaluationData(row.original)
        form.setValue("participantPhone", row.original.participantPhone || "");
        setShowUpdateDialog(true)
    };

    async function onSubmit(data: FormData) {
        setIsUpdateLoading(true)
        const evaluate = {
            ...evaluationData,
            participantPhone: data.participantPhone
        }
        try {
            await setEvaluation(evaluate.auditId as string, evaluate as Evaluate)

            // Update the state based on the previous state
            // @ts-ignore
            setEvaluations((prevEvaluations) => {
                return prevEvaluations.map((evaluation) =>
                    evaluation.uid === evaluate.uid ? evaluate : evaluation
                );
            });
            return toast.success("Evaluation updated successfully.", {
                description: `Evaluation participant Phone number was updated.`,
            });
        } catch (error) {
            return toast.error("Something went wrong.", {
                description: "Your audit was not updated. Please try again.",
            });
        } finally {
            setIsUpdateLoading(false)
            setShowUpdateDialog(false)
            setEvaluationData(null)
            form.reset()
        }
    }

    return (
        <>
            <div className="mx-1">
                <Input
                    type="text"
                    variant="ny"
                    value={globalFilter}
                    placeholder="search ..."
                    onChange={e => setGlobalFilter(e.target.value)}
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <div
                                            className="flex items-center cursor-pointer"
                                            onClick={() => handleEdit(row)}
                                        >
                                            <Icons.fileEdit className="mr-1 h-4 w-4"/>
                                            Edit
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Evaluation Update</DialogTitle>
                                <DialogDescription>lorem ipsum</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="participantPhone"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    variant="ny"
                                                    placeholder="Please enter phone number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <button
                                    type="submit"
                                    className={cn(buttonVariants({variant: "default"}), {
                                        "cursor-not-allowed opacity-60": isUpdateLoading,
                                    })}
                                    disabled={isUpdateLoading}
                                >
                                    {isUpdateLoading ? (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        <Icons.filePlus className="mr-2 h-4 w-4"/>
                                    )}
                                    Submit
                                </button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}