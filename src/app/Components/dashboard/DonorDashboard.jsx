'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DonorDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user_id = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/donations/user/${user_id}`);
                setDonations(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching donations:', error);
                setError(error.message);
                setLoading(false);
            }
        };
        
        if (user_id) {
            fetchDonations();
        }
    }, [user_id]);

    // Calculate statistics
    const totalDonations = donations.length;
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

    // Group donations by campaign
    const donationsByCampaign = donations.reduce((acc, donation) => {
        const campaignId = donation.campaign_id?._id || 'unknown';
        if (!acc[campaignId]) {
            acc[campaignId] = {
                campaign: donation.campaign_id?.title || 'Unknown Campaign',
                count: 0,
                amount: 0,
                category: donation.campaign_id?.category || 'Other'
            };
        }
        acc[campaignId].count += 1;
        acc[campaignId].amount += donation.amount;
        return acc;
    }, {});

    // Prepare data for charts
    const campaignData = Object.values(donationsByCampaign).map(campaign => ({
        name: campaign.campaign.length > 15 ? `${campaign.campaign.substring(0, 15)}...` : campaign.campaign,
        amount: campaign.amount,
        count: campaign.count
    }));

    const categoryData = Object.values(donationsByCampaign).reduce((acc, campaign) => {
        acc[campaign.category] = (acc[campaign.category] || 0) + campaign.amount;
        return acc;
    }, {});

    const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
        name,
        value
    }));

    // Prepare timeline data
    const timelineData = donations.reduce((acc, donation) => {
        const date = new Date(donation.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + donation.amount;
        return acc;
    }, {});

    const lineChartData = Object.entries(timelineData).map(([date, amount]) => ({
        date,
        amount
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    if (loading) return <div className="flex justify-center items-center h-screen">Loading your donation history...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Donor Dashboard</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Donations</h2>
                    <div className="text-3xl font-bold text-blue-600">{totalDonations}</div>
                    <div className="text-sm text-gray-500 mt-2">across {Object.keys(donationsByCampaign).length} campaigns</div>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Amount</h2>
                    <div className="text-3xl font-bold text-green-600">৳{totalAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mt-2">Average: ৳{averageDonation.toFixed(2)} per donation</div>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Giving Categories</h2>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="80%"
                                    cy="50%"
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, 'Amount']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* Donation Timeline */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Your Donation Timeline</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={lineChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, 'Amount']} />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" name="Donation Amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Campaign Impact */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Your Impact by Campaign</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={campaignData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip formatter={(value, name) => {
                                if (name === 'Count') return [value, 'Number of Donations'];
                                return [`৳${value.toLocaleString()}`, 'Total Donated'];
                            }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="amount" fill="#8884d8" name="Total Donated (৳)" />
                            <Bar yAxisId="right" dataKey="count" fill="#82ca9d" name="Number of Donations" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Recent Donations */}
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Recent Donations</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations.slice(0, 5).map((donation, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(donation.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {donation.campaign_id?.title || 'Unknown Campaign'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ৳{donation.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                              donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-red-100 text-red-800'}`}>
                                            {donation.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {donation.donor_message || '-'}
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

export default DonorDashboard;