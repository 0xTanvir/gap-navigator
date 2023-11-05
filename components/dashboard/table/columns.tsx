"use client"

import {ColumnDef} from "@tanstack/react-table"
import DataTableRowActions from "@/components/dashboard/table/data-table-row-actions";
import {AuditsDataType} from "@/config/site";
import Link from "next/link";

export const columns: ColumnDef<AuditsDataType>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell:({row}) => {
            const {id, name} = row.original
            return(
                <Link href={`dashboard/audit/${id}`}>{name}</Link>
            )
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({row}) => {
            const formatted: string = row.getValue('type')
            const style = formatted === 'private' ?
                'text-muted-foreground' : ''
            return <div className={`${style} capitalize inline-flex rounded-md px-2 py-1`}>
                {formatted}
            </div>
        }
    },
    {
        accessorKey: "actions",
        header: ({column}) => {
            return(
                <div className="text-right">Actions</div>
            )
        },
        cell: ({row}) => <DataTableRowActions audit={row.original} name={row.original.name} />
    }
]
