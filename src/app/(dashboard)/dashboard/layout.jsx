import React from 'react';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <nav className="dashboard-sidebar">
                {/* Add your dashboard navigation here */}
            </nav>
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;