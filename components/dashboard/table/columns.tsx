"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Evaluate} from "@/types/dto";
import {formatDate} from "@/lib/utils";
import {Icons} from "@/components/icons";
import * as React from "react";

export const columns: ColumnDef<Evaluate>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => {
            const {participantFirstName, participantLastName} = row.original
            return (
                <> {participantFirstName + " " + participantLastName} </>
            )
        }
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({row}) => {
            const {participantEmail} = row.original
            return (
                <> {participantEmail} </>
            )
        }
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({row}) => {
            const {participantPhone} = row.original
            return (
                <> {participantPhone} </>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Evaluation Last Date",
        cell: ({row}) => {
            const {createdAt} = row.original
            return (
                <>{formatDate(createdAt)}</>
            )
        }
    },
    {
        accessorKey: "Evaluation count",
        header: ({column}) => {
            return (
                <div className="text-center">Evaluation Count</div>
            )
        },
        cell: ({row}) => {
            const {count} = row.original
            return (
                <p className="text-center"> {count} </p>
            )
        }
    },
    // {
    //     id: "actions",
    //     cell: ({row}) => {
    //         return (
    //             <div className="flex items-center cursor-pointer">
    //                 <Icons.fileEdit className="mr-1 h-4 w-4"/>
    //                 Edit
    //             </div>
    //         )
    //     },
    // },
]