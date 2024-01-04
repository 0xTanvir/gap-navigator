"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Evaluate} from "@/types/dto";
import {formatDate} from "@/lib/utils";
import * as React from "react";

export const columns: ColumnDef<Evaluate>[] = [
    {
        accessorFn: (row) => `${row.participantFirstName}`,
        enableMultiSort: true,
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
        accessorFn: (row) => `${row.participantEmail}`,
        accessorKey: "email",
        header: "Email",
        footer: props => props.column.id,
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
]