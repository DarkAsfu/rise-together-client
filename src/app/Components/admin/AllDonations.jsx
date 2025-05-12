'use client'
import React, { useEffect, useState } from 'react';
import DashboardTitle from '../DashboardTitle';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AllDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [filters, setFilters] = useState({
        transactionId: '',
        campaignName: '',
        donorName: '',
        status: 'ALL'
    });

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/donations`);
                setDonations(response.data);
            } catch (error) {
                console.error('Error fetching donations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const calculateProgress = (current, goal) => {
        return (current / goal) * 100;
    };

    const filteredDonations = donations.filter(donation => {
        return (
            donation?.transaction_id?.toLowerCase().includes(filters.transactionId.toLowerCase()) &&
            donation?.campaign_id?.title?.toLowerCase().includes(filters.campaignName.toLowerCase()) &&
            (donation?.is_anonymous ? 'Anonymous' : donation?.user_id?.name?.toLowerCase()).includes(filters.donorName.toLowerCase()) &&
            (filters.status === 'ALL' || donation?.status === filters.status)
        );
    });

    return (
        <div className="p-4">
            <DashboardTitle title={"All Donations"} />
            
            <div className="mb-6 flex justify-between gap-4">
                <Input
                    placeholder="Search by Transaction ID"
                    value={filters.transactionId}
                    onChange={(e) => setFilters({...filters, transactionId: e.target.value})}
                />
                <Input
                    placeholder="Search by Campaign Name"
                    value={filters.campaignName}
                    onChange={(e) => setFilters({...filters, campaignName: e.target.value})}
                />
                <Input
                    placeholder="Search by Donor Name"
                    value={filters.donorName}
                    onChange={(e) => setFilters({...filters, donorName: e.target.value})}
                />
                <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({...filters, status: value})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="VALID">Valid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Donor Name</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <span className="ml-2">Loading donations...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : filteredDonations.map((donation) => (
                        <TableRow key={donation._id}>
                            <TableCell>{donation?.is_anonymous ? 'Anonymous' : donation.user_id.name}</TableCell>
                            <TableCell>{donation?.campaign_id?.title}</TableCell>
                            <TableCell>{donation?.amount} {donation?.currency}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded ${
                                    donation.status === 'VALID' ? 'bg-green-100 text-green-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {donation.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="w-full">
                                    <Progress value={calculateProgress(
                                        donation.campaign_id?.current_amount,
                                        donation.campaign_id?.goal_amount
                                    )} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger className="text-blue-600 hover:underline">
                                        View Details
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Donation Details</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold">Transaction Information</h4>
                                                <p>Transaction ID: {donation?.transaction_id}</p>
                                                <p>Payment Method: {donation?.payment_method}</p>
                                                <p>Bank: {donation?.bank_name}</p>
                                                <p>Card Type: {donation?.card_type}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Campaign Information</h4>
                                                <p>Title: {donation?.campaign_id?.title}</p>
                                                <p>Category: {donation?.campaign_id?.category}</p>
                                                <p>Location: {donation?.campaign_id?.location}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Donor Message</h4>
                                                <p>{donation?.donor_message || 'No message'}</p>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AllDonations;