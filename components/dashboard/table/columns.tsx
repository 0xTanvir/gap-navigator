"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Evaluate} from "@/types/dto";
import {formatDate} from "@/lib/utils";
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
]