import React from 'react';
import AuditCard from "@/components/dashboard/audit/audit-card";
import BackButton from "@/components/dashboard/back-button";
import AddButton from "@/components/dashboard/add-button";

export default function IndexPage() {
    return (
        <div className="container">

                <BackButton/>
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6">Question</h1>
                        <p className="mt-2 text-sm">
                            A list of all the users in your account including their name, title, email and role.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <AddButton/>
                    </div>
                </div>

                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <AuditCard/>
                        </div>
                    </div>
                </div>

        </div>
    );
};
