import React, {useState} from 'react';
import {AuditsModal} from "@/components/dashboard/audits-modal";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {DataTable} from "@/components/data-table/data-table";
import {columns} from "@/components/dashboard/table/columns";
import {AuditsDataType} from "@/config/site";

const audits: AuditsDataType[] = [
    {id: 1, name: 'Audits 1', type: 'private'},
    {id: 2, name: 'Audits 2', type: 'public'},
    {id: 3, name: 'Audits 3', type: 'private'},
    {id: 4, name: 'Audits 4', type: 'public'},
    {id: 5, name: 'Audits 5', type: 'private'},
    {id: 6, name: 'Audits 6', type: 'public'},
    {id: 7, name: 'Audits 7', type: 'private'},
    {id: 8, name: 'Audits 8', type: 'public'},
    {id: 9, name: 'Audits 9', type: 'private'},
    {id: 10, name: 'Audits 10', type: 'public'},
    {id: 11, name: 'Audits 11', type: 'private'},
    {id: 12, name: 'Audits 12', type: 'public'},
]

const ConsultantDashboard = () => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <div className="container">
            <div className="px-4 sm:px-6 lg:px-8">

                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6">Audits</h1>
                        <p className="mt-2 text-sm">
                            A list of all the users in your account including their name, title, email and role.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <AuditsModal open={open} setOpen={setOpen} title={"Add Audits"}>
                            <Button
                                type="button"
                                onClick={() => {
                                    setOpen(true)
                                }}
                            >
                                <Icons.plus className="mr-1"/>
                                Add Audits
                            </Button>
                        </AuditsModal>
                    </div>
                </div>

                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <DataTable columns={columns} data={audits}/>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConsultantDashboard;