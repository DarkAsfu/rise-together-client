import React from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaChartBar, FaCog } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <nav className="w-64 bg-white shadow-lg">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                </div>
                <div className="mt-4">
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <FaHome className="mr-3" />
                        Overview
                    </Link>
                    <Link href="/dashboard/users" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <FaUsers className="mr-3" />
                        Users
                    </Link>
                    <Link href="/dashboard/analytics" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <FaChartBar className="mr-3" />
                        Analytics
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <FaCog className="mr-3" />
                        Settings
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;