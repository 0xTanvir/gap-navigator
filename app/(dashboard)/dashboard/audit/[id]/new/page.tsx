import React from 'react';
import BackButton from "@/components/dashboard/back-button";

const Page = () => {
    return (
        <div className="container">
            <div className="px-4 sm:px-6 lg:px-8">
                <BackButton/>
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6">
                            Add Question Page
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;