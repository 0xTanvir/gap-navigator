import React from 'react';
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import AuditCard from "@/components/dashboard/audit/audit-card";

export default async function IndexPage() {
    return (
        <div className="container">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6">Question</h1>
                        <p className="mt-2 text-sm">
                            A list of all the users in your account including their name, title, email and role.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button type="button">
                            <Icons.plus className="mr-1"/>
                            Add Question
                        </Button>
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
        </div>
    );
};
