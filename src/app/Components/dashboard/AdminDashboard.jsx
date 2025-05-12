'use client'
import { useState } from 'react';
import useCampaigns from "@/app/hooks/useCampaigns";
import useUsers from "@/app/hooks/useUsers";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import useValidDonation from '@/app/hooks/useValidDonation';

const AdminDashboard = () => {
    const { users, loading: usersLoading, error: usersError } = useUsers();
    const { campaigns, loading: campaignsLoading, error: campaignsError } = useCampaigns();
    const { donations, loading: donationsLoading, error: donationsError } = useValidDonation();
    console.log(users, campaigns, donations);
    const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
    
    // Calculate basic statistics
    const totalUsers = users?.length || 0;
    const totalCampaigns = campaigns?.length || 0;
    const totalDonations = donations?.length || 0;
    const totalDonationAmount = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
    
    // User statistics
    const userRolesData = users?.reduce((acc, user) => {
        const roleId = user.role_id?._id;
        acc[roleId] = (acc[roleId] || 0) + 1;
        return acc;
    }, {});
    
    const getRoleName = (roleId) => {
        switch(roleId) {
            case '67c742deb4759d1949ac293b': return 'Admin';
            case '67c742deb4759d1949ac2939': return 'Creator';
            case '67c742deb4759d1949ac293a': return 'Volunteer';
            case '67c742deb4759d1949ac2938': return 'Donor';
            default: return 'Unknown';
        }
    };
    
    const userPieData = Object.entries(userRolesData || {}).map(([roleId, count]) => ({
        name: getRoleName(roleId),
        value: count
    }));
    
    // Campaign statistics
    const campaignStatusData = campaigns?.reduce((acc, campaign) => {
        acc[campaign.status] = (acc[campaign.status] || 0) + 1;
        return acc;
    }, {});
    
    const campaignPieData = Object.entries(campaignStatusData || {}).map(([status, count]) => ({
        name: status,
        value: count
    }));
    
    // Donation statistics
    const donationTrendData = donations?.reduce((acc, donation) => {
        const date = new Date(donation.created_at);
        let key;
        
        if (timeRange === 'week') {
            key = `${date.getFullYear()}-W${Math.ceil((date.getDate() + (date.getDay() || 7)) / 7)}`;
        } else if (timeRange === 'month') {
            key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        } else {
            key = date.getFullYear();
        }
        
        acc[key] = (acc[key] || 0) + donation.amount;
        return acc;
    }, {});
    
    const lineChartData = Object.entries(donationTrendData || {}).map(([date, amount]) => ({
        date,
        amount
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // Top campaigns by donations
    const campaignDonations = campaigns?.map(campaign => {
        const campaignDonations = donations?.filter(d => d.campaign_id?._id === campaign._id) || [];
        const total = campaignDonations.reduce((sum, d) => sum + d.amount, 0);
        return {
            name: campaign.title.length > 15 ? `${campaign.title.substring(0, 15)}...` : campaign.title,
            donations: campaignDonations.length,
            amount: total,
            goal: campaign.goal_amount,
            completion: (total / campaign.goal_amount) * 100
        };
    });
    
    const topCampaigns = [...(campaignDonations || [])].sort((a, b) => b.amount - a.amount).slice(0, 5);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    
    if (usersLoading || campaignsLoading || donationsLoading) {
        return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
    }
    
    if (usersError || campaignsError || donationsError) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error loading data: {usersError?.message || campaignsError?.message || donationsError?.message}
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            {/* Time Range Selector */}
            <div className="mb-6 flex space-x-2">
                <button 
                    onClick={() => setTimeRange('week')} 
                    className={`px-4 py-2 rounded-md ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Weekly
                </button>
                <button 
                    onClick={() => setTimeRange('month')} 
                    className={`px-4 py-2 rounded-md ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={() => setTimeRange('year')} 
                    className={`px-4 py-2 rounded-md ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Yearly
                </button>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Users</h2>
                    <div className="text-3xl font-bold text-blue-600">{totalUsers}</div>
                    <div className="mt-4 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userPieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {userPieData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Campaigns</h2>
                    <div className="text-3xl font-bold text-green-600">{totalCampaigns}</div>
                    <div className="pl-10 mt-4 h-40">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={campaignPieData}
                                    cx="65%"
                                    cy="50%"
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {campaignPieData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} campaigns`, 'Count']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Donations</h2>
                    <div className="text-3xl font-bold text-purple-600">${totalDonationAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mt-2">from {totalDonations} donations</div>
                    <div className="mt-4 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[{name: 'Donations', count: totalDonations}]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" name="Number of Donations" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* Donation Trends */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Donation Trends ({timeRange})</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={lineChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#FF8042" name="Donation Amount" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Top Campaigns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Top Campaigns by Donations</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topCampaigns}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value, name) => {
                                    if (name === 'Completion') return [`${value.toFixed(2)}%`, name];
                                    return [`$${value.toLocaleString()}`, name];
                                }} />
                                <Legend />
                                <Bar dataKey="amount" fill="#8884d8" name="Total Donations" />
                                <Bar dataKey="goal" fill="#82ca9d" name="Goal Amount" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Campaign Completion Rates</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topCampaigns}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Completion']} />
                                <Legend />
                                <Bar dataKey="completion" fill="#FFBB28" name="Completion %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* Recent Activity */}
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Recent Donations</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations?.slice(0, 5).map((donation, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {donation.campaign_id?.title?.length > 20 
                                            ? `${donation.campaign_id.title.substring(0, 20)}...` 
                                            : donation.campaign_id?.title || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {donation.is_anonymous ? 'Anonymous' : donation.user_id?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${donation.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(donation.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                              donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-red-100 text-red-800'}`}>
                                            {donation.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;