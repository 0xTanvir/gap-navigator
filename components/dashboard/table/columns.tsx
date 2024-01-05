"use client"

import {createColumnHelper} from "@tanstack/react-table"
import {formatDate} from "@/lib/utils";
import * as React from "react";
import {Evaluate} from "@/types/dto";

const columnHelper = createColumnHelper();
export const columns = [
    columnHelper.accessor("", {
        id: "S.No",
        cell: (info) => <span>{info.row.index + 1}</span>,
        header: "ID",
    }),
    columnHelper.accessor("participantFirstName", {
        cell: (info) => {
            const {participantFirstName, participantLastName} = info.row.original as Evaluate
            return (
                <>
                    {participantFirstName}{" "}{participantLastName}
                </>
            )
        },
        header: "Name",
    }),
    columnHelper.accessor("participantLastName", {
        cell: (info) => <span>{info.getValue()}</span>,
        header: "Last Name",
        id: "lastName",
    }),
    columnHelper.accessor("participantEmail", {
        cell: (info) => <span>{info.getValue()}</span>,
        header: "Email",
    }),
    columnHelper.accessor("participantPhone", {
        cell: (info) =>
            <span>{info.getValue() === "" || info.getValue() === undefined ? "N/A" : info.getValue()}</span>,
        header: "Phone",
    }),
    columnHelper.accessor("createdAt", {
        cell: (info) => <span>{formatDate(info.getValue())}</span>,
        header: "Evaluation Last Date",
    })
];