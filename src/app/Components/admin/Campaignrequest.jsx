'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search } from "lucide-react";
import Swal from 'sweetalert2';
import DashboardTitle from '../DashboardTitle';
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const Campaignrequest = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
        title: '',
        category: '',
        goal_amount: '',
        location: '',
    });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns`);
            setCampaigns(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to fetch campaigns'
            });
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${id}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchCampaigns();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Campaign status updated to ${newStatus} successfully`
            });
        } catch (error) {
            console.error('Error updating status:', error.response?.data?.error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Failed to update status'
            });
        }
    };

    const handleUpdateClick = (campaign) => {
        setSelectedCampaign(campaign);
        setUpdateFormData({
            title: campaign.title,
            category: campaign.category,
            goal_amount: campaign.goal_amount,
            location: campaign.location,
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${selectedCampaign._id}`,
                updateFormData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsUpdateModalOpen(false);
            await fetchCampaigns();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Campaign updated successfully'
            });
        } catch (error) {
            console.error('Error updating campaign:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Failed to update campaign'
            });
        }
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            campaign.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || campaign.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const uniqueCategories = [...new Set(campaigns.map(campaign => campaign.category))];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <DashboardTitle title="Campaign Requests" />
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map(category => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Goal Amount</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign._id}>
                            <TableCell>{campaign.title}</TableCell>
                            <TableCell>{campaign.category}</TableCell>
                            <TableCell>${campaign.goal_amount}</TableCell>
                            <TableCell>{campaign.location}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {campaign.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => handleUpdateClick(campaign)}
                                            className="cursor-pointer"
                                        >
                                            Update Campaign
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => updateStatus(campaign._id, 'Active')}
                                            className="cursor-pointer"
                                        >
                                            Set as Active
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => updateStatus(campaign._id, 'Completed')}
                                            className="cursor-pointer"
                                        >
                                            Mark as Completed
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Campaign</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label>Title</label>
                            <Input
                                value={updateFormData.title}
                                onChange={(e) => setUpdateFormData({...updateFormData, title: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Category</label>
                            <Input
                                value={updateFormData.category}
                                onChange={(e) => setUpdateFormData({...updateFormData, category: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Goal Amount</label>
                            <Input
                                type="number"
                                value={updateFormData.goal_amount}
                                onChange={(e) => setUpdateFormData({...updateFormData, goal_amount: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label>Location</label>
                            <Input
                                value={updateFormData.location}
                                onChange={(e) => setUpdateFormData({...updateFormData, location: e.target.value})}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateSubmit}>
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Campaignrequest;