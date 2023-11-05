import React from 'react';
import {Button} from "@/components/ui/button";

export default async function IndexPage() {
    return (
        <div className="container">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6">Question Edit</h1>
                        <p className="mt-2 text-sm">
                            A list of all the users in your account including their name, title, email and role.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button type="button">
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
