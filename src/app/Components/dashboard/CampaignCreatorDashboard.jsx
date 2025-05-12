'use client'
import { useState, useEffect } from 'react';
import useDonationsByCampaigns from "@/app/hooks/useDonationsByCampaigns";
import useMyCampaign from "@/app/hooks/useMyCampaign";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CampaignCreatorDashboard = () => {
    const { campaigns, loading, error } = useMyCampaign();
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [currentDonations, setCurrentDonations] = useState([]); // Initialize as empty array
    const { donations } = useDonationsByCampaigns(selectedCampaignId);

    useEffect(() => {
        if (campaigns?.length > 0 && !selectedCampaignId) {
            setSelectedCampaignId(campaigns[0]._id);
        }
    }, [campaigns]);

    useEffect(() => {
        // Always update currentDonations when donations change, even if empty
        setCurrentDonations(donations || []);
    }, [donations]);

    // Calculate campaign statistics
    const totalCampaigns = campaigns?.length || 0;
    const totalGoalAmount = campaigns?.reduce((sum, campaign) => sum + campaign.goal_amount, 0) || 0;
    const totalCurrentAmount = campaigns?.reduce((sum, campaign) => sum + campaign.current_amount, 0) || 0;

    // Get the selected campaign details
    const selectedCampaign = campaigns?.find(campaign => campaign._id === selectedCampaignId);

    // Prepare data for category distribution
    const categoryData = campaigns?.reduce((acc, campaign) => {
        acc[campaign.category] = (acc[campaign.category] || 0) + 1;
        return acc;
    }, {});

    const pieChartData = Object.entries(categoryData || {}).map(([name, value]) => ({
        name,
        value
    }));

    // Prepare data for campaign progress
    const campaignProgressData = campaigns?.map(campaign => ({
        name: campaign.title.length > 10 ? `${campaign.title.substring(0, 10)}...` : campaign.title,
        goal: campaign.goal_amount,
        current: campaign.current_amount
    }));

    // Calculate donation statistics for the selected campaign using currentDonations
    const totalDonations = currentDonations?.length || 0;
    const totalDonationAmount = currentDonations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
    const averageDonation = totalDonations > 0 ? totalDonationAmount / totalDonations : 0;
    
    // Prepare donation timeline data using currentDonations
    const donationTimelineData = currentDonations?.reduce((acc, donation) => {
        const date = new Date(donation.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + donation.amount;
        return acc;
    }, {});

    const lineChartData = Object.entries(donationTimelineData || {}).map(([date, amount]) => ({
        date,
        amount
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Prepare donation amount distribution data using currentDonations
    const donationAmountRanges = {
        '0-500': 0,
        '501-1000': 0,
        '1001-2000': 0,
        '2000+': 0
    };

    currentDonations?.forEach(donation => {
        const amount = donation.amount;
        if (amount <= 500) donationAmountRanges['0-500']++;
        else if (amount <= 1000) donationAmountRanges['501-1000']++;
        else if (amount <= 2000) donationAmountRanges['1001-2000']++;
        else donationAmountRanges['2000+']++;
    });

    const barChartData = Object.entries(donationAmountRanges).map(([range, count]) => ({
        range,
        count
    }));

    const handleCampaignChange = (e) => {
        setSelectedCampaignId(e.target.value);
        // Reset currentDonations immediately when changing campaigns
        setCurrentDonations([]);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    if (loading) return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading data: {error.message}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            {/* Campaign Selector */}
            <div className="mb-6">
                <label htmlFor="campaign-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Campaign
                </label>
                <select
                    id="campaign-select"
                    value={selectedCampaignId}
                    onChange={handleCampaignChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {campaigns?.map(campaign => (
                        <option key={campaign._id} value={campaign._id}>
                            {campaign.title} - {new Date(campaign.deadline).toLocaleDateString()}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Selected Campaign Info */}
            {selectedCampaign && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h2 className="text-xl font-semibold text-blue-800">{selectedCampaign.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                            <p className="text-sm text-gray-600">Goal Amount</p>
                            <p className="font-medium">${selectedCampaign.goal_amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Raised Amount</p>
                            <p className="font-medium">${selectedCampaign.current_amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Days Remaining</p>
                            <p className="font-medium">
                                {Math.max(0, Math.ceil((new Date(selectedCampaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)))} days
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Campaign Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Active Campaigns</h2>
                    <div className="text-3xl font-bold text-blue-600">{totalCampaigns}</div>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Raised</h2>
                    <div className="text-3xl font-bold text-green-600">
                        ${totalCurrentAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                        of ${totalGoalAmount.toLocaleString()} total goal
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${Math.min((totalCurrentAmount / totalGoalAmount) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Selected Campaign Donations</h2>
                    <div className="text-3xl font-bold text-purple-600">{totalDonations}</div>
                    <div className="text-sm text-gray-500 mt-2">
                        Total: ${totalDonationAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                        Average: ${averageDonation.toFixed(2)}
                    </div>
                </div>
            </div>
            
            {/* Visualization Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Category Distribution */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Campaign Categories</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} campaigns`, 'Count']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Donation Amount Distribution */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Donation Amount Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barChartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" name="Number of Donations" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* Campaign Progress and Donation Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign Progress */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Campaign Progress</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={campaignProgressData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, value === 'current' ? 'Raised' : 'Goal']} />
                                <Legend />
                                <Bar dataKey="current" fill="#82ca9d" name="Raised" />
                                <Bar dataKey="goal" fill="#8884d8" name="Goal" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Donation Timeline */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Donation Timeline</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={lineChartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                                <Legend />
                                <Bar dataKey="amount" fill="#FFBB28" name="Daily Donations" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* Recent Donations Table */}
            {donations?.length > 0 && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Recent Donations for {selectedCampaign?.title}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentDonations?.slice(0, 5).map((donation, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {donation.is_anonymous ? 'Anonymous' : donation.user_id?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            ${donation.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {donation.payment_method}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(donation.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                                donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {donation.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignCreatorDashboard;