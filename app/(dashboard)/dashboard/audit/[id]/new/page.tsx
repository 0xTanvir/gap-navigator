import React from 'react';
import BackButton from "@/components/dashboard/back-button";

const Page = () => {
    return (
        <div className="container">

            <BackButton/>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6">
                        Add Question Page
                    </h1>
                </div>
            </div>

        </div>
    );
};

export default Page;