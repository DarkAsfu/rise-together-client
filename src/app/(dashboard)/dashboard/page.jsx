"use client"
import AdminDashboard from '@/app/Components/dashboard/AdminDashboard';
import CampaignCreatorDashboard from '@/app/Components/dashboard/CampaignCreatorDashboard';
import DonorDashboard from '@/app/Components/dashboard/DonorDashboard';
import VolunteerDashboard from '@/app/Components/dashboard/VolunteerDashboard';
import { useAuth } from '@/app/hooks/useAuth';

const DashboardPage = () => {
    const { user, loading } = useAuth();
    
    console.log('User data:', user);
    console.log('Loading:', loading);

    // Show loading indicator while fetching user data
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/5 to-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary shadow-lg"></div>
            </div>
        );
    }

    // Show error if no user data
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/5 to-gray-50">
                <div className="bg-red-50 text-red-700 px-8 py-6 rounded-xl shadow-lg flex items-center space-x-3 backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Access denied. Please log in again.</span>
                </div>
            </div>
        );
    }

    const renderDashboard = () => {
        const userRole = user?.role_id?.name;
        console.log('User role:', userRole);
        
        switch (userRole) {
            case 'Admin':
                return <AdminDashboard />;
            case 'Donor':
                return <DonorDashboard />;
            case 'Campaign Creator':
                return <CampaignCreatorDashboard />;
            case 'Volunteer':
                return <VolunteerDashboard />
            default:
                return (
                    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary/5 to-gray-50">
                        <div className="bg-yellow-50 text-yellow-700 px-8 py-6 rounded-xl shadow-lg flex items-center space-x-3 backdrop-blur-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>Unknown role: {userRole || 'No role assigned'}</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard">
            {renderDashboard()}
        </div>
    );
};

export default DashboardPage;