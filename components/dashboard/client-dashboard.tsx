import React, {useState} from 'react';
import {Icons} from "@/components/icons";
import {AuditsModal} from "@/components/dashboard/audits-modal";

const audits = [
    {id: 1, name: 'Audits 1', type: 'private'},
]
const ClientDashboard = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [editOpenModal, setEditOpenModal] = useState<boolean>(false)

    return (
        <div className="container">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6">Users</h1>
                        <p className="mt-2 text-sm">
                            A list of all the users in your account including their name, title, email and role.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">

                        <AuditsModal open={open} setOpen={setOpen} title={"Add Audits"}>
                            <button
                                type="button"
                                className="bg-primary flex justify-between items-center rounded-md border px-3 py-2 text-center text-sm font-semibold shadow-sm"
                                onClick={() => {
                                    setOpen(true)
                                }}
                            >
                                <Icons.plus className="mr-1"/>
                                Add Audits
                            </button>
                        </AuditsModal>
                    </div>
                </div>


                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                <tr>
                                    <th scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                                        Name
                                    </th>
                                    <th scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold">
                                        Title
                                    </th>
                                    <th scope="col" className="px-3 text-right py-3.5 text-sm font-semibold">
                                        Edit
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {audits.map((audit) => (
                                    <tr key={audit.id}>
                                        <td className="whitespace-nowrap capitalize py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                                            {audit.name}
                                        </td>
                                        <td className="whitespace-nowrap capitalize px-3 py-4 text-sm">{audit.type}</td>
                                        <td className="whitespace-nowrap px-3 text-right py-3.5 text-sm font-medium">
                                            <div className="flex justify-end items-center">
                                                <AuditsModal open={editOpenModal} setOpen={setEditOpenModal}
                                                             title={"Edit Audits"} data={audit}>
                                                    <Icons.edit
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setEditOpenModal(true)
                                                        }}
                                                    />
                                                </AuditsModal>

                                                <Icons.delete className="cursor-pointer ml-3" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;