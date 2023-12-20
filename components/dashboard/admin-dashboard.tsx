import React from 'react';

interface AdminDashboardProps {
    userId: string
}

const AdminDashboard = ({userId}:AdminDashboardProps) => {
    return (
        <div>
            <h1>Admin dashboard {userId}</h1>
        </div>
    );
};

export default AdminDashboard;