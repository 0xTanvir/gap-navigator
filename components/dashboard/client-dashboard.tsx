import React from 'react';


const ClientDashboard = () => {
    return (
        <div className="container">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6">
                        Hello from client dashboard
                    </h1>
                    <p className="mt-2 text-sm">
                        A list of all the users in your account including their name, title, email and role.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;