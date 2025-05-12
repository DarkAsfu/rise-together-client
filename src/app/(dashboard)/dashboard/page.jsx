"use client"
import AdminDashboard from '@/app/Components/dashboard/AdminDashboard';
import CampaignCreatorDashboard from '@/app/Components/dashboard/CampaignCreatorDashboard';
import DonorDashboard from '@/app/Components/dashboard/DonorDashboard';
import { useAuth } from '@/app/hooks/useAuth';

const DashboardPage = () => {
    const { user } = useAuth();

    const renderDashboard = () => {
        switch (user?.role) {
            case 'Admin':
                return <AdminDashboard />;
            case 'Donor':
                return <DonorDashboard />;
            case 'Campaign Creator':
                return <CampaignCreatorDashboard />;
            default:
                return <div>Access Denied</div>;
        }
    };

    return (
        <div className="dashboard">
            {renderDashboard()}
        </div>
    );
};

export default DashboardPage;